# 📝 API Documentation

## Base URL
```
Development: http://localhost:8000
Production: https://your-app.railway.app
```

## Authentication

استخدم Laravel Fortify للـ authentication:

```bash
# Login
POST /login
Content-Type: application/json

{
  "email": "admin@demo.com",
  "password": "Test123!"
}

Response:
{
  "token": "1|abc123...",
  "user": {...}
}
```

استخدم الـ token في الـ headers:
```
Authorization: Bearer 1|abc123...
```

---

## Core API

### 1. تسجيل شركة جديدة

**Endpoint:** `POST /register-company`

**Body:**
```json
{
  "company_name": "شركة التجربة",
  "subdomain": "demo",
  "admin_name": "أحمد محمد",
  "admin_email": "admin@demo.com",
  "admin_password": "Test123!@#",
  "admin_password_confirmation": "Test123!@#",
  "modules": ["accounting"]
}
```

**Response:** `201 Created`
```json
{
  "message": "Company registered successfully",
  "company": {
    "id": 1,
    "name": "شركة التجربة",
    "subdomain": "demo",
    "is_active": true
  },
  "user": {
    "id": 1,
    "name": "أحمد محمد",
    "email": "admin@demo.com",
    "company_id": 1,
    "role": "admin"
  }
}
```

### 2. إضافة وحدات للشركة

**Endpoint:** `POST /core/companies/{company_id}/modules`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "modules": ["accounting", "hr", "inventory"]
}
```

**Response:** `200 OK`
```json
{
  "message": "Modules assigned successfully",
  "company": {
    "id": 1,
    "modules": [...]
  }
}
```

### 3. تفعيل/تعطيل وحدة

**Endpoint:** `PATCH /core/companies/{company_id}/modules/toggle`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "module_key": "accounting",
  "status": "active"
}
```

**Response:** `200 OK`
```json
{
  "message": "Module status updated successfully"
}
```

---

## Accounting API

**Note:** كل endpoints تحتاج:
- Authentication: `Bearer token`
- Module: `accounting` مفعّل للشركة

### 1. دليل الحسابات

#### GET /accounting/accounts
```bash
curl -X GET http://localhost:8000/accounting/accounts \
  -H "Authorization: Bearer {token}"
```

**Response:**
```json
{
  "accounts": [
    {
      "id": 1,
      "code": "1000",
      "name": "Cash",
      "type": "Asset",
      "company_id": 1
    }
  ]
}
```

#### POST /accounting/accounts
```json
{
  "code": "1100",
  "name": "Petty Cash",
  "type": "Asset"
}
```

### 2. القيود اليومية

#### GET /accounting/journal-entries
```bash
curl -X GET http://localhost:8000/accounting/journal-entries \
  -H "Authorization: Bearer {token}"
```

**Response:**
```json
{
  "entries": [
    {
      "id": 1,
      "date": "2026-02-06",
      "description": "Invoice #1 - Client A",
      "reference_number": "INV-1",
      "total_debits": 5000.00,
      "total_credits": 5000.00,
      "is_balanced": true,
      "lines": [
        {
          "account": "Accounts Receivable",
          "debit": 5000.00,
          "credit": 0
        },
        {
          "account": "Sales Revenue",
          "debit": 0,
          "credit": 5000.00
        }
      ]
    }
  ]
}
```

#### POST /accounting/journal-entries
```json
{
  "date": "2026-02-06",
  "description": "Manual journal entry",
  "reference_number": "JE-001",
  "lines": [
    {
      "account_id": 1,
      "debit": 1000.00,
      "credit": 0
    },
    {
      "account_id": 2,
      "debit": 0,
      "credit": 1000.00
    }
  ]
}
```

**Validation:** مجموع Debits = مجموع Credits

### 3. الفواتير

#### POST /accounting/invoices
```json
{
  "client_name": "عميل تجريبي",
  "total": 5000.00,
  "status": "posted"
}
```

**Response:**
```json
{
  "invoice": {
    "id": 1,
    "client_name": "عميل تجريبي",
    "total": 5000.00,
    "status": "posted",
    "company_id": 1
  },
  "journal_entry": {
    "id": 1,
    "description": "Invoice #1 - عميل تجريبي",
    "total_debits": 5000.00,
    "total_credits": 5000.00
  }
}
```

**القيد التلقائي:**
```
من: الذمم المدينة    5000
    إلى: إيرادات المبيعات    5000
```

### 4. المدفوعات

#### POST /accounting/payments
```json
{
  "invoice_id": 1,
  "amount": 3000.00,
  "payment_date": "2026-02-06",
  "payment_method": "bank_transfer",
  "reference_number": "PAY-001"
}
```

**Response:**
```json
{
  "payment": {
    "id": 1,
    "invoice_id": 1,
    "amount": 3000.00,
    "payment_date": "2026-02-06",
    "payment_method": "bank_transfer"
  },
  "journal_entry": {
    "id": 2,
    "description": "Payment #1 for Invoice #1",
    "total_debits": 3000.00,
    "total_credits": 3000.00
  }
}
```

**القيد التلقائي:**
```
من: البنك           3000
    إلى: الذمم المدينة    3000
```

### 5. ميزان المراجعة

#### GET /accounting/trial-balance

**Query Parameters:**
- `start_date` (optional): تاريخ البداية
- `end_date` (optional): تاريخ النهاية
- `grouped` (optional): true/false - تجميع حسب النوع
- `company_id` (optional): للـ super admin فقط

**Example:**
```bash
curl -X GET "http://localhost:8000/accounting/trial-balance?start_date=2026-01-01&end_date=2026-12-31&grouped=true" \
  -H "Authorization: Bearer {token}"
```

**Response:**
```json
{
  "grouped_accounts": [
    {
      "type": "Asset",
      "accounts": [
        {
          "code": "1000",
          "name": "Cash",
          "debit": 3000.00,
          "credit": 0,
          "balance": 3000.00
        },
        {
          "code": "1200",
          "name": "Accounts Receivable",
          "debit": 5000.00,
          "credit": 3000.00,
          "balance": 2000.00
        }
      ],
      "total_debit": 8000.00,
      "total_credit": 3000.00
    },
    {
      "type": "Revenue",
      "accounts": [
        {
          "code": "4000",
          "name": "Sales Revenue",
          "debit": 0,
          "credit": 5000.00,
          "balance": -5000.00
        }
      ],
      "total_debit": 0,
      "total_credit": 5000.00
    }
  ],
  "totals": {
    "debit": 8000.00,
    "credit": 8000.00,
    "difference": 0,
    "is_balanced": true
  },
  "period": {
    "start_date": "2026-01-01",
    "end_date": "2026-12-31"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
  "message": "Module not enabled for this workspace"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 422 Unprocessable Entity
```json
{
  "message": "Journal entry is not balanced",
  "details": {
    "total_debits": 1000.00,
    "total_credits": 900.00,
    "difference": 100.00
  }
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "..."
}
```

---

## Testing with cURL

### Full Flow Example

```bash
# 1. Register Company
curl -X POST http://localhost:8000/register-company \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Test Co",
    "subdomain": "test",
    "admin_name": "Admin",
    "admin_email": "admin@test.com",
    "admin_password": "Test123!",
    "admin_password_confirmation": "Test123!",
    "modules": ["accounting"]
  }'

# 2. Login
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test123!"
  }'
# Save the token

# 3. Create Invoice
curl -X POST http://localhost:8000/accounting/invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Client A",
    "total": 5000,
    "status": "posted"
  }'

# 4. Create Payment
curl -X POST http://localhost:8000/accounting/payments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_id": 1,
    "amount": 3000,
    "payment_date": "2026-02-06",
    "payment_method": "bank"
  }'

# 5. Get Trial Balance
curl -X GET "http://localhost:8000/accounting/trial-balance?grouped=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Postman Collection

يمكنك استيراد هذا الـ collection:

```json
{
  "info": {
    "name": "ERP Multi-Tenant API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Register Company",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/register-company",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"company_name\": \"Test\",\n  \"subdomain\": \"test\",\n  \"admin_name\": \"Admin\",\n  \"admin_email\": \"admin@test.com\",\n  \"admin_password\": \"Test123!\",\n  \"admin_password_confirmation\": \"Test123!\",\n  \"modules\": [\"accounting\"]\n}"
        }
      }
    }
  ]
}
```

---

## Rate Limiting

- **Default:** 60 requests per minute per IP
- **Authenticated:** 300 requests per minute per user

---

## Webhooks (Future)

```json
POST https://your-app.com/webhook
{
  "event": "invoice.posted",
  "data": {
    "invoice_id": 1,
    "journal_entry_id": 1
  }
}
```

---

**Last Updated:** 2026-02-06
