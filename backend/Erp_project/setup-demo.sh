#!/bin/bash

# 🚀 Quick Demo Setup Script
# Run this after cloning the repo

echo "🏢 Multi-Tenant ERP - Demo Setup"
echo "================================"
echo ""

# Check PHP
echo "✓ Checking PHP version..."
php -v | head -1

# Check PostgreSQL
echo "✓ Checking PostgreSQL..."
psql --version | head -1

echo ""
echo "📦 Installing dependencies..."
composer install

echo ""
echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ .env created"
fi

php artisan key:generate

echo ""
echo "🗄️  Database setup"
read -p "Enter PostgreSQL database name [erp_demo]: " DB_NAME
DB_NAME=${DB_NAME:-erp_demo}

read -p "Enter PostgreSQL username [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Enter PostgreSQL password: " DB_PASS
echo ""

# Update .env
sed -i "s/DB_DATABASE=erp_demo/DB_DATABASE=$DB_NAME/" .env
sed -i "s/DB_USERNAME=postgres/DB_USERNAME=$DB_USER/" .env
sed -i "s/DB_PASSWORD=/DB_PASSWORD=$DB_PASS/" .env

echo ""
echo "🏗️  Creating database..."
PGPASSWORD=$DB_PASS createdb -U $DB_USER $DB_NAME 2>/dev/null

echo "🔄 Running migrations..."
php artisan migrate --force

echo "🌱 Seeding modules..."
php artisan db:seed --force --class=ModuleSeeder

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Start server:"
echo "   php artisan serve"
echo ""
echo "📝 Next steps:"
echo "   1. Create a company: POST /register-company"
echo "   2. Seed accounts: php artisan db:seed --class=ChartOfAccountsSeeder"
echo "   3. Check README.md for API examples"
echo ""
echo "🎉 Demo ready!"
