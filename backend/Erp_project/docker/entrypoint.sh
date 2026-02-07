#!/bin/sh
set -e

cd /var/www/html

# ---------- wait for database ----------
if [ -n "$DB_HOST" ]; then
  echo "⏳ Waiting for DB at $DB_HOST:${DB_PORT:-5432}..."
  timeout=30; i=0
  while ! nc -z "$DB_HOST" "${DB_PORT:-5432}" 2>/dev/null; do
    i=$((i+1))
    [ $i -ge $timeout ] && echo "DB wait timed out" && break
    sleep 1
  done
fi

# ---------- Laravel optimizations ----------
php artisan config:cache  || true
php artisan route:cache   || true
php artisan view:cache    || true

# ---------- migrations (opt-in) ----------
if [ "$RUN_MIGRATIONS" = "1" ]; then
  echo "🔄 Running migrations..."
  php artisan migrate --force
fi

# ---------- hand off to supervisor ----------
exec "$@"
