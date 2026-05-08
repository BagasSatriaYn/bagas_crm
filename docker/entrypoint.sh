#!/bin/sh
set -e

echo "==> [1/5] Generating APP_KEY if missing..."
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force --no-interaction
fi

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

# Tailing Laravel logs ke stdout agar muncul di Railway
touch /var/www/html/storage/logs/laravel.log
tail -f /var/www/html/storage/logs/laravel.log &

echo "==> [5/5] Starting services via Supervisor..."
# Background loop untuk cek port setelah startup
(
    sleep 5
    echo "==> [Background] Checking ports after startup..."
    netstat -tulpn
    echo "==> [Background] Checking if index.php exists..."
    ls -l /var/www/html/public/index.php
) &

mkdir -p /var/log/supervisor

# Ganti port 80 di nginx.conf dengan port dari Railway ($PORT)
NGINX_PORT="${PORT:-80}"
sed -i "s/listen [0-9]\+;/listen 0.0.0.0:${NGINX_PORT};/g" /etc/nginx/nginx.conf
echo "==> Nginx configured to listen on 0.0.0.0:$NGINX_PORT"

# Tes konfigurasi nginx
echo "==> Testing Nginx configuration..."
nginx -t

chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
