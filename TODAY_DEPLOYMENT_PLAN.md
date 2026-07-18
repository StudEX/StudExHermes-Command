# ⏰ TODAY'S DEPLOYMENT PLAN - July 18, 2026
## Natalia Hermes Agent + Complete Ecosystem Launch

**Timeline:** Today (July 18) - FULL DAY EXECUTION  
**Status:** ALL SYSTEMS GO 🟢  
**Owner:** Natalia Mordvinova + Sentinel + Team

---

## 🎯 TODAY'S OBJECTIVES

### Primary Goal
Deploy **Hermes Agent** to Natalia's dedicated virtual machine, fully integrated with:
- ✅ Tailscale VPN (studex.cloud)
- ✅ Orgo.ai infrastructure
- ✅ GlobalMarkets.pplx.app workspace
- ✅ Claude Remote Desktop control
- ✅ AfricaBiz backend

### Success Criteria
By end of day:
- Hermes Agent running autonomously
- Natalia can access via 3 interfaces
- Partnership matching operational
- All integrations verified
- 24/7 monitoring active

---

## ⏱️ TIMELINE & EXECUTION

### **09:00 AM - Pre-Flight Check (30 min)**

**Preparation:**
```bash
# Gather all credentials
□ AFRICABIZ_API_KEY
□ ORGO_API_KEY  
□ GLOBALMARKETS_TOKEN
□ Natalia's email credentials
□ Tailscale auth key

# Prepare scripts
□ provision_natalia_vm.sh
□ install_base_system.sh
□ install_tailscale.sh
□ install_hermes_agent.sh
□ setup_orgo_integration.sh
□ setup_globalmarkets_connection.sh
□ start_hermes_agent.sh
□ verify_hermes_agent.sh

# Pre-deployment checks
□ AWS credentials working
□ GitHub access for Hermes clone
□ Orgo.ai account created
□ GlobalMarkets API key generated
□ DNS ready for tailscale-natalia.studex.cloud
```

**Actions:**
```bash
# Test AWS access
aws ec2 describe-instances --query 'Reservations[0].Instances[0].InstanceId' --output text

# Verify GitHub access
git clone https://github.com/nous-research/hermes-agent.git --depth 1 && rm -rf hermes-agent

# Test API connectivity
curl -s https://orgo.ai/api/health | jq .
curl -s https://globalmarkets.pplx.app/api/health | jq .

echo "✅ Pre-flight check complete"
```

---

### **09:30 AM - PHASE 1: VM Provisioning (45 min)**

**Step 1: Launch VM**
```bash
# Run provision script
./provision_natalia_vm.sh

# Expected output:
# Instance ID: i-0123456789abcdef0
# Private IP: 10.0.1.45
# SSH ready in: ~30 seconds

# Wait for SSH to be ready
sleep 30
```

**Step 2: Verify VM Access**
```bash
# Test SSH access
ssh -i ~/.ssh/studex-production.pem ubuntu@10.0.1.45 "echo 'VM is ready!'"

# If successful, continue
# If timeout, wait another 30 seconds and retry
```

**Status Check:**
✅ VM online
✅ SSH accessible  
✅ Ready for next phase

---

### **10:15 AM - Base System Installation (20 min)**

**Execute installation:**
```bash
# SSH into VM
ssh -i ~/.ssh/studex-production.pem ubuntu@10.0.1.45

# Run installation script remotely
scp -i ~/.ssh/studex-production.pem install_base_system.sh ubuntu@10.0.1.45:~/
ssh -i ~/.ssh/studex-production.pem ubuntu@10.0.1.45 "chmod +x ~/install_base_system.sh && ~/install_base_system.sh"

# Takes ~15-20 minutes
# Once complete, VM will have all dependencies installed
```

**Verification:**
```bash
ssh ubuntu@10.0.1.45 "docker --version && node --version && python3 --version"

# Expected output:
# Docker version 20.10.x
# v20.x.x
# Python 3.11.x
```

---

### **10:40 AM - Tailscale VPN Configuration (10 min)**

**Install & connect Tailscale:**
```bash
# SSH into VM
ssh ubuntu@10.0.1.45

# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Connect to StudEx network
sudo tailscale up \
  --authkey=tskey-XXXXX-YYYYY \
  --hostname=natalia-hermes-primary \
  --advertise-routes=10.0.0.0/24

# Verify connection
tailscale status
```

**Expected Output:**
```
100.x.x.x    natalia-hermes-primary  Healthy
(showing other StudEx nodes)
```

**From local machine:**
```bash
# Verify can access via Tailscale IP
ping 100.x.x.x  # Should respond
ssh ubuntu@100.x.x.x "echo 'Tailscale working!'"
```

---

### **10:55 AM - Hermes Agent Installation (50 min)**

**Clone Hermes from Nous Research:**
```bash
ssh ubuntu@tailscale-natalia.studex.cloud "
  cd /home/ubuntu
  git clone https://github.com/nous-research/hermes-agent.git
  cd hermes-agent
  npm install
  ./hermes-agent --version
"

# Takes ~40-45 minutes due to npm install
```

**Create configuration:**
```bash
# Copy config files
scp hermes-config.yaml ubuntu@tailscale-natalia.studex.cloud:/home/ubuntu/hermes-agent/config/
scp .env ubuntu@tailscale-natalia.studex.cloud:/home/ubuntu/hermes-agent/

# Verify configs
ssh ubuntu@tailscale-natalia.studex.cloud "
  cd ~/hermes-agent
  ./hermes-agent validate-config config/hermes-config.yaml
"
```

**Status Check:**
✅ Hermes cloned
✅ Dependencies installed
✅ Configuration validated
✅ Ready to launch

---

### **11:50 AM - Orgo.ai Integration (30 min)**

**Deploy to Orgo:**
```bash
# SSH into Hermes VM
ssh ubuntu@tailscale-natalia.studex.cloud

# Export credentials
export ORGO_API_KEY=sk_orgo_XXXXX

# Deploy agent cluster
orgo deploy \
  --name hermes-natalia \
  --config /home/ubuntu/hermes-agent/config/hermes-config.yaml \
  --resource-pool natalia-hermes-primary \
  --replicas 3 \
  --auto-scaling enabled

# Takes ~10-15 minutes
```

**Verify Deployment:**
```bash
# Check status in Orgo
orgo status --deployment hermes-natalia

# Expected: "Active" with 3/3 replicas running
# Metrics showing CPU < 30%, Memory < 50%
```

**Status Check:**
✅ Deployed to Orgo.ai
✅ 3 replicas running
✅ Auto-scaling enabled
✅ Health checks passing

---

### **12:25 PM - GlobalMarkets Connection (20 min)**

**Connect workspace:**
```bash
# SSH into Hermes VM
ssh ubuntu@tailscale-natalia.studex.cloud

# Create GlobalMarkets integration
export GLOBALMARKETS_TOKEN=token_XXXXX

curl -X POST https://globalmarkets.pplx.app/api/workspaces/setup \
  --data @/home/ubuntu/globalmarkets-config.json

# Should return workspace_id confirmation
```

**Verify Connection:**
```bash
# Test API connectivity
curl https://globalmarkets.pplx.app/api/hermes-natalia/status \
  -H "Authorization: Bearer $GLOBALMARKETS_TOKEN"

# Should return:
# { "status": "connected", "sync": "active", "last_update": "2026-07-18T12:30:00Z" }
```

**Status Check:**
✅ GlobalMarkets connected
✅ Workspace active
✅ Real-time sync working
✅ Dashboard ready

---

### **12:50 PM - Launch Hermes Agent (10 min)**

**Start systemd service:**
```bash
ssh ubuntu@tailscale-natalia.studex.cloud "
  sudo systemctl daemon-reload
  sudo systemctl enable hermes-natalia
  sudo systemctl start hermes-natalia
  sleep 5
  systemctl status hermes-natalia
"

# Should show: "active (running)"
```

**First Health Check:**
```bash
ssh ubuntu@tailscale-natalia.studex.cloud "
  curl -s https://localhost:8443/health | jq .
"

# Should return:
# {
#   "status": "healthy",
#   "version": "1.0",
#   "uptime": "5s",
#   "tasks": 0,
#   "integrations": { "africabiz": "connected", "orgo": "active", "globalmarkets": "synced" }
# }
```

---

### **01:00 PM - Full Verification Suite (45 min)**

**Run comprehensive checks:**
```bash
./verify_hermes_agent.sh
```

**Verification Checklist:**
```
1. Service Status
   □ hermes-natalia running
   □ No errors in logs
   □ Memory usage < 8GB
   □ CPU usage < 40%

2. API Connectivity
   □ Hermes API responding (/health)
   □ Orgo.ai deployment active
   □ GlobalMarkets webhook connected
   □ AfricaBiz API accessible

3. Database
   □ PostgreSQL connection healthy
   □ Tables created (hermes_natalia)
   □ Initial data loaded

4. Redis Cache
   □ Redis responding
   □ Cache keys initialized
   □ TTL properly set

5. Tailscale
   □ Connected to studex.cloud
   □ Other nodes reachable
   □ Latency < 50ms

6. Monitoring
   □ Metrics endpoint live (:9090/metrics)
   □ Alerts configured
   □ Dashboard displaying data

7. Integrations
   □ AfricaBiz: ✅ Connected
   □ Orgo.ai: ✅ Active (3 replicas)
   □ GlobalMarkets: ✅ Syncing
   □ Claude Desktop: ✅ Can see VM

8. Feature Tests
   □ Can run partnership-matcher
   □ Generate reports
   □ Create partnerships
   □ Sync to GlobalMarkets
```

**All Green? Proceed to handoff.**

---

### **02:00 PM - Natalia Handoff & Training (1 hour)**

**Introduce Natalia to Her Hermes Agent:**

**1. Claude Remote Desktop Access** (10 min)
```
Show Natalia:
- Login to claude-desktop.studex.dev
- Navigate to "Natalia Hermes Workspace"
- See VM status (natalia-hermes-primary)
- View Hermes Agent logs in real-time
- Access monitoring dashboard
```

**2. GlobalMarkets.pplx.app** (15 min)
```
Show Natalia:
- Login with credentials
- Partnership dashboard
- Real-time opportunity matching
- Deal management interface
- Team collaboration tools
- Reporting options
```

**3. Direct Hermes Commands** (10 min)
```
Walk through:
- SSH access to VM
- hermes-agent status
- Run first partnership match
- Generate sample report
- Test API endpoints
```

**4. Daily Workflow** (15 min)
```
Explain:
- Morning: Check partnership matches
- Midday: Review deal pipeline
- Afternoon: Generate reports
- Evening: Plan next day
- Monitor alerts 24/7
```

**5. Emergency Procedures** (10 min)
```
Document:
- Contact numbers (Sentinel, support)
- Restart procedures
- Backup systems
- Escalation paths
```

---

### **03:00 PM - Full System Testing (30 min)**

**Run complete test suite:**

```bash
# Test 1: Partnership Matching
hermes-agent run partnership-matcher \
  --input sample_participants.json \
  --max-matches 5

# Expected: Generate 5 partnership recommendations

# Test 2: Generate Report
hermes-agent generate-report \
  --type daily \
  --format pdf \
  --output ~/test_report.pdf

# Expected: Create PDF report

# Test 3: API Call
curl -s https://natalia-hermes.studex.cloud:8443/api/partnerships \
  -H "Authorization: Bearer $AGENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "list", "limit": 10}'

# Expected: Return JSON list of partnerships

# Test 4: GlobalMarkets Sync
curl -X POST https://globalmarkets.pplx.app/api/sync/hermes \
  -H "Authorization: Bearer $GLOBALMARKETS_TOKEN"

# Expected: Sync completed successfully
```

---

### **03:30 PM - Documentation & Handoff** (30 min)

**Create Natalia's Quick Reference Guide:**

```markdown
# Natalia's Hermes Agent - Quick Start

## Access Points
1. Claude Remote Desktop: claude-desktop.studex.dev
   → VM: tailscale-natalia.studex.cloud
   → Monitor agent status & logs

2. GlobalMarkets: https://globalmarkets.pplx.app
   → Partnership dashboard
   → Deal management
   → Team collaboration

3. Direct Commands: SSH to tailscale-natalia.studex.cloud
   → hermes-agent run partnership-matcher
   → hermes-agent generate-report
   → hermes-agent task list

## Daily Tasks
- 09:00: Check partnership matches
- 12:00: Review open opportunities  
- 16:00: Generate performance report
- 18:00: Review next day agenda

## Emergency Contacts
- Sentinel (CTO): sentinel@studex.dev
- Support: support@studex.dev
- 24/7 Hotline: +1-XXX-HERMES-1

## Restart Procedures
If Hermes Agent stops:
1. SSH to VM: ssh ubuntu@tailscale-natalia.studex.cloud
2. Check status: systemctl status hermes-natalia
3. Restart: sudo systemctl restart hermes-natalia
4. Verify: hermes-agent status

## Important URLs
- Agent API: https://natalia-hermes.studex.cloud:8443/api
- Metrics: http://natalia-hermes.studex.cloud:9090/metrics
- Logs: journalctl -u hermes-natalia -n 100
- GlobalMarkets: https://globalmarkets.pplx.app/hermes-natalia
```

---

### **04:00 PM - Go-Live Confirmation (30 min)**

**Final Sign-Off:**

```
DEPLOYMENT COMPLETE ✅

System Status:
✅ Hermes Agent: ACTIVE
✅ Orgo.ai: 3/3 HEALTHY
✅ GlobalMarkets: SYNCING
✅ Tailscale: CONNECTED
✅ Monitoring: ACTIVE
✅ Backups: ENABLED

Natalia's Access:
✅ Claude Remote Desktop: READY
✅ GlobalMarkets.pplx.app: CONFIGURED
✅ Direct SSH: OPERATIONAL
✅ Emergency Procedures: DOCUMENTED

First Partnership Match:
✅ EXECUTED SUCCESSFULLY
✅ Match quality: EXCELLENT
✅ Sync to GlobalMarkets: CONFIRMED

Monitoring:
✅ Alerts configured
✅ Metrics flowing
✅ Logs being collected
✅ 24/7 uptime tracking

Ready for Live Operations
```

---

## 📊 Success Metrics (End of Day)

| Metric | Target | Status |
|--------|--------|--------|
| VM Online | 100% | ✅ |
| Hermes Running | Active | ✅ |
| Orgo Deployment | 3/3 Healthy | ✅ |
| API Responsive | <200ms | ✅ |
| Database Connected | Yes | ✅ |
| GlobalMarkets Synced | Yes | ✅ |
| Monitoring Active | Yes | ✅ |
| Natalia Trained | Yes | ✅ |

---

## 🚀 Post-Launch (Next 24 Hours)

**Immediate (Tonight):**
- [ ] Monitor agent performance
- [ ] Check first partnership matches
- [ ] Verify no errors in logs
- [ ] Confirm Natalia can access all systems

**Tomorrow Morning:**
- [ ] Review overnight performance
- [ ] Check any alerts
- [ ] First business day operations
- [ ] Prepare for Rwanda hackathon (Aug 1)

**This Week:**
- [ ] Optimize agent for African market
- [ ] Begin live partnership matching
- [ ] Connect first AfricaBiz participants
- [ ] Scale to full operations

---

## 📞 EMERGENCY CONTACTS

**During Deployment (Today):**
- Sentinel: sentinel@studex.dev | +1-XXX-SENTINEL
- Team Lead: t.ramaphosa@studex.dev
- Support: support@studex.dev

**24/7 After Launch:**
- Natalia: n@africabiz.ru | +27 76 269 8044
- Emergency Hotline: +1-XXX-HERMES-1
- Slack: #hermes-natalia-deployment

---

**DEPLOYMENT STATUS: READY TO EXECUTE**  
**ESTIMATED COMPLETION: 04:00 PM (July 18, 2026)**  
**GO/NO-GO DECISION: GO ✅**

**Let's deploy Natalia's Hermes Agent today!** 🚀🤖
