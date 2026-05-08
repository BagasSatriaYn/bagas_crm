# ============================================================
#  Stage 1 – Build Frontend Assets (Node.js)
# ============================================================
FROM node:20-alpine AS node_builder

WORKDIR /app

# Install Node dependencies
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy source & build production assets
COPY . .
RUN npm run build

# ============================================================
#  Stage 2 – Production PHP Image
# ============================================================
FROM php:8.3-fpm-alpine AS php_production

# Install system dependencies & PHP extensions
RUN apk add --no-cache \
        bash \
        curl \
        libpng-dev \
        libzip-dev \
        zip \
        unzip \
        oniguruma-dev \
        mysql-client \
        nginx \
        supervisor \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        zip \
        gd \
        bcmath \
        opcache

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application source code
COPY . .

# Copy built frontend assets from Stage 1
COPY --from=node_builder /app/public/build ./public/build

RUN mkdir -p bootstrap/cache storage/framework/views storage/framework/cache storage/framework/sessions storage/logs
RUN chmod -R 777 bootstrap/cache storage

# Install PHP dependencies (production only)
RUN composer install \
        --no-dev \
        --optimize-autoloader \
        --no-interaction \
        --prefer-dist

# Set correct file permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Copy config files
COPY docker/nginx.conf      /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/php.ini         /usr/local/etc/php/conf.d/custom.ini
COPY docker/entrypoint.sh   /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
