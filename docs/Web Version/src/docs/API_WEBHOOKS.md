# AuraFlow POS - API & Webhook Documentation

**Version**: 1.0  
**Last Updated**: October 25, 2025  
**Base URL**: `https://api.auraflowpos.com/v1`  

---

## 🔐 Authentication

AuraFlow POS uses API Key + Secret authentication.

### Getting Your API Keys

1. Login to Admin Dashboard
2. Navigate to Settings → Integrations → API Keys
3. Click "Generate New API Key"
4. Copy both `API_KEY` and `API_SECRET` immediately (secret shown only once)
5. Store securely (never commit to git!)

### Making Authenticated Requests

**Headers Required**:
```
X-API-Key: your_api_key_here
X-API-Secret: your_api_secret_here
Content-Type: application/json
```

**Example (cURL)**:
```bash
curl -X GET "https://api.auraflowpos.com/v1/products" \
  -H "X-API-Key: pk_live_abc123" \
  -H "X-API-Secret: sk_live_xyz789" \
  -H "Content-Type: application/json"
```

**Example (JavaScript)**:
```javascript
const response = await fetch('https://api.auraflowpos.com/v1/products', {
  method: 'GET',
  headers: {
    'X-API-Key': 'pk_live_abc123',
    'X-API-Secret': 'sk_live_xyz789',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

---

## 📊 Endpoints

### **Products**

#### `GET /products`
Get all products

**Query Parameters**:
- `limit` (optional): Results per page (default: 50, max: 100)
- `offset` (optional): Pagination offset
- `category` (optional): Filter by category
- `active` (optional): `true` or `false`

**Response**:
```json
{
  "data": [
    {
      "id": "prod_123",
      "name": "Espresso",
      "price": 3.50,
      "category": "Beverages",
      "sku": "ESP-001",
      "barcode": "123456789",
      "stock": 100,
      "active": true,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-20T14:22:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

#### `GET /products/:id`
Get single product by ID

**Response**:
```json
{
  "id": "prod_123",
  "name": "Espresso",
  "price": 3.50,
  "category": "Beverages",
  "sku": "ESP-001",
  "barcode": "123456789",
  "stock": 100,
  "variations": [
    {
      "id": "var_001",
      "name": "Small",
      "price_modifier": -0.50
    }
  ],
  "active": true
}
```

#### `POST /products`
Create new product

**Request Body**:
```json
{
  "name": "Cappuccino",
  "price": 4.00,
  "category": "Beverages",
  "sku": "CAP-001",
  "barcode": "987654321",
  "stock": 50,
  "active": true
}
```

#### `PUT /products/:id`
Update existing product

#### `DELETE /products/:id`
Delete product (soft delete)

---

### **Customers**

#### `GET /customers`
Get all customers

**Query Parameters**:
- `limit`, `offset`: Pagination
- `search`: Search by name, email, phone
- `segment`: Filter by lifecycle stage (`new`, `active`, `vip`, `at-risk`, `churned`)

**Response**:
```json
{
  "data": [
    {
      "id": "cust_456",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "lifecycle_stage": "active",
      "total_purchases": 15,
      "lifetime_value": 450.00,
      "created_at": "2024-06-10T09:00:00Z",
      "last_purchase": "2025-01-18T15:30:00Z"
    }
  ]
}
```

#### `GET /customers/:id`
Get single customer

#### `POST /customers`
Create new customer

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1987654321",
  "notes": "Prefers oat milk"
}
```

#### `PUT /customers/:id`
Update customer

#### `DELETE /customers/:id`
Delete customer

---

### **Transactions**

#### `GET /transactions`
Get all transactions

**Query Parameters**:
- `start_date`, `end_date`: Date range (ISO 8601 format)
- `type`: `sale`, `return`, `void`
- `payment_method`: Filter by payment method
- `customer_id`: Filter by customer

**Response**:
```json
{
  "data": [
    {
      "id": "txn_789",
      "type": "sale",
      "total": 25.50,
      "subtotal": 23.00,
      "tax": 2.50,
      "items": [
        {
          "product_id": "prod_123",
          "name": "Espresso",
          "quantity": 2,
          "unit_price": 3.50,
          "total": 7.00
        }
      ],
      "payment_method": "card",
      "customer": {
        "id": "cust_456",
        "name": "John Doe"
      },
      "cashier": {
        "id": "user_111",
        "name": "Alice Johnson"
      },
      "terminal": "Register 1",
      "timestamp": "2025-01-20T14:35:00Z"
    }
  ]
}
```

#### `GET /transactions/:id`
Get single transaction

#### `POST /transactions`
Create transaction (for POS integrations)

---

### **Inventory**

#### `GET /inventory/levels`
Get current stock levels

**Response**:
```json
{
  "data": [
    {
      "product_id": "prod_123",
      "product_name": "Espresso",
      "current_stock": 100,
      "low_stock_threshold": 20,
      "status": "in_stock"
    }
  ]
}
```

#### `POST /inventory/adjust`
Adjust inventory levels

**Request Body**:
```json
{
  "product_id": "prod_123",
  "adjustment": -10,
  "reason": "Manual count adjustment",
  "notes": "Stock take correction"
}
```

#### `GET /inventory/history`
Get inventory movement history

---

### **Reports**

#### `GET /reports/sales`
Get sales summary

**Query Parameters**:
- `start_date`, `end_date`: Date range
- `group_by`: `day`, `week`, `month`, `year`

**Response**:
```json
{
  "summary": {
    "total_sales": 15420.50,
    "total_transactions": 342,
    "average_ticket": 45.09,
    "total_items_sold": 1250
  },
  "breakdown": [
    {
      "date": "2025-01-20",
      "sales": 850.00,
      "transactions": 25,
      "average_ticket": 34.00
    }
  ]
}
```

#### `GET /reports/top-products`
Get top selling products

#### `GET /reports/employee-performance`
Get employee sales performance

---

## 🔔 Webhooks

Webhooks allow you to receive real-time notifications when events occur in AuraFlow POS.

### Setting Up Webhooks

1. Admin Dashboard → Settings → Integrations → Webhooks
2. Click "Add Webhook Endpoint"
3. Enter your endpoint URL
4. Select events to subscribe to
5. Save and note your webhook secret

### Webhook Events

#### `transaction.completed`
Fired when a sale is completed

**Payload**:
```json
{
  "event": "transaction.completed",
  "timestamp": "2025-01-20T14:35:00Z",
  "data": {
    "transaction_id": "txn_789",
    "type": "sale",
    "total": 25.50,
    "payment_method": "card",
    "customer": {
      "id": "cust_456",
      "name": "John Doe"
    }
  }
}
```

#### `customer.created`
New customer registered

**Payload**:
```json
{
  "event": "customer.created",
  "timestamp": "2025-01-20T10:15:00Z",
  "data": {
    "customer_id": "cust_999",
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

#### `customer.updated`
Customer information updated

#### `inventory.low_stock`
Product stock below threshold

**Payload**:
```json
{
  "event": "inventory.low_stock",
  "timestamp": "2025-01-20T09:00:00Z",
  "data": {
    "product_id": "prod_123",
    "product_name": "Espresso Beans",
    "current_stock": 5,
    "threshold": 20
  }
}
```

#### `shift.closed`
Cashier shift closed (end of day)

**Payload**:
```json
{
  "event": "shift.closed",
  "timestamp": "2025-01-20T22:00:00Z",
  "data": {
    "shift_id": "shift_555",
    "user": {
      "id": "user_111",
      "name": "Alice Johnson"
    },
    "terminal": "Register 1",
    "total_sales": 2340.50,
    "transaction_count": 52,
    "cash_collected": 340.00,
    "card_collected": 2000.50
  }
}
```

### Webhook Security

All webhook requests include a signature header for verification.

**Headers**:
```
X-Webhook-Signature: sha256=abc123...
X-Webhook-Timestamp: 1705764300
```

**Verification (Node.js)**:
```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// Usage in Express.js
app.post('/webhooks/auraflow', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhook(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  const event = req.body.event;
  console.log(`Received event: ${event}`);
  
  res.status(200).send('OK');
});
```

### Retry Logic

- Failed webhooks are retried up to 3 times
- Exponential backoff: 1min, 5min, 15min
- Endpoint must respond with 2xx status within 10 seconds
- After 3 failures, webhook is marked as failed (manual retry available in dashboard)

---

## 📈 Rate Limits

**Standard Plan**:
- 1,000 requests per hour
- 60 requests per minute
- Burst: 100 requests in 10 seconds

**Premium Plan**:
- 10,000 requests per hour
- 600 requests per minute
- Burst: 1,000 requests in 10 seconds

**Rate Limit Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 850
X-RateLimit-Reset: 1705768800
```

**Rate Limit Exceeded Response**:
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Please retry after 1705768800",
  "retry_after": 300
}
```

---

## 🚨 Error Handling

### HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Invalid API keys
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Response Format

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Product price must be greater than 0",
    "field": "price",
    "details": {
      "received": -5.00,
      "expected": "positive number"
    }
  }
}
```

### Common Error Codes

- `invalid_request`: Malformed request
- `invalid_credentials`: Bad API key/secret
- `resource_not_found`: Entity doesn't exist
- `validation_error`: Data validation failed
- `rate_limit_exceeded`: Too many requests
- `server_error`: Internal error (contact support)

---

## 🧪 Testing

### Sandbox Mode

Test your integration without affecting live data.

**Sandbox Base URL**: `https://api-sandbox.auraflowpos.com/v1`

**Sandbox API Keys**: Use keys prefixed with `pk_test_` and `sk_test_`

### Test Cards (Sandbox)

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Insufficient funds: `4000 0000 0000 9995`

---

## 📚 Code Examples

### Full Example: Create Product & Track Sale

```javascript
const AURAFLOW_API_KEY = 'pk_live_abc123';
const AURAFLOW_SECRET = 'sk_live_xyz789';
const BASE_URL = 'https://api.auraflowpos.com/v1';

// Helper function
async function auraflowAPI(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'X-API-Key': AURAFLOW_API_KEY,
      'X-API-Secret': AURAFLOW_SECRET,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
  
  return response.json();
}

// Create a product
const newProduct = await auraflowAPI('/products', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Latte',
    price: 4.50,
    category: 'Beverages',
    sku: 'LAT-001'
  })
});

console.log('Created product:', newProduct);

// Get all transactions from today
const today = new Date().toISOString().split('T')[0];
const transactions = await auraflowAPI(
  `/transactions?start_date=${today}&end_date=${today}`
);

console.log(`Transactions today: ${transactions.data.length}`);
console.log(`Total sales: $${transactions.data.reduce((sum, t) => sum + t.total, 0)}`);
```

### Python Example

```python
import requests
import json
from datetime import datetime

API_KEY = 'pk_live_abc123'
API_SECRET = 'sk_live_xyz789'
BASE_URL = 'https://api.auraflowpos.com/v1'

def auraflow_api(endpoint, method='GET', data=None):
    headers = {
        'X-API-Key': API_KEY,
        'X-API-Secret': API_SECRET,
        'Content-Type': 'application/json'
    }
    
    url = f"{BASE_URL}{endpoint}"
    
    if method == 'GET':
        response = requests.get(url, headers=headers)
    elif method == 'POST':
        response = requests.post(url, headers=headers, json=data)
    elif method == 'PUT':
        response = requests.put(url, headers=headers, json=data)
    elif method == 'DELETE':
        response = requests.delete(url, headers=headers)
    
    response.raise_for_status()
    return response.json()

# Get top 10 products
products = auraflow_api('/products?limit=10')
print(f"Total products: {products['pagination']['total']}")

# Create customer
new_customer = auraflow_api('/customers', method='POST', data={
    'name': 'John Doe',
    'email': 'john@example.com',
    'phone': '+1234567890'
})

print(f"Created customer: {new_customer['id']}")
```

---

## 🆘 Support

- **Documentation**: docs.auraflowpos.com/api
- **Email**: api-support@auraflowpos.com
- **Community**: community.auraflowpos.com/api
- **Status**: status.auraflowpos.com

---

## 📝 Changelog

### v1.0 (2025-01-20)
- Initial API release
- Product, Customer, Transaction endpoints
- Webhook support
- Sandbox environment

---

**Last Updated**: October 25, 2025  
**Version**: 1.0
