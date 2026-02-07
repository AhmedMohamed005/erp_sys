#!/bin/bash
set -e

cd /var/www/html

# ---------- generate APP_KEY if missing ----------
if [ -z "$APP_KEY" ] && [ -f .env ]; then
  if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
    echo "🔑 Generating APP_KEY..."
    php artisan key:generate --force || true
  fi
fi

# ---------- ensure storage dirs exist ----------
mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# ---------- wait for database ----------
if [ -n "$DB_HOST" ]; then
  DB_PORT="${DB_PORT:-5432}"
  echo "⏳ Waiting for DB at $DB_HOST:$DB_PORT..."
  i=0
  while ! bash -c "echo > /dev/tcp/$DB_HOST/$DB_PORT" 2>/dev/null; do
    i=$((i+1))
    if [ $i -ge 30 ]; then
      echo "⚠️  DB wait timed out after 30s — continuing anyway"
      break
    fi
    sleep 1
  done
  echo "✅ DB check completed"
fi

# ---------- Laravel optimizations ----------
php artisan config:cache  || true
php artisan route:cache   || true
php artisan view:cache    || true

# ---------- migrations (opt-in) ----------
if [ "$RUN_MIGRATIONS" = "1" ]; then
  echo "🔄 Running migrations..."
  php artisan migrate --force || true
fi

echo "🚀 Starting services..."

# ---------- hand off to supervisor ----------
exec "$@"
