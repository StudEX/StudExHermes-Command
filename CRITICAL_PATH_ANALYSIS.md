# 🛣️ Critical Path Analysis: May 28 - August 20, 2026

**Purpose:** Identify sequencing constraints, parallel work, and true time-to-revenue  
**Branch:** `claude/brave-wozniak-6BzGE`

---

## CRITICAL PATH CHAIN

```
┌──────────────────────────────────────────────────────────────────────┐
│                     REVENUE TIMELINE (90 Days)                        │
└──────────────────────────────────────────────────────────────────────┘

May 28 ─────────► Jun 3 ─────────► Jun 10 ─────────► Jun 24 ─────────► Aug 20
  |                 |                 |                 |                 |
  
[Phase 0]       [Phase 1A]        [Phase 1B]       [Phase 2]        [Phase 3]
FOUNDATION      CORE DEPLOY       AGENT ACT        REVENUE          SCALE
(16 hours)      (7 days)          (5 days)        (10 days)        (60 days)

Stitch Active   VMs 1-5 Online    Content Live    Sales Started    R4M Annual

Current State:   R92K/mo          R250K/mo        R685K/mo         R1.3M/mo Target
```

---

## DEPENDENCY MAP

### 🔴 CRITICAL PATH (No slack - any delay = slips revenue)

```
START (May 28)
    │
    ├─→ [CRITICAL] VM6 Deploy (2 days) ⛔ BLOCKS EVERYTHING
    │       Owner: Coder Chief
    │       Tasks: Flyctl → OpenCLAW container → Deploy → Verify
    │       Delay Impact: +1 day = -R100K+ revenue in June
    │
    ├─→ [CRITICAL] Shared Services (2 days) ⛔ BLOCKS VMs 1-5
    │       Owner: Integrations Chief
    │       Tasks: Postgres → Redis → Tailscale → CI/CD
    │       Delay Impact: +1 day = -R50K+ revenue in June
    │
    ├─→ [CRITICAL] Stitch Activation (2 days) ⛔ BLOCKS REVENUE
    │       Owner: Operations Chief  
    │       Tasks: Phase 1 → Phase 2 → Testing
    │       Delay Impact: +1 day = -R30K revenue (lost daily sales)
    │       Recoverable: Can go live immediately post-activation
    │
    └─→ [PARALLEL SAFE] VM1-5 Deployment (7 days)
            └─→ [CRITICAL] VM3 Deploy (Day 3 of parallel) ⛔ BLOCKS CONTENT
                    Tasks: Deploy → 9 Chiefs init → Content pipeline
                    Delay Impact: +1 day = -R50K revenue (lost content reach)

    └─→ [CRITICAL] Content Pipeline (Day 3 of VM3)
            └─→ [CRITICAL] Content Siege Launch (Jun 15)
                    Tasks: 240+ pieces in 7 days
                    Delay Impact: +1 day = -R30K revenue (engagement decay)
```

### GREEN PATH (Can move fast, less constrained)

```
VM1 (Studex Meat) Deploy
    ├─→ B2B Outreach Campaign (Batch 1)
    │       Start: Jun 1 (in parallel with VM2-5 deployment)
    │       Duration: 30 days
    │       No dependencies on other VMs
    │       Risk: Low (email works offline)
    │
VM2 (Dark Factory) Deploy
    ├─→ BMAD SaaS Operations
    │       Start: Jun 4 (parallel with VM3)
    │       No blocking dependencies
    │       Risk: Low
    │
VM4 (Agentic Lab) Deploy
    ├─→ Agency Operations
    │       Start: Jun 8 (parallel)
    │       No blocking dependencies
    │       Risk: Low
    │
VM5 (Stitch Money) Deploy
    ├─→ BNPL Integration Testing
    │       Start: Jun 10 (parallel)
    │       Depends on: Stitch Phase 2 completion (May 30)
    │       Risk: Low (payment flow tested earlier)
```

---

## SEQUENCING DECISIONS

### Option A: Sequential (SAFE)
Deploy VMs one by one: VM1 → VM2 → VM3 → VM4 → VM5
- **Pro:** Low risk, easy to debug
- **Con:** Slower to revenue, takes 7-10 days
- **Recommendation:** ❌ TOO SLOW (loses May/June revenue)

### Option B: Parallel (RECOMMENDED)
Deploy VMs 1-5 in parallel after VM6 + shared services ready
- **Pro:** 50% faster, hits June revenue targets
- **Con:** Requires vigilant monitoring
- **Recommendation:** ✅ DO THIS (May 29-30 → Jun 10 parallel)

```
Timeline with Option B:

May 28 ─────────────── VM6 ready (day 2)
May 29 ─────────────── Shared services ready (day 2)
May 30 ─────────────── Stitch verified
Jun 1  ─ VM1 deploy ─ B2B outreach starts
Jun 1  ─ VM2 deploy ─ (parallel)
Jun 2  ─ VM3 deploy ─ (parallel) ⭐ PRIORITY
Jun 3  ─ VM4 deploy ─ (parallel)
Jun 4  ─ VM5 deploy ─ (parallel)
Jun 5  ─────────────── All VMs online + mesh verified
Jun 15 ─────────────── Content siege launches
Jun 24 ─────────────── Revenue hitting R250K target
```

---

## RECOVERY TIME ANALYSIS

### If Blocker Occurs

| Blocker | Days to Recover | Revenue Impact | Mitigation |
|---------|-----------------|----------------|-----------|
| VM6 fails day 1 | 1 day | -R10K | Pre-stage Dockerfile, have rollback |
| Stitch integration broken | 1 day | -R50K | Have payment page alternative (bank transfer) |
| VM3 crashes | 2 hours | -R5K | Auto-restart via health check, backup agent |
| Content pipeline fails | 4 hours | -R10K | Manual posting backup using pre-generated pieces |
| Internet outage | TBD | -R100K/day | Not recoverable (Fly.io down too) |
| Tailscale mesh fails | 2 hours | -R20K | Switch to standard REST APIs, no mesh |

### Parallel Work to Reduce Risk

```
While waiting for VM6 approval:
├─ [ ] Prepare OpenCLAW Dockerfile (2 hours)
├─ [ ] Test Stitch Phase 1-2 on personal Shopify (2 hours)
├─ [ ] Prepare B2B email templates (1 hour)
├─ [ ] Set up AgentMail account + import contacts (1 hour)
└─ [ ] Prepare content calendar + image prompts (2 hours)

Total: 8 hours of prep work that can start immediately
```

---

## WORKLOAD DISTRIBUTION

### By Owner (May 28 - Jun 24)

**Coder Chief (Highest Load)**
```
May 28-29: VM6 deployment (16 hours) ⛔ CRITICAL
May 29-30: Shared services (8 hours) ⛔ CRITICAL
Jun 1-10:  VM1-5 deployment (40 hours, parallel)
Jun 1-24:  Monitoring + troubleshooting (40 hours)
Total: ~100 hours over 27 days (3.7 hrs/day)
Risk: Burnout | Mitigation: Delegate VM4-5 to backup
```

**Content Chief (Peak at Week 3)**
```
May 28-Jun 14: Content pipeline setup (20 hours)
Jun 15-21: Content siege (40 hours) ⛔ PEAK
Jun 22-24: Optimization + review (10 hours)
Total: ~70 hours over 27 days (2.6 hrs/day)
Risk: Quality drops under pressure | Mitigation: Human review gates
```

**Operations Chief (Continuous)**
```
May 28-30: Stitch setup (4 hours) ⛔ REVENUE BLOCKER
Jun 1-30:  B2B outreach + email management (30 hours)
Jun 1-24:  Daily standup + reporting (5 hours)
Total: ~40 hours over 27 days (1.5 hrs/day)
Risk: Low | Mitigation: Automate with AgentMail
```

**Integrations Chief (Setup-heavy front-loaded)**
```
May 28-30: Mesh + monitoring setup (12 hours) ⛔ CRITICAL
Jun 1-10:  Verify inter-VM communication (8 hours)
Jun 11-24: Optimization + scale (5 hours)
Total: ~25 hours over 27 days (0.9 hrs/day)
Risk: Medium (Tailscale complexity) | Mitigation: Documentation
```

**Heartbeat Chief (Always-on)**
```
Jun 3+: Daily health checks (1 hour/day)
Jun 15+: Content pipeline monitoring (2 hours/day)
Jun 20+: Revenue dashboarding (1 hour/day)
Total: ~30 hours over 27 days (1.1 hrs/day ongoing)
```

### Total Team Load
- **Week 1 (May 28-Jun 3):** 40 hours (intense setup)
- **Week 2 (Jun 4-10):** 50 hours (parallel VM deployment)
- **Week 3 (Jun 11-17):** 70 hours (content siege peak)
- **Week 4 (Jun 18-24):** 40 hours (optimization + reporting)

**Total:** ~200 hours over 27 days = 7.4 hrs/day team average

---

## RISK SEVERITY & MITIGATION

### 🔴 CRITICAL (Block Revenue)

| Risk | Probability | Days to Impact | Mitigation |
|------|-------------|----------------|-----------|
| VM6 fails | 15% | 1 day | Pre-stage, health checks, auto-restart |
| Stitch integration fails | 10% | 1 day | Bank transfer fallback for orders |
| VM3 fails (content) | 20% | 2 hours | Manual posting from pre-generated queue |
| Tailscale mesh breaks | 5% | 2 hours | Switch to REST APIs (slower but works) |
| Postgres/Redis down | 5% | 4 hours | Restore from backup (hourly snapshots) |

### 🟡 HIGH (Impacts Velocity)

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Content quality drops | 30% | -50% engagement | Human review loop, voting system |
| Email campaign low engagement | 20% | -30% B2B revenue | Optimize subject lines, A/B test |
| Paid ads poor ROAS | 25% | -50% paid revenue | Pause non-performers, scale winners |
| Agent coordination delays | 15% | -2 days shipping | Simplified fallback agents |

### 🟢 LOW (Minor Impact)

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Fly.io cost overrun | 10% | +R500-1K/mo | Reduce VM size, add limits |
| API cost spike | 5% | +R1-2K/mo | Rebalance Tier 0/1/2 split |
| Duplicate agent requests | 10% | +2 hours debug | Request deduplication logic |

---

## DECISION TREE FOR PARALLEL EXECUTION

```
Decision: Can we parallelize Task X with Task Y?

├─ Do they share infrastructure (VM6, Postgres, Redis)?
│   ├─ YES → Serial (Task A first)
│   └─ NO → Can parallelize (go to next check)
│
├─ Do they share personnel?
│   ├─ YES → Serial if critical owner unavailable
│   └─ NO → Can parallelize
│
├─ Can failures in Y recover from failures in X?
│   ├─ YES → Serial (X first, then Y)
│   └─ NO → Can parallelize
│
└─ DECISION:
    ├─ Serial: X → Y (do in order)
    └─ Parallel: Start X and Y together
```

### Applied Examples

```
Q: VM6 deploy (X) vs Stitch setup (Y)?
├─ Share infra? NO (different services)
├─ Share personnel? MAYBE (some overlap)
├─ Recovery dependency? NO
└─ DECISION: Can start in parallel on May 28
   (but Stitch needs Shopify which is independent)
   ✅ Parallel: Both can start day 1

Q: Stitch setup (X) vs VM1 deploy (Y)?
├─ Share infra? YES (both use Postgres eventually)
├─ Share personnel? YES (Operations Chief)
├─ Recovery dependency? YES (Stitch must work first)
└─ DECISION: Stitch first, then VM1 integration
   ✅ Serial: Stitch (May 29-30) → VM1 integration (Jun 1-2)

Q: VM1-5 deployment?
├─ Share infra? NO (separate VMs)
├─ Share personnel? YES (Coder Chief leads)
├─ Recovery dependency? NO (each independent)
└─ DECISION: Can all deploy in parallel
   ✅ Parallel: Jun 1-10 all together
```

---

## TIMELINE COMPARISON: OPTIONS

### SCENARIO A: Conservative (Sequential)
```
May 28-29: VM6 (2 days)
May 29-30: Shared services (2 days)
May 30: Stitch activation (1 day)
Jun 1-3: VM1 deploy + test (3 days)
Jun 4-5: VM2 deploy + test (2 days)
Jun 6-7: VM3 deploy + test (2 days) [CONTENT DELAYED]
Jun 8-9: VM4 deploy + test (2 days)
Jun 10-11: VM5 deploy + test (2 days)
Jun 15: Content starts (6 days late) ❌

REVENUE LOSS: -R300K (lost early reach)
TOTAL TIME: 45 days to revenue
```

### SCENARIO B: Parallel (RECOMMENDED)
```
May 28-29: VM6 (2 days)
May 29-30: Shared services (2 days)
May 30: Stitch activation (1 day)
Jun 1-10: VM1-5 deployment (PARALLEL, 10 days)
         + VM3 prioritized (6 days)
         + Content pipeline setup (in parallel)
Jun 15: Content starts ON TIME ✅

REVENUE: Full target
TOTAL TIME: 21 days to revenue
SAVINGS: 24 days / R300K+ revenue
```

### SCENARIO C: Aggressive (With Risk)
```
May 28: VM6 + Shared + Stitch (parallel, 1 day)
May 29-Jun 3: VM1-5 deploy (parallel, 5 days)
Jun 10: All online, content starts (5 days early) ⚠️

PROS: +5 days of content reach = +R150K revenue
CONS: High risk of failures, no buffer time
RECOMMENDATION: Not recommended (burn out team)
```

### RECOMMENDATION: Choose Scenario B (Parallel Conservative)
- ✅ Hits all June revenue targets
- ✅ Manages team load (7.4 hrs/day average)
- ✅ Allows debugging & recovery
- ✅ Builds momentum without rushing
- ✅ 21 days to revenue (Jun 24 target)

---

## DAILY STANDUP CHECKLIST

### Every morning (09:00 SAST) - 15 min

**VM Status** (All systems go?)
- [ ] VM6: Online? Uptime? Logs clean?
- [ ] VM1-5: Responding to pings?
- [ ] Mesh: All nodes connected?
- [ ] Postgres/Redis: Connectivity ok?

**Critical Path** (On track?)
- [ ] Current phase % complete
- [ ] Blockers encountered?
- [ ] ETA shifts?
- [ ] Need escalation?

**Upcoming 24h** (What's next?)
- [ ] Next critical task
- [ ] Owner assigned?
- [ ] Dependencies ready?
- [ ] Resource available?

---

## MONTHLY CHECKPOINT (1st & 15th)

### May 28 (Today - Week 2 checkpoint)
- [ ] Foundation phase on track (target: 100% by Jun 3)
- [ ] Blockers: none expected
- [ ] Forecast: Jun revenue R250K on schedule

### Jun 3 (Week 3 checkpoint)
- [ ] Core deployment phase on track (target: 100% by Jun 10)
- [ ] Blockers: identify & escalate
- [ ] Forecast: Revenue ramping

### Jun 15 (Content siege launch)
- [ ] Agency activation phase on track
- [ ] Content pipeline: 100+/day pieces
- [ ] Revenue: Early traction from first B2B deals

### Jun 24 (End phase 2)
- [ ] All systems stable, revenue hitting R250K+
- [ ] Scale planning for July
- [ ] Quarterly adjustment if needed

---

## RESOURCE ALLOCATION

### Team Capacity (27 days)

| Role | Hours Available | Hours Needed | Utilization | Risk |
|------|-----------------|--------------|-------------|------|
| Coder Chief | 120 | 100 | 83% | 🟡 High (near limit) |
| Content Chief | 90 | 70 | 78% | 🟡 Medium-high |
| Operations Chief | 90 | 40 | 44% | 🟢 Low |
| Integrations Chief | 90 | 25 | 28% | 🟢 Low |
| Heartbeat Chief | 90 | 30 | 33% | 🟢 Low |
| All Others | TBD | 30 | TBD | 🟡 Depends on allocation |

**Recommendation:** 
- Hire backup Coder Chief or Architect for VM4-5 deployment
- Backup Content Chief for manual review loop during siege
- Estimated cost: R5-10K (freelance), ROI: R300K+ (revenue gained)

---

## GO-NO-GO DECISION POINTS

### Go-No-Go: May 28 (TODAY)
**Decision:** Proceed with Scenario B (Parallel)?
```
Requirements:
[ ] Coder Chief available full-time (May 28-Jun 10)
[ ] Content Chief can handle siege prep
[ ] Operations Chief ready for Stitch + B2B
[ ] Integrations Chief ready for mesh setup

If ANY not available: → DELAY 1 week (May 35... June 4 start)
If ALL available: → GO (parallel deployment)
```

### Go-No-Go: Jun 3
**Decision:** Continue to Phase 2 (Content Siege)?
```
Requirements:
[ ] All 6 VMs online and healthy
[ ] Inter-VM communication working
[ ] Content pipeline tested (10+ pieces generated)
[ ] Stitch payment processing live transactions

If ANY failed: → DELAY siege 3-5 days for fixes
If ALL pass: → GO (content siege Jun 15)
```

### Go-No-Go: Jun 15
**Decision:** Launch full content siege?
```
Requirements:
[ ] 775 pieces pre-generated and validated
[ ] Social accounts connected (TikTok, IG, Twitter, LinkedIn)
[ ] Email system tested (5 test sends successful)
[ ] Analytics tracking in place
[ ] Team ready for 24-hour surge (if needed)

If ANY failed: → START with 100 pieces instead of 240
If ALL pass: → GO FULL (240+ pieces in 7 days)
```

---

## SUCCESS METRICS BY PHASE

### PHASE 0: Foundation (May 28-Jun 3)
```
✅ Success = All of these:
   ├─ VM6 live and stable (99%+ uptime)
   ├─ Postgres/Redis/Tailscale connected
   ├─ Stitch Express active (test transaction processed)
   ├─ B2B email campaign queued (85 contacts, 3-email sequence)
   └─ Zero critical blockers remaining
```

### PHASE 1: Core (Jun 4-14)
```
✅ Success = All of these:
   ├─ All 6 VMs online (100% deployment)
   ├─ Inter-VM communication tested (50+ cross-VM calls successful)
   ├─ 9 Chiefs responding to commands (9/9 agents active)
   ├─ Content pipeline generating 100+ pieces/day
   ├─ First 3-5 B2B leads from email campaign
   └─ Revenue: R100K+ (early Studex + B2B sales)
```

### PHASE 2: Revenue (Jun 15-30)
```
✅ Success = All of these:
   ├─ 240+ pieces posted across 4 platforms
   ├─ TikTok: 10K+ views on top content
   ├─ Instagram: 500+ engagement average
   ├─ Email: 25%+ open rate on campaigns
   ├─ B2B: 2-3 wholesale orders (R150K+ value)
   ├─ Paid ads: 2x+ ROAS
   └─ Revenue: R250K+ monthly run-rate
```

### PHASE 3: Scale (Jul 1-Aug 20)
```
✅ Success = All of these:
   ├─ 600+ pieces posted (77% of 775)
   ├─ B2B pipeline: 10+ contacts in negotiation
   ├─ System uptime: 99.9% SLA
   ├─ Agent reliability: 99%+ task success rate
   ├─ Content engagement: +50% month-over-month
   ├─ Revenue: R685K+ monthly run-rate
   └─ R4M+ annual revenue trajectory established
```

---

## CONTINGENCY: If Major Blocker Occurs

### Recovery Sequence

```
1. PAUSE: Stop all non-critical work
2. DIAGNOSE: Identify exact blocker (30 min max)
3. ESCALATE: Notify CTO + affected Chief (5 min)
4. REMEDIATE: Apply fix or workaround (1-4 hours)
5. VALIDATE: Confirm system working (15 min)
6. RESUME: Continue with contingency plan

Example Contingency Plans:

IF Stitch integration fails:
├─ Accept bank transfers for orders (manual)
├─ Process via PayFast (backup provider)
├─ Delay BNPL until resolved (24-48 hours)
└─ Revenue impact: -R10K (worst case)

IF VM3 (content) fails:
├─ Manually post from pre-generated queue
├─ Use VM1 agents for basic content
├─ Reduce posting rate from 100→50/day
└─ Revenue impact: -R30K (worst case)

IF entire Fly.io region fails:
├─ Switch to backup region (jnb → lhr or syd)
├─ Re-deploy from Git (automated)
├─ Expected downtime: 30 min
└─ Revenue impact: -R2-5K per 30 min
```

---

*Last Updated: May 28, 2026*  
*Strategy Owner: Sentinel (CTO)*  
*Next Review: Jun 3, 2026 (Go-No-Go Decision)*
