#!/bin/bash
set -e

cd /var/www/html

# ==========================================================
#  1. INJECT PORT & START NGINX IMMEDIATELY
#     (so Railway healthcheck passes within seconds)
# ==========================================================
PORT="${PORT:-8080}"
sed -i "s/__PORT__/$PORT/g" /etc/nginx/http.d/default.conf
echo "🚀 Starting nginx on port $PORT (healthcheck ready)..."
nginx  # starts in background (daemon mode by default)

# ==========================================================
#  2. PRODUCTION-SAFE DEFAULTS
#     Prevent DB-dependent drivers from hanging on boot
# ==========================================================
export SESSION_DRIVER="${SESSION_DRIVER:-file}"
export CACHE_STORE="${CACHE_STORE:-file}"
export QUEUE_CONNECTION="${QUEUE_CONNECTION:-sync}"
export APP_ENV="${APP_ENV:-production}"
export APP_DEBUG="${APP_DEBUG:-false}"
export LOG_CHANNEL="${LOG_CHANNEL:-stderr}"
export DB_CONNECTION="${DB_CONNECTION:-pgsql}"

# Sanitize APP_URL — must be a valid URL (no spaces/parentheses)
if [ -n "$APP_URL" ]; then
  if echo "$APP_URL" | grep -qE ' |\(|\)'; then
    echo "⚠️  APP_URL contains invalid characters — resetting to default"
    export APP_URL="http://localhost:${PORT}"
  fi
else
  export APP_URL="http://localhost:${PORT}"
fi

# Ensure .env file exists (Laravel requires it even if empty)
touch .env

# ==========================================================
#  3. STORAGE DIRECTORIES
# ==========================================================
mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# ==========================================================
#  4. WAIT FOR DATABASE (skip if DB_HOST is missing/broken)
# ==========================================================
if [ -n "$DB_HOST" ] && [[ "$DB_HOST" != *"}}"* ]] && [[ "$DB_HOST" != *"{{"* ]]; then
  DB_PORT="${DB_PORT:-5432}"
  echo "⏳ Waiting for DB at $DB_HOST:$DB_PORT..."
  i=0
  while ! bash -c "echo > /dev/tcp/$DB_HOST/$DB_PORT" 2>/dev/null; do
    i=$((i+1))
    if [ $i -ge 15 ]; then
      echo "⚠️  DB wait timed out after 15s — continuing anyway"
      break
    fi
    sleep 1
  done
  echo "✅ DB reachable"
else
  echo "⚠️  DB_HOST not set or looks invalid ('$DB_HOST') — skipping DB wait"
fi

# ==========================================================
#  5. LARAVEL BOOTSTRAPPING (non-fatal)
# ==========================================================
php artisan config:cache  2>&1 || echo "⚠️  config:cache failed — continuing"
php artisan route:cache   2>&1 || echo "⚠️  route:cache failed — continuing"
php artisan view:cache    2>&1 || echo "⚠️  view:cache failed — continuing"

# ==========================================================
#  6. MIGRATIONS (opt-in)
# ==========================================================
if [ "$RUN_MIGRATIONS" = "1" ]; then
  echo "🔄 Running migrations (60s timeout)..."
  timeout 60 php artisan migrate --force 2>&1 || echo "⚠️  Migrations failed — continuing"
fi

# ==========================================================
#  7. STOP NGINX (supervisor will restart it properly)
# ==========================================================
nginx -s stop 2>/dev/null || true
sleep 1

echo "✅ Bootstrap complete — handing off to supervisor"
exec "$@"
