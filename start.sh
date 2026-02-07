#!/bin/bash
set -e

# Go to Laravel project folder
cd backend/Erp_project

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Prepare Laravel caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Make storage & bootstrap/cache writable
mkdir -p storage/framework/{sessions,views,cache,testing} storage/logs bootstrap/cache
chmod -R a+rw storage bootstrap/cache

# Run migrations
php artisan migrate --force

# Start Laravel server
php artisan serve --host=0.0.0.0 --port=$PORT
