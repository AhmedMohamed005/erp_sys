# 🚀 Deploy Instructions

## خيار 1: Railway (الأسهل - موصى به)

### 1. التسجيل والربط
```bash
# Install CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
cd backend/Erp_project
railway init

# Link to PostgreSQL
railway add --database postgres
```

### 2. ضبط Environment Variables
في Railway Dashboard:
```
APP_NAME=ERP Demo
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:... (copy from local .env)
APP_URL=https://your-app.railway.app

DB_CONNECTION=pgsql
DB_HOST=${{PGHOST}}
DB_PORT=${{PGPORT}}
DB_DATABASE=${{PGDATABASE}}
DB_USERNAME=${{PGUSER}}
DB_PASSWORD=${{PGPASSWORD}}
```

### 3. Deploy
```bash
railway up

# Run migrations
railway run php artisan migrate --force
railway run php artisan db:seed --force --class=ModuleSeeder

# Get URL
railway open
```

✅ **Done! Demo URL:** `https://your-project.railway.app`

---

## خيار 2: Render

### 1. إنشاء Web Service
1. Push code to GitHub
2. Render Dashboard → New Web Service
3. Connect GitHub repo
4. Branch: `main`
5. Root Directory: `backend/Erp_project`

### 2. Build Settings
```
Build Command:
composer install --no-dev --optimize-autoloader

Start Command:
php artisan config:cache && php artisan route:cache && php artisan serve --host=0.0.0.0 --port=$PORT
```

### 3. إنشاء PostgreSQL Database
1. Dashboard → New PostgreSQL
2. Copy connection details

### 4. Environment Variables
```
APP_NAME=ERP Demo
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:... (generate via: php artisan key:generate --show)
APP_URL=https://your-app.onrender.com

DB_CONNECTION=pgsql
DB_HOST=[from Render Postgres]
DB_PORT=5432
DB_DATABASE=[from Render Postgres]
DB_USERNAME=[from Render Postgres]
DB_PASSWORD=[from Render Postgres]
```

### 5. Run Migrations
Shell في Render:
```bash
php artisan migrate --force
php artisan db:seed --force --class=ModuleSeeder
```

✅ **Done! Demo URL:** `https://your-app.onrender.com`

---

## خيار 3: Fly.io

### 1. Install & Login
```bash
# Install CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login
```

### 2. Launch App
```bash
cd backend/Erp_project

fly launch
# Choose name, region
# Add PostgreSQL? Yes

# Deploy
fly deploy
```

### 3. Run Migrations
```bash
fly ssh console -C "php artisan migrate --force"
fly ssh console -C "php artisan db:seed --force --class=ModuleSeeder"
```

✅ **Done! Demo URL:** `https://your-app.fly.dev`

---

## خيار 4: DigitalOcean App Platform

### 1. الربط
1. GitHub → Connect repo
2. App Spec:

```yaml
name: erp-demo
services:
  - name: web
    source_dir: backend/Erp_project
    github:
      repo: your-username/repo-name
      branch: main
    build_command: composer install --no-dev
    run_command: php artisan serve --host=0.0.0.0 --port=$PORT
    environment_slug: php
databases:
  - name: db
    engine: PG
    version: "14"
```

### 2. Environment Variables
```
APP_KEY=... (generate)
DB_CONNECTION=pgsql
DB_HOST=${db.HOSTNAME}
DB_PORT=${db.PORT}
DB_DATABASE=${db.DATABASE}
DB_USERNAME=${db.USERNAME}
DB_PASSWORD=${db.PASSWORD}
```

### 3. Migrations
Console → Run:
```bash
php artisan migrate --force
php artisan db:seed --force --class=ModuleSeeder
```

---

## ⚡ Quick Deploy با GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Railway CLI
        run: npm i -g @railway/cli
      
      - name: Deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: railway up
      
      - name: Run Migrations
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          railway run php artisan migrate --force
          railway run php artisan db:seed --force --class=ModuleSeeder
```

---

## 🧪 اختبار الـ Demo

بعد Deploy:

### 1. Health Check
```bash
curl https://your-app.railway.app
# Expected: Laravel welcome page
```

### 2. تسجيل شركة
```bash
curl -X POST https://your-app.railway.app/register-company \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Demo Company",
    "subdomain": "demo",
    "admin_name": "Test Admin",
    "admin_email": "admin@demo.com",
    "admin_password": "Test123!",
    "admin_password_confirmation": "Test123!",
    "modules": ["accounting"]
  }'
```

### 3. Seed Accounts (via SSH/Console)
```bash
# Railway
railway run bash
php artisan db:seed --class=ChartOfAccountsSeeder
# Enter company_id: 1

# Render
# Via Shell in dashboard
php artisan db:seed --class=ChartOfAccountsSeeder
```

### 4. Test APIs
```bash
# Login (get token)
curl -X POST https://your-app/login \
  -d "email=admin@demo.com" \
  -d "password=Test123!"

# Get Trial Balance
curl https://your-app/accounting/trial-balance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 Troubleshooting

### مشكلة: 500 Error
```bash
# Check logs
railway logs  # Railway
# or Render dashboard logs

# Common fixes:
1. APP_KEY not set → railway run php artisan key:generate
2. Migrations not run → railway run php artisan migrate --force
3. Cache issues → railway run php artisan config:clear
```

### مشكلة: Database connection failed
```bash
# Verify environment variables
railway variables  # Railway

# Test connection
railway run php artisan tinker
>>> DB::connection()->getPdo();
```

### مشكلة: Route not found
```bash
# Clear caches
railway run php artisan route:clear
railway run php artisan config:clear
railway run php artisan cache:clear
```

---

## 📊 مقارنة الخيارات

| Platform | السهولة | السرعة | المجانية | التقييم |
|----------|---------|--------|----------|---------|
| Railway | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ | $5 credit | **الأفضل** |
| Render | ⭐⭐⭐⭐ | ⚡⚡ | Free tier | جيد |
| Fly.io | ⭐⭐⭐ | ⚡⚡⚡ | Free tier | متوسط |
| DigitalOcean | ⭐⭐⭐ | ⚡⚡ | $5/month | جيد |

**التوصية:** Railway للـ demo السريع ✅

---

## ✅ Checklist قبل التسليم

- [ ] Deploy تم بنجاح
- [ ] Database متصلة
- [ ] Migrations تمت
- [ ] Module seeding تم
- [ ] Chart of accounts seeded لشركة واحدة على الأقل
- [ ] API `/register-company` يعمل
- [ ] API `/accounting/trial-balance` يعمل
- [ ] Demo URL عام ومتاح
- [ ] GitHub repo public
- [ ] README مكتمل

---

**وقت Deploy المتوقع:** 15-30 دقيقة  
**الموعد النهائي:** 6-2-2026 | 10 مساءً

🚀 **Good luck!**
