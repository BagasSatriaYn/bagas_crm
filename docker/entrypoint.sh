#!/bin/sh
set -e

echo "==> [1/5] Generating APP_KEY if missing..."

echo "==> [2/5] Caching config & routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> [3/5] Running database migrations..."
php artisan migrate --force --no-interaction

echo "==> [4/5] Seeding database (only if empty)..."
LEAD_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null | tail -1 || echo "0")
if [ "$LEAD_COUNT" = "0" ]; then
    echo "     Database kosong, menjalankan seeder..."
    php artisan db:seed --force --no-interaction
else
    echo "     Database sudah ada data ($LEAD_COUNT users), skip seeding."
fi

echo "==> [5/5] Starting services via Supervisor..."
mkdir -p /var/log/supervisor
sed -i "listen 80;/listen ${PORT:-80};/g" /etc/nginx/nginx.conf
chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
