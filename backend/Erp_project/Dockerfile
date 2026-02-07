# =============================================================
# Self-contained Backend Image  (Nginx + PHP-FPM + Supervisor)
# Deployable on Railway / Render / Fly.io as a single service
# =============================================================
FROM php:8.2-fpm-alpine AS base

# ---- system deps & PHP extensions ----
RUN apk add --no-cache \
    bash curl nginx supervisor nodejs npm \
    icu-dev libzip-dev postgresql-dev zlib-dev \
    && docker-php-ext-install pdo pdo_pgsql pcntl zip intl bcmath opcache

# ---- composer ----
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ---- working directory ----
WORKDIR /var/www/html

# ---- install PHP deps (cached layer) ----
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts --no-plugins || true

# ---- copy application code ----
COPY . .

# ---- optimize autoloader ----
RUN composer dump-autoload --optimize

# ---- build frontend assets (Inertia/Vite) ----
RUN npm ci --silent && npm run build && rm -rf node_modules

# ---- permissions ----
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# ---- nginx config ----
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# ---- supervisor config (runs both nginx & php-fpm) ----
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ---- entrypoint ----
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# ---- PORT (Railway / Render inject $PORT) ----
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
