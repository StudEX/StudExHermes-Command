# 🔧 Implementation Checklist: Week 1-4 (May 28 - Jun 24)

**Status:** Starting Week 2 of Foundation Phase  
**Owner:** Sentinel (CTO) → All Chiefs  
**Branch:** `claude/brave-wozniak-6BzGE`

---

## PHASE 0: FOUNDATION (May 28-31)
### ⏳ CURRENT PHASE

#### [BLOCKER] Deploy VM6 - Tumelo Command Center
**Owner:** Coder Chief | **Timeline:** May 28-29 (16 hours)

**Prerequisites:**
- [ ] Fly.io account created
- [ ] flyctl CLI installed on Mac Mini
- [ ] GitHub repo connected to Fly.io
- [ ] SSH keys configured

**Deployment Steps:**
```
TASK 1: Fly.io Setup (1 hour)
├─ [ ] Visit https://fly.io and create account
├─ [ ] Download flyctl CLI
├─ [ ] Run: flyctl auth login
├─ [ ] Verify: flyctl status
└─ [ ] Add API token to environment

TASK 2: Containerize OpenCLAW (3 hours)
├─ [ ] Create Dockerfile for OpenCLAW gateway
├─ [ ] Set environment: Ollama, Gemini Flash, Claude Sonnet
├─ [ ] Configure ports: 8080 (internal), 80/443 (external)
├─ [ ] Build image: docker build -t openclaw:latest .
└─ [ ] Test locally: docker run openclaw:latest

TASK 3: Create fly.toml (1 hour)
├─ [ ] Create fly.toml with:
│   ├─ app = "tumelo-command-center"
│   ├─ primary_region = "jnb"
│   ├─ [[vm]] memory = "2gb", cpus = 1
│   └─ [mounts] source = "tumelo_data", destination = "/data"
└─ [ ] Validate: flyctl validate

TASK 4: Deploy to Fly.io (2 hours)
├─ [ ] Run: flyctl launch --copy-config
├─ [ ] Monitor: flyctl logs -f
├─ [ ] Verify health: curl https://tumelo-command-center.fly.dev
└─ [ ] Confirm dashboard loads

TASK 5: Set Up Monitoring (2 hours)
├─ [ ] Install Prometheus exporter on VM6
├─ [ ] Create basic dashboard (health, uptime, logs)
├─ [ ] Configure Slack/email alerts
└─ [ ] Document access URL & credentials
```

**Verification:**
- [ ] VM6 accessible at tumelo-command-center.fly.dev
- [ ] Dashboard loads successfully
- [ ] Logs showing green status
- [ ] Response time < 500ms

**Blockers Downstream:** VM1-5 cannot deploy until VM6 is live

---

#### [BLOCKER] Set Up Shared Services (Fly.io Infra)
**Owner:** Integrations Chief | **Timeline:** May 29-30 (8 hours)

```
TASK 1: Postgres (Supabase) Setup (2 hours)
├─ [ ] Create Supabase project
├─ [ ] Get connection string
├─ [ ] Create schema: businesses, agents, content, orders, transactions
├─ [ ] Add migrations script
└─ [ ] Test: psql -c "SELECT version();"

TASK 2: Redis (Upstash) Setup (1 hour)
├─ [ ] Create Redis on Upstash (free tier)
├─ [ ] Get connection URL
├─ [ ] Test: redis-cli PING
└─ [ ] Configure key expiry policies

TASK 3: Tailscale Mesh Network (2 hours)
├─ [ ] Create Tailscale account
├─ [ ] Install tailscale on Mac Mini
├─ [ ] Add VM6 to Tailnet
├─ [ ] Verify mesh connectivity: ping VM6 IP
└─ [ ] Document internal IPs for all future VMs

TASK 4: CI/CD Pipeline (GitHub Actions) (2 hours)
├─ [ ] Create .github/workflows/deploy.yml
├─ [ ] Configure Fly.io deployment trigger on push
├─ [ ] Add test step (linting, unit tests)
├─ [ ] Add rollback strategy
└─ [ ] Test with dummy commit
```

**Verification:**
- [ ] Postgres connected and schema created
- [ ] Redis responding to pings
- [ ] Tailscale mesh shows all nodes
- [ ] GitHub Actions workflow runs on push

**Cost Impact:** R0 (free tiers for all)

---

#### [BLOCKER] Activate Stitch Express on Shopify
**Owner:** Operations Chief | **Timeline:** May 29-30 (3 hours)

**Store 1: studexmeat.myshopify.com**
```
PHASE 1: Payment App Installation (1 hour)
├─ [ ] Login to Stitch: https://express.stitch.money/login
│   └─ tumelor001@gmail.com / 3pEbvnEpGBX*MN@c
├─ [ ] Login to Shopify: info@studex.dev / Mashudu10$
├─ [ ] In Stitch, click "Connections" → "Shopify"
├─ [ ] Click "Install Stitch Express" (popup to Shopify)
├─ [ ] On Shopify: Click "Install" on permissions screen
├─ [ ] Click "Activate" when prompted
└─ [ ] Verify: Stitch Express appears in Shopify apps

PHASE 2: Express Checkout Setup (1 hour)
├─ [ ] Go to Shopify App Store
├─ [ ] Search "Stitch Express Checkout"
├─ [ ] Click "Add app" → "Install app"
├─ [ ] Create customization with name "Stitch Express"
├─ [ ] Click "Add BNPL Widget to your store"
├─ [ ] In Theme Editor, drag BNPL widget below "Price"
├─ [ ] Click "Save" (top right)
└─ [ ] Verify widget shows on product page

PHASE 3: Testing (1 hour)
├─ [ ] Add product to cart
├─ [ ] Go to checkout
├─ [ ] Verify Stitch Express logo appears
├─ [ ] Verify BNPL option shows
├─ [ ] Place test order (R100)
└─ [ ] Verify in Stitch dashboard: transaction appears
```

**Store 2: studex-meat.myshopify.com**
```
Same as Store 1, but login:
├─ Email: t.ramaphosa@studex.dev
├─ Password: fluffybear12345
└─ Repeat all steps
```

**Verification:**
- [ ] Both stores show Stitch Express in apps
- [ ] BNPL widget visible on products (example: "Interest-free from R83.33")
- [ ] Test order goes through
- [ ] Transaction appears in Stitch dashboard
- [ ] Checkout experience is smooth

**Revenue Ready:** Once verified, can begin accepting BNPL payments

---

#### Domain Registration & DNS
**Owner:** Operations Chief | **Timeline:** May 30 (1 hour)

```
TASK: Register tumeloramaphosa.com
├─ [ ] Register with Namecheap/GoDaddy (R200-300/year)
├─ [ ] Get DNS records
├─ [ ] Point to Fly.io nameservers
├─ [ ] Wait for propagation (5-30 min)
├─ [ ] Verify: nslookup tumeloramaphosa.com
└─ [ ] Add to Fly.io app config
```

**Verification:**
- [ ] tumeloramaphosa.com resolves to VM6
- [ ] HTTPS working (auto-cert via Fly.io)
- [ ] Dashboard accessible at domain

---

## PHASE 1: CORE DEPLOYMENT (Jun 1-14)

### VM1 - Studex Meat
**Owner:** Coder Chief + Operations Chief | **Timeline:** Jun 1-3 (16 hours)

```
TASK 1: Deploy VM1 (6 hours)
├─ [ ] Create fly.toml for studex-meat-vm
├─ [ ] Configure: 2GB RAM, 1vCPU, 10GB storage
├─ [ ] Deploy OpenCLAW gateway
├─ [ ] Add Tailscale to mesh
└─ [ ] Verify connectivity to VM6

TASK 2: Configure Agents (4 hours)
├─ [ ] Deploy Biltong Sales Agent
│   └─ Tools: Shopify API, Email, WhatsApp
├─ [ ] Deploy Content Creator Agent
│   └─ Tools: Higgsfield, Canva, Social posting
└─ [ ] Deploy Logistics Manager Agent
    └─ Tools: n8n, Shipment tracking, Inventory

TASK 3: Shopify Integration (3 hours)
├─ [ ] API keys for both Shopify stores
├─ [ ] Real-time inventory sync
├─ [ ] Order webhook to VM1
└─ [ ] Test: place order on studexmeat.myshopify.com

TASK 4: B2B Outreach Setup (3 hours)
├─ [ ] Import 85 B2B contacts (CSV)
├─ [ ] Set up AgentMail account
├─ [ ] Create 3-email sequence template
└─ [ ] Schedule first batch for Jun 1
```

**Verification:**
- [ ] VM1 online and responsive
- [ ] Sales agent responds to product queries
- [ ] Shopify orders sync to VM1
- [ ] B2B email campaign queued

**Revenue Unlock:** First wholesale orders expected by Jun 5

---

### VM2 - Dark Factory
**Owner:** Coder Chief | **Timeline:** Jun 4-5 (12 hours)

```
TASK 1: Deploy VM2 (6 hours)
├─ [ ] Create fly.toml (4GB RAM, 2vCPU, 20GB)
├─ [ ] Deploy OpenCLAW + Tailscale
└─ [ ] Verify mesh connectivity

TASK 2: Configure 5 Agents (4 hours)
├─ [ ] Builder Agent (GitHub, Vercel integration)
├─ [ ] QA Agent (Testing, bug tracking)
├─ [ ] Deploy Agent (CI/CD pipeline)
├─ [ ] Pricing Agent (Cost calculator)
└─ [ ] Support Agent (Ticket routing)

TASK 3: BMAD SaaS Integration (2 hours)
├─ [ ] Connect to Shopify
├─ [ ] Payment processing (Stitch integration)
└─ [ ] Test: submit BMAD build request
```

**Verification:**
- [ ] VM2 online and responsive
- [ ] BMAD build pipeline functional
- [ ] Payment processing working

---

### VM3 - Naledi Nexus (9 Chiefs Swarm)
**Owner:** Coder Chief + Content Chief | **Timeline:** Jun 6-7 (20 hours) ⭐ PRIORITY

```
TASK 1: Deploy VM3 (6 hours)
├─ [ ] Create fly.toml (8GB RAM, 4vCPU, 30GB)
├─ [ ] Deploy OpenCLAW + Tailscale
└─ [ ] Configure for heavy inference

TASK 2: Initialize 9 Chiefs (8 hours)
├─ [ ] Researcher Chief (Gemini Flash + web search)
├─ [ ] Coder Chief (Claude Sonnet + GitHub)
├─ [ ] Heartbeat Chief (Qwen 1.5B monitoring)
├─ [ ] Content Chief (Hermes 8B + Higgsfield)
├─ [ ] Strategy Chief (Claude Sonnet + analytics)
├─ [ ] Operations Chief (Qwen 7B + n8n)
├─ [ ] Data Chief (Gemini Flash + Metabase)
├─ [ ] Security Chief (Qwen 7B + audit logs)
└─ [ ] Integrations Chief (Claude Sonnet + APIs)

TASK 3: Content Pipeline Setup (4 hours)
├─ [ ] Configure RALF Loop (00:00-09:00 daily)
├─ [ ] Set up content generation queue
├─ [ ] Connect to Higgsfield for image gen
├─ [ ] Set up platform posting hooks (TikTok, IG, Twitter)
└─ [ ] Test: generate & post 5 test pieces

TASK 4: Inter-VM Communication (2 hours)
├─ [ ] Configure API endpoints
├─ [ ] Set up Redis pub/sub channels
├─ [ ] Test VM1 → VM3 → Post flow
└─ [ ] Verify all 5 VMs can reach each other
```

**Verification:**
- [ ] VM3 online and stable
- [ ] All 9 Chiefs responding to commands
- [ ] Content generation working
- [ ] Posts appearing on social (test pieces)
- [ ] Heartbeat Chief monitoring all VMs

**Critical for Downstream:** Content pipeline enables revenue

---

### VM4 - Agentic Lab & VM5 - Stitch Money
**Owner:** Coder Chief | **Timeline:** Jun 8-11 (16 hours each)

Similar deployment pattern to above (deploy → configure agents → test integrations)

---

### Mesh Network & Health Monitoring
**Owner:** Integrations Chief | **Timeline:** Jun 9-10 (8 hours)

```
TASK 1: Verify Tailscale Mesh (2 hours)
├─ [ ] All 6 VMs in same Tailnet
├─ [ ] Ping tests between all pairs
├─ [ ] Test firewall rules (restrict to needed ports)
└─ [ ] Document internal IP mapping

TASK 2: Health Monitoring Dashboard (4 hours)
├─ [ ] Prometheus collecting metrics from all VMs
├─ [ ] Grafana dashboard showing:
│   ├─ CPU/RAM per VM
│   ├─ Agent status (up/down)
│   ├─ Response times
│   ├─ Error rates
│   └─ Revenue tracker
├─ [ ] Alerting configured (Slack/email)
└─ [ ] Test alerts by simulating failure

TASK 3: Inter-VM API Testing (2 hours)
├─ [ ] Test VM1 → VM3 content request
├─ [ ] Test VM5 → VM1 payment notification
├─ [ ] Test VM6 → all health checks
└─ [ ] Verify all sync properly
```

---

## PHASE 2: CONTENT & REVENUE ACCELERATION (Jun 15-30)

### Content Siege - 7 Days (Jun 15-21)
**Owner:** Content Chief (VM3) | **Timeline:** 7 days continuous

```
LAUNCH SEQUENCE:
Day 1 (Jun 15-16): Setup & Preview
├─ [ ] Test content posting on all 4 platforms
├─ [ ] Verify image generation working
├─ [ ] Schedule preview posts
└─ [ ] Get stakeholder approval

Days 2-7 (Jun 17-23): Content Blitz
├─ [ ] TikTok: 2 pieces/day × 7 = 14 videos
├─ [ ] Instagram: 1 carousel/day × 7 = 7 carousels (35 images)
├─ [ ] LinkedIn: 3 pieces/day × 7 = 21 posts
├─ [ ] Twitter: 2 threads/day × 7 = 14 threads
├─ [ ] Email: 5 campaigns × 5 emails = 25 sends
└─ [ ] Total: 240+ pieces in 7 days

METRICS TO TRACK:
├─ [ ] TikTok views: Target 10K+
├─ [ ] Instagram engagement: Target 500+ likes
├─ [ ] LinkedIn profile visits: Target 100+
├─ [ ] Email open rate: Target 25%+
└─ [ ] Website traffic: Target 5K+ visits
```

**Expected Outcome:** 10K+ social reach, 500+ email opens, R50K+ web traffic

---

### B2B Email Campaign (Jun 1-30)
**Owner:** Operations Chief (VM1) | **Timeline:** 30 days

```
Week 1 (Jun 1-7): Segmentation & Setup
├─ [ ] Import 85 contacts into AgentMail
├─ [ ] Segment by: Hotels (45), Gyms (20), Corporate (15)
├─ [ ] Create 3-email sequence
│   ├─ Email 1: Introduction + value prop
│   ├─ Email 2: Product showcase + social proof
│   └─ Email 3: Limited time offer
└─ [ ] Set up tracking (open, click, reply)

Week 2-4 (Jun 8-30): Outreach & Followup
├─ [ ] Send Batch 1 (Jun 8): 30 contacts
├─ [ ] Send Batch 2 (Jun 15): 30 contacts
├─ [ ] Send Batch 3 (Jun 22): 25 contacts
├─ [ ] Monitor open rates & replies daily
├─ [ ] Manual followup on high-intent replies
└─ [ ] Schedule calls with interested parties

CONVERSION TARGETS:
├─ [ ] Open rate: 25%+ = 21 opens
├─ [ ] Click rate: 10% = 8.5 clicks
├─ [ ] Call booking: 5% = 4 calls
└─ [ ] Conversion: 50% = 2-3 wholesale orders (R150K-300K)
```

---

### Paid Acquisition Launch (Jun 15+)
**Owner:** Strategy Chief | **Timeline:** Ongoing

```
Campaign 1: Instagram/Facebook Ads
├─ [ ] Create carousel ads (Studex Meat)
├─ [ ] Target: Fitness (25-45), Affluent, South Africa
├─ [ ] Budget: R1,500/week
├─ [ ] CPA target: R400 (aim for R800+ AOV)
└─ [ ] Expected: 4-6 orders/week = R3.2-4.8K revenue

Campaign 2: LinkedIn Ads
├─ [ ] Create lead gen campaign (Bulk buyers)
├─ [ ] Target: Corporate, Procurement, Hotels
├─ [ ] Budget: R500/week
├─ [ ] Expected: 3-5 corporate leads/week

Campaign 3: TikTok Ads
├─ [ ] Repurpose top performing organic content
├─ [ ] Target: 18-35, interested in fitness/food
├─ [ ] Budget: R1,000/week
└─ [ ] Expected: 8-12 sales/week = R4-6K revenue
```

**Total Ad Budget:** R3K/week = R12K/month  
**Expected ROAS:** 2-3x = R24-36K revenue/month

---

## KEY MILESTONES & VERIFICATION

### Week 1 (May 28-Jun 3) ✅ FOUNDATION
- [ ] VM6 deployed and monitoring all systems
- [ ] Shared services (Postgres, Redis, Tailscale) operational
- [ ] Stitch Express active on both Shopify stores
- [ ] Domain tumeloramaphosa.com live
- [ ] B2B email campaign queued for launch

**Success Metric:** Foundation complete, ready for VM deployment

---

### Week 2 (Jun 4-10) ✅ CORE DEPLOYMENT
- [ ] VM1-5 deployed and responsive
- [ ] All agents initialized and tested
- [ ] Mesh network verified
- [ ] Health monitoring dashboard live
- [ ] First B2B emails sent

**Success Metric:** All 6 VMs online, inter-VM communication working

---

### Week 3 (Jun 11-17) ✅ AGENT ACTIVATION & CONTENT
- [ ] 9 Chiefs swarm operational on VM3
- [ ] Content pipeline generating 100+ pieces/day
- [ ] 7-day content siege launched (240+ pieces)
- [ ] First wholesale leads from B2B email
- [ ] Paid acquisition campaigns live

**Success Metric:** Revenue hitting R250K/month target

---

### Week 4 (Jun 18-24) ✅ SCALE & OPTIMIZE
- [ ] 600+ pieces from original 775 posted
- [ ] B2B campaign showing 2-3 orders
- [ ] Paid ads generating consistent ROI (2x+)
- [ ] System uptime: 99.5%+
- [ ] Forecast: R685K+ by July

**Success Metric:** On track for R4M annual run-rate

---

## ⚠️ BLOCKER PROTOCOL

**If blocked at any step:**

1. **Document the blocker** (time, error message, attempted fixes)
2. **Post in** #tech-blockers with:
   - VM affected
   - Step blocked at
   - Error messages
   - Owner to escalate to
3. **Recommended escalation:**
   - Fly.io issues → Coder Chief
   - Agent issues → Heartbeat Chief
   - Payment issues → Operations Chief
   - Content issues → Content Chief
4. **SLA:** Critical blockers resolved within 4 hours

---

## 📞 PROGRESS TRACKING

### Daily Standup (17:00 SAST)
- VM status (✅ online / ⏳ deploying / 🔴 down)
- Key tasks completed today
- Blockers & escalations

### Weekly Checkpoint (Sunday 17:00 SAST)
- Phase progress (% complete)
- Revenue to date
- Content posted count
- Forecast for next week
- Risk assessment

### Monthly Review (1st of month)
- R revenue milestone
- Agent performance metrics
- Content engagement analysis
- Customer feedback
- Roadmap adjustment

---

*Last Updated: May 28, 2026*  
*Next Review: June 4, 2026 (Week 2 checkpoint)*  
*Owner: Sentinel (CTO) + All 9 Chiefs*
