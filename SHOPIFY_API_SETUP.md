# 🛍️ Shopify API Setup Guide

**Purpose:** Get Shopify API credentials for real-time inventory sync, order processing, and webhook integration  
**Status:** Step-by-step setup instructions  
**Stores:** 2 (studexmeat.myshopify.com + studex-meat.myshopify.com)

---

## 📋 PREREQUISITES

### Store Access (Already Available)
```
Store 1: studexmeat.myshopify.com
├─ Email: info@studex.dev
├─ Password: Mashudu10$
└─ Role: (confirm admin access)

Store 2: studex-meat.myshopify.com
├─ Email: t.ramaphosa@studex.dev
├─ Password: fluffybear12345
└─ Role: (confirm admin access)
```

### What You'll Get
- ✅ API Access Token (for REST API calls)
- ✅ Webhook endpoints (for real-time events)
- ✅ Scopes (permissions: read_products, write_orders, etc.)
- ✅ Test credentials (before going live)

---

## 🔑 STEP 1: CREATE CUSTOM APP IN SHOPIFY

### For Store 1 (studexmeat.myshopify.com)

**Step 1a: Login to Shopify Admin**
```
1. Go to: https://studexmeat.myshopify.com/admin
2. Email: info@studex.dev
3. Password: Mashudu10$
4. Login & verify 2FA (if prompted)
```

**Step 1b: Navigate to Apps & Integrations**
```
1. Click "Apps and sales channels" in left sidebar
2. Click "Apps and sales channels" again (or "Develop apps")
3. Look for "App and sales channel settings" at bottom
4. If you see "Develop apps": Click it
5. If you DON'T see "Develop apps":
   └─ Ask owner for "Custom app development" permission
   └─ This is an admin permission that may need to be enabled
```

**Step 1c: Create Custom App**
```
1. Click "Create an app" button
2. Enter app name: "StudEx Meat Integration"
3. Click "Create app"
4. You'll see API credentials page
```

**Step 1d: Configure Admin API Scopes**
```
In the app settings, go to "Configuration" tab:

1. Under "Admin API scopes", select these permissions:
   ├─ [ ] read_products
   ├─ [ ] read_inventory
   ├─ [ ] write_inventory
   ├─ [ ] read_orders
   ├─ [ ] read_order_edits
   ├─ [ ] write_order_edits
   ├─ [ ] read_customers
   ├─ [ ] read_fulfillments
   ├─ [ ] write_fulfillments
   ├─ [ ] read_shipping
   └─ [ ] read_products_listing (optional, for catalog sync)

2. Click "Save" at bottom

3. Go to "API credentials" tab
4. Copy these values (SAVE SECURELY):
   ├─ Access Token
   ├─ API Key
   └─ API Secret
```

### For Store 2 (studex-meat.myshopify.com)

Repeat steps 1a-1d but login with:
- Email: t.ramaphosa@studex.dev
- Password: fluffybear12345

---

## 🧪 STEP 2: TEST API CONNECTION

### Option A: Using cURL (Quick Test)

```bash
# Test REST API with your access token
curl -X GET "https://studexmeat.myshopify.com/admin/api/2024-01/products.json" \
  -H "X-Shopify-Access-Token: YOUR_ACCESS_TOKEN"

# Expected response: JSON list of products
# If you get 200 OK + product data → API is working ✅
# If you get 401 Unauthorized → Token is invalid ❌
```

### Option B: Using Node.js Script

Create file: `test-shopify-api.js`

```javascript
const https = require('https');

const stores = [
  {
    name: 'studexmeat',
    domain: 'studexmeat.myshopify.com',
    token: 'YOUR_ACCESS_TOKEN_STORE_1'
  },
  {
    name: 'studex-meat',
    domain: 'studex-meat.myshopify.com',
    token: 'YOUR_ACCESS_TOKEN_STORE_2'
  }
];

async function testStore(store) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: store.domain,
      path: '/admin/api/2024-01/products.json',
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': store.token
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n${store.name}:`);
        if (res.statusCode === 200) {
          const json = JSON.parse(data);
          console.log(`✅ Connected! Found ${json.products.length} products`);
          console.log(`First product: ${json.products[0]?.title}`);
          resolve(true);
        } else {
          console.log(`❌ Failed with status ${res.statusCode}`);
          console.log(`Error: ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`❌ Error: ${e.message}`);
      reject(e);
    });
    req.end();
  });
}

// Test both stores
(async () => {
  console.log('Testing Shopify API connections...');
  for (const store of stores) {
    await testStore(store);
  }
})();
```

**Run it:**
```bash
node test-shopify-api.js
```

### Option C: Using Postman (Visual)

1. Download Postman from postman.com
2. Create new GET request
3. URL: `https://studexmeat.myshopify.com/admin/api/2024-01/products.json`
4. Headers tab → Add:
   - Key: `X-Shopify-Access-Token`
   - Value: `YOUR_ACCESS_TOKEN`
5. Click "Send"
6. Should see products list in response

---

## 🔌 STEP 3: SET UP WEBHOOKS (Real-Time Events)

### Why Webhooks?
When customer places order → Shopify sends webhook to your VM1 → Agent processes fulfillment in real-time

### Create Webhook Endpoint

First, you need a URL where Shopify can POST events. For now:

**Option A: Ngrok (Development)**
```bash
# Install ngrok: https://ngrok.com
ngrok http 8080

# You'll get: https://abc123.ngrok.io
# This forwards external traffic to localhost:8080
```

**Option B: Your Fly.io VM1 (Production)**
```
VM1 will have URL: https://studex-meat-vm.fly.dev/webhooks
(We'll set this up when VM1 deploys)
```

### Register Webhooks in Shopify

**In Shopify Admin → Settings → Webhooks:**

1. Click "Create webhook"
2. Event: "Order created"
3. Webhook endpoint: `https://your-endpoint/webhooks/orders/create`
4. Click "Save"
5. Repeat for these events:
   ```
   ├─ Order created → /webhooks/orders/create
   ├─ Order updated → /webhooks/orders/update
   ├─ Order fulfilled → /webhooks/orders/fulfill
   ├─ Product updated → /webhooks/products/update
   └─ Inventory level changed → /webhooks/inventory/change
   ```

### Verify Webhook is Working

```bash
# Check webhook logs in Shopify Admin
Settings → Webhooks → Click webhook name → View recent deliveries

# Should see:
# ✅ Delivered (green check)
# ❌ Not delivered (red X) - check endpoint URL
```

---

## 📦 STEP 4: CONFIGURE FOR VM1 INTEGRATION

### Store API Credentials Securely

Create `.env` file (DO NOT COMMIT):

```bash
# Store 1
SHOPIFY_STORE_1_DOMAIN=studexmeat.myshopify.com
SHOPIFY_STORE_1_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_STORE_1_API_KEY=xxxxx
SHOPIFY_STORE_1_API_SECRET=xxxxx

# Store 2
SHOPIFY_STORE_2_DOMAIN=studex-meat.myshopify.com
SHOPIFY_STORE_2_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_STORE_2_API_KEY=xxxxx
SHOPIFY_STORE_2_API_SECRET=xxxxx

# Webhook secrets (for verifying authenticity)
SHOPIFY_WEBHOOK_SECRET=your_webhook_signing_key
```

### Create Node.js Integration Module

File: `shopify-integration.js`

```javascript
const https = require('https');
require('dotenv').config();

class ShopifyAPI {
  constructor(storeName) {
    if (storeName === 'store1') {
      this.domain = process.env.SHOPIFY_STORE_1_DOMAIN;
      this.token = process.env.SHOPIFY_STORE_1_ACCESS_TOKEN;
    } else {
      this.domain = process.env.SHOPIFY_STORE_2_DOMAIN;
      this.token = process.env.SHOPIFY_STORE_2_ACCESS_TOKEN;
    }
    this.apiVersion = '2024-01';
  }

  // Get all products
  async getProducts() {
    return this.request('GET', '/admin/api/2024-01/products.json');
  }

  // Get specific product
  async getProduct(id) {
    return this.request('GET', `/admin/api/2024-01/products/${id}.json`);
  }

  // Get all orders
  async getOrders() {
    return this.request('GET', '/admin/api/2024-01/orders.json');
  }

  // Get specific order
  async getOrder(id) {
    return this.request('GET', `/admin/api/2024-01/orders/${id}.json`);
  }

  // Update inventory
  async updateInventory(inventoryItemId, quantity) {
    const body = {
      inventory_quantity: quantity
    };
    return this.request(
      'POST',
      `/admin/api/2024-01/inventory_levels/adjust.json`,
      body
    );
  }

  // Create fulfillment
  async createFulfillment(orderId, lineItems) {
    const body = {
      fulfillment: {
        line_items_by_fulfillment_orders: lineItems
      }
    };
    return this.request(
      'POST',
      `/admin/api/2024-01/orders/${orderId}/fulfillments.json`,
      body
    );
  }

  // Generic request handler
  async request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.domain,
        path: path,
        method: method,
        headers: {
          'X-Shopify-Access-Token': this.token,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            reject({
              status: res.statusCode,
              error: data
            });
          }
        });
      });

      req.on('error', reject);

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }
}

// Usage example
async function test() {
  const shopify = new ShopifyAPI('store1');
  
  try {
    const products = await shopify.getProducts();
    console.log(`Found ${products.products.length} products`);
    
    const orders = await shopify.getOrders();
    console.log(`Found ${orders.orders.length} orders`);
  } catch (error) {
    console.error('API Error:', error);
  }
}

module.exports = ShopifyAPI;
```

---

## 🔐 STEP 5: SECURITY BEST PRACTICES

### ❌ DO NOT
```
❌ Commit .env files to Git
❌ Share access tokens in Slack/Email
❌ Use old API versions (< 2024-01)
❌ Store tokens in code/comments
❌ Use same token for dev + production
```

### ✅ DO
```
✅ Store tokens in environment variables
✅ Rotate tokens quarterly
✅ Use custom app (not private app)
✅ Verify webhook authenticity
✅ Enable 2FA on Shopify accounts
✅ Audit API access logs monthly
```

### Verify Webhook Authenticity

Every webhook from Shopify includes an `X-Shopify-Hmac-SHA256` header.

```javascript
const crypto = require('crypto');

function verifyShopifyWebhook(request) {
  const hmac = request.headers['x-shopify-hmac-sha256'];
  const body = request.rawBody; // Must be raw request body (before parsing)
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  return hash === hmac;
}

// Use in Express middleware
app.post('/webhooks/orders/create', (req, res) => {
  if (!verifyShopifyWebhook(req)) {
    return res.status(401).send('Unauthorized');
  }
  
  // Process webhook
  console.log('Valid webhook from Shopify:', req.body);
  res.send('OK');
});
```

---

## 📊 TROUBLESHOOTING

### Issue: "401 Unauthorized"
```
Cause: Invalid or expired access token
Fix:
  1. Double-check token value (no extra spaces)
  2. Verify token matches the right store domain
  3. Regenerate token in Shopify admin (revokes old one)
  4. Check token hasn't expired (custom apps don't expire, but manual revoke does)
```

### Issue: "404 Not Found"
```
Cause: Wrong API endpoint or store domain
Fix:
  1. Verify domain: https://STORE_NAME.myshopify.com
  2. Verify path: /admin/api/2024-01/products.json
  3. Check API version (2024-01 is current)
```

### Issue: "403 Forbidden"
```
Cause: Token doesn't have permission for this action
Fix:
  1. Go to Shopify admin → Apps → Custom app settings
  2. Check "Admin API scopes" - need write_products, read_orders, etc
  3. Save changes
  4. Test again
```

### Issue: Webhook not delivering
```
Cause: Endpoint URL unreachable or webhook secret wrong
Fix:
  1. Verify endpoint URL is accessible (test with curl)
  2. Check webhook logs in Shopify admin
  3. If ngrok, restart ngrok (URL changes)
  4. Regenerate webhook with correct URL
```

### Issue: Rate Limited
```
Cause: Too many API calls (Shopify has limits)
Fix:
  1. Implement exponential backoff:
     └─ Wait 1s, retry 2x before failing
  2. Batch requests (max 250 items per call)
  3. Use GraphQL API for complex queries (more efficient)
```

---

## 📝 REQUIRED SCOPES EXPLAINED

| Scope | Purpose | Used By |
|-------|---------|---------|
| `read_products` | Get product info (title, price, images) | Content Agent, Catalog sync |
| `write_products` | Update products (title, description) | Content Agent (optional) |
| `read_inventory` | Get stock levels | Logistics Agent |
| `write_inventory` | Update stock (critical!) | Logistics Agent |
| `read_orders` | Get order details | Sales Agent |
| `write_orders` | Update orders (tags, notes) | Sales Agent |
| `read_fulfillments` | Check shipment status | Logistics Agent |
| `write_fulfillments` | Create shipments | Logistics Agent |
| `read_customers` | Get customer info | Analytics Agent |

---

## 🚀 NEXT STEPS FOR VM1 INTEGRATION

Once API is working:

### 1. Configure VM1 Agent (Studex Meat)
```
VM1 will have 3 agents:
├─ Sales Agent: listens for orders via webhook → processes BNPL
├─ Content Agent: syncs product images + descriptions
└─ Logistics Agent: manages inventory + fulfillment
```

### 2. Set Up Webhook Listener (VM1)
```
VM1 listens on: https://studex-meat-vm.fly.dev/webhooks

Events received:
├─ orders/create → Sales Agent processes
├─ orders/update → Updates local DB
├─ inventory/change → Stock alert
└─ products/update → Sync to content library
```

### 3. Real-Time Inventory Sync
```
Every 5 minutes:
├─ Fetch inventory from Shopify
├─ Update local cache (Redis)
├─ Alert if low stock
└─ Adjust prices dynamically if needed
```

### 4. Order Processing Flow
```
Customer places order on Shopify
    ↓
Shopify sends webhook (order/create)
    ↓
VM1 Sales Agent receives webhook
    ↓
Check if BNPL (Stitch Money payment)
    ↓
Process fulfillment:
    ├─ Pack biltong
    ├─ Get tracking from shipper
    ├─ Update Shopify fulfillment status
    └─ Send customer WhatsApp notification
```

---

## ✅ VERIFICATION CHECKLIST

Before declaring "API Ready":

**Connectivity**
- [ ] Can GET /products.json (get products)
- [ ] Can GET /orders.json (get orders)
- [ ] Can POST inventory updates
- [ ] Can create fulfillments

**Webhooks**
- [ ] Webhook registered in Shopify
- [ ] Endpoint receives POST requests
- [ ] Webhook signature verified
- [ ] Events trigger agent actions

**Data Sync**
- [ ] Inventory syncing every 5 min
- [ ] Product catalog updated daily
- [ ] Orders appearing in local DB
- [ ] Customer data available to agents

**Security**
- [ ] Tokens stored in .env (not in code)
- [ ] 2FA enabled on Shopify accounts
- [ ] Webhook secret verified
- [ ] No sensitive data in logs

---

## 📞 SUPPORT REFERENCES

**Shopify API Docs:**
- Official: https://shopify.dev/docs/api/admin-rest/2024-01
- Webhooks: https://shopify.dev/docs/api/admin-rest/2024-01/resources/webhook
- Rate Limits: https://shopify.dev/docs/api/admin-rest/reference#rate_limit_headers

**Custom App Setup:**
- https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/create-app-token

**Troubleshooting:**
- API Errors: https://shopify.dev/docs/api/admin-rest#status_codes
- Rate Limit Details: https://shopify.dev/docs/api/admin-rest#rate_limits

---

## 🎯 SUCCESS CRITERIA

You'll know it's working when:

✅ API test returns product list  
✅ Webhook successfully delivers to endpoint  
✅ Orders appear in real-time (within 5 seconds of customer purchase)  
✅ Inventory updates reflected in agent knowledge  
✅ Sales agent can process BNPL transactions  
✅ Logistics agent can create shipments automatically  

**Expected Time to Setup:** 1-2 hours total  
**Revenue Impact:** Enables real-time order processing & inventory management  
**Blocker for:** VM1 (Studex Meat) full deployment

---

*Last Updated: May 28, 2026*  
*Owner: Operations Chief + Coder Chief*  
*Status: READY FOR IMPLEMENTATION*
