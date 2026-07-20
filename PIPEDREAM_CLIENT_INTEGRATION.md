# 🔗 Pipedream Client Integration Guide
## Easy Tool Connection for AfricaBiz Platform

**Purpose:** Enable clients (entrepreneurs, partners, researchers) to automatically connect their favorite tools to the AfricaBiz ecosystem via Pipedream workflows.

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Pre-Built Workflows](#pre-built-workflows)
3. [Client Setup Instructions](#client-setup-instructions)
4. [Common Integrations](#common-integrations)
5. [Custom Workflows](#custom-workflows)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### For Clients (5 minutes to setup)

1. **Go to Pipedream:** https://pipedream.com
2. **Sign up** (free tier supports 100,000 events/month)
3. **Connect AfricaBiz** using the API key provided during onboarding
4. **Choose a pre-built workflow** (see templates below)
5. **Deploy** - data flows automatically!

### For Platform Admins (Setup once, use for all clients)

```bash
# 1. Create Pipedream app account
# 2. Pre-build 5-10 common workflows
# 3. Provide clients with one-click setup links
# 4. Monitor data flow in Pipedream dashboard
```

---

## Pre-Built Workflows

### Workflow 1: Daily Agent Report → Email

**What it does:** Send clients a daily summary of opportunities their agents found

**Client connects:** AfricaBiz API → Email (Gmail/Outlook)

**Setup time:** 2 minutes

```javascript
// Trigger: Schedule (Daily at 9:15 AM CAT)
// Step 1: Fetch from AfricaBiz API
const response = await axios.get('https://api.africabiz.dev/agents/summary', {
  headers: { 'Authorization': `Bearer ${this.africabiz_api_key}` },
  params: { region: this.region, period: 'last_24h' }
});

// Step 2: Transform data
const summary = {
  opportunities: response.data.opportunities.length,
  totalValue: response.data.totalDealValue,
  topDeal: response.data.topDeal,
  agentPerformance: response.data.agentStats
};

// Step 3: Send email
await axios.post('https://api.sendgrid.com/v3/mail/send', {
  personalizations: [{
    to: [{ email: this.user_email }],
    dynamic_template_data: summary
  }],
  from: { email: 'reports@africabiz.dev' },
  template_id: 'd-daily-report-template'
}, {
  headers: { 'Authorization': `Bearer ${this.sendgrid_api_key}` }
});

return { status: 'sent', recipients: 1, opportunities: summary.opportunities };
```

**Client outcome:** ✓ Receives email every morning with overnight opportunities

---

### Workflow 2: New Partnership Deal → Slack Notification

**What it does:** Alert team on Slack when a deal moves to "Closing" stage

**Client connects:** AfricaBiz API → Slack

**Setup time:** 3 minutes

```javascript
// Trigger: Webhook (AfricaBiz sends POST when deal status changes)
// Event: deal.status_changed

if (this.event.new_status === 'closing') {
  await axios.post(this.slack_webhook_url, {
    channel: '#deals',
    username: 'AfricaBiz Bot',
    icon_emoji: ':moneybag:',
    attachments: [{
      color: '#059669',
      title: `🎯 Deal Moving to Closing: ${this.event.deal.name}`,
      fields: [
        { title: 'Value', value: `$${this.event.deal.value.toLocaleString()}`, short: true },
        { title: 'Agent', value: this.event.agent.name, short: true },
        { title: 'Region', value: this.event.region, short: true },
        { title: 'Days in Current Stage', value: this.event.daysInStage, short: true },
        { title: 'Next Steps', value: this.event.deal.nextSteps }
      ],
      actions: [
        {
          type: 'button',
          text: 'View in Dashboard',
          url: `https://dashboard.africabiz.dev/deals/${this.event.deal.id}`
        }
      ]
    }]
  });
}

return { notified: true, slack_ts: response.ts };
```

**Client outcome:** ✓ Team sees deal updates in real-time on Slack

---

### Workflow 3: VM Metrics → Google Sheets

**What it does:** Log VM performance metrics to a Google Sheet for tracking

**Client connects:** AfricaBiz API → Google Sheets

**Setup time:** 3 minutes

```javascript
// Trigger: Schedule (Every 6 hours)
// Step 1: Fetch VM metrics from AfricaBiz
const metrics = await axios.get('https://api.africabiz.dev/infrastructure/vms', {
  headers: { 'Authorization': `Bearer ${this.africabiz_api_key}` },
  params: { customer_id: this.customer_id }
});

// Step 2: Prepare rows for Google Sheets
const rows = metrics.data.vms.map(vm => [
  new Date().toISOString(),
  vm.name,
  vm.tier,
  vm.cpu_usage + '%',
  vm.memory_usage + '%',
  vm.storage_usage + '%',
  vm.status,
  vm.uptime_percentage + '%'
]);

// Step 3: Append to Google Sheet
const result = await this.google_sheets.spreadsheets.values.append({
  spreadsheetId: this.sheet_id,
  range: 'VM Metrics!A:H',
  valueInputOption: 'RAW',
  resource: { values: rows }
});

return { rows_added: rows.length, update_range: result.updates.updatedRange };
```

**Client outcome:** ✓ Historical metrics tracked in spreadsheet for analysis

---

### Workflow 4: Partnership Opportunity → Salesforce/HubSpot

**What it does:** Auto-create CRM leads from new partnership opportunities

**Client connects:** AfricaBiz API → Salesforce/HubSpot

**Setup time:** 4 minutes

```javascript
// Trigger: Webhook (New opportunity identified by agents)
// Step 1: Transform AfricaBiz opportunity to CRM format

const crmLead = {
  // Salesforce format
  FirstName: this.opportunity.contact.firstName,
  LastName: this.opportunity.contact.lastName,
  Email: this.opportunity.contact.email,
  Phone: this.opportunity.contact.phone,
  Company: this.opportunity.company,
  LeadSource: 'AfricaBiz_Agent_Network',
  Industry: this.opportunity.industry,
  Description: `Agent: ${this.opportunity.agent.name}\nRegion: ${this.opportunity.region}\nEstimated Value: $${this.opportunity.estimatedValue}\nAgent Analysis: ${this.opportunity.analysis}`,
  // Custom fields
  africabiz_opportunity_id: this.opportunity.id,
  africabiz_agent: this.opportunity.agent.name,
  africabiz_confidence: this.opportunity.confidenceScore + '%'
};

// Step 2: Create lead in Salesforce
const lead = await axios.post(
  `https://${this.salesforce_instance}.salesforce.com/services/data/v57.0/sobjects/Lead`,
  crmLead,
  {
    headers: {
      'Authorization': `Bearer ${this.salesforce_access_token}`,
      'Content-Type': 'application/json'
    }
  }
);

// Step 3: Link back to AfricaBiz
await axios.post('https://api.africabiz.dev/opportunities/link-crm', {
  opportunity_id: this.opportunity.id,
  crm_system: 'salesforce',
  crm_lead_id: lead.data.id,
  crm_url: `https://${this.salesforce_instance}.salesforce.com/${lead.data.id}`
}, {
  headers: { 'Authorization': `Bearer ${this.africabiz_api_key}` }
});

return { crm_lead_created: lead.data.id, linked: true };
```

**Client outcome:** ✓ Leads auto-populated in CRM, ready for sales team

---

### Workflow 5: Research Center Activity → Discord/Teams

**What it does:** Post research center updates to team communication channel

**Client connects:** AfricaBiz API → Discord/Microsoft Teams

**Setup time:** 2 minutes

```javascript
// Trigger: Webhook (Research center publishes update)
// Teams/Discord format

const embed = {
  title: `🔬 ${this.update.research_center} - ${this.update.title}`,
  description: this.update.summary,
  color: this.update.working_group === 'AI_Security' ? 3447003 : 16776960,
  fields: [
    { name: 'Working Group', value: this.update.working_group, inline: true },
    { name: 'Type', value: this.update.type, inline: true },
    { name: 'Participants', value: this.update.participant_count + ' researchers', inline: false },
    { name: 'Key Findings', value: this.update.findings.join('\n• ') }
  ],
  footer: { text: `Posted at ${new Date(this.update.timestamp).toLocaleString()}` }
};

// Post to Teams
await axios.post(this.teams_webhook_url, {
  type: 'message',
  attachments: [{
    contentType: 'application/vnd.microsoft.card.adaptive',
    contentUrl: null,
    content: {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        { type: 'TextBlock', text: embed.title, weight: 'bolder', size: 'large' },
        { type: 'TextBlock', text: embed.description, wrap: true },
        { type: 'TextBlock', text: `**${embed.fields[3].name}**` },
        { type: 'TextBlock', text: embed.fields[3].value, wrap: true }
      ]
    }
  }]
});

return { posted: true, channel: 'research-updates' };
```

**Client outcome:** ✓ Research center updates in team chat automatically

---

## Client Setup Instructions

### Step-by-Step for Your Clients

#### Phase 1: Pipedream Account (5 min)

```
1. Go to pipedream.com
2. Click "Sign Up Free"
3. Create account (email/password or OAuth)
4. Verify email
5. You're ready!
```

#### Phase 2: Connect AfricaBiz (2 min)

**Option A: One-Click Setup Link (Easiest)**

Provide clients with pre-configured link:
```
https://pipedream.com/apps/new?app=africabiz&template=daily-agent-report

This auto-creates workflow with AfricaBiz connected
```

**Option B: Manual Connection**

```
1. In Pipedream, click "Create Workflow"
2. Add first step: "HTTP Request" or choose trigger
3. Click "+" to add connection
4. Select "AfricaBiz"
5. Paste API key (provided in onboarding email)
6. Test connection
```

#### Phase 3: Choose Workflow (2 min)

**Provided templates:**
- [ ] Daily Agent Reports (→ Email)
- [ ] Deal Alerts (→ Slack)
- [ ] VM Metrics (→ Google Sheets)
- [ ] Partnership Leads (→ CRM)
- [ ] Research Updates (→ Discord/Teams)

#### Phase 4: Customize (3 min)

```
• Change email recipients
• Select Slack channel
• Choose spreadsheet
• Map CRM fields
• Pick notification times
```

#### Phase 5: Deploy & Activate

```
Click "Deploy" → Workflow is LIVE ✓
```

---

## Common Integrations

### Email Services
- **Gmail** - Daily briefings, opportunity alerts
- **SendGrid** - Transactional emails, custom templates
- **Mailchimp** - Newsletter, broadcast updates
- **Outlook** - Enterprise email sync

### Communication
- **Slack** - Deal updates, agent alerts, metrics
- **Microsoft Teams** - Research center posts, milestones
- **Discord** - Community updates, announcements
- **Telegram** - Mobile alerts to team phones

### Data & Analytics
- **Google Sheets** - Metrics tracking, dashboards
- **Airtable** - Deal pipeline, opportunity database
- **Data Studio** - BI & visualization
- **Tableau** - Advanced analytics

### CRM & Sales
- **Salesforce** - Lead creation, deal sync
- **HubSpot** - Contact sync, deal tracking
- **Pipedrive** - Pipeline management
- **Freshsales** - Customer database

### Cloud Storage
- **Google Drive** - Document sharing
- **OneDrive** - Enterprise storage
- **Dropbox** - File sync
- **AWS S3** - Large data storage

### Payment & Finance
- **Stripe** - Invoice & payment notifications
- **PayPal** - Transaction alerts
- **Accounting software** - Invoice sync

---

## Custom Workflows

### Build Your Own (Advanced)

**For custom integrations not in templates:**

1. **Start with Webhook Trigger**
   ```javascript
   // AfricaBiz sends data here when event occurs
   this.event // Contains full event payload
   ```

2. **Transform Data**
   ```javascript
   // Process, filter, aggregate data as needed
   const formatted = transform(this.event);
   ```

3. **Send to Target Service**
   ```javascript
   // Use axios or service-specific SDKs
   await targetService.send(formatted);
   ```

4. **Handle Errors**
   ```javascript
   try {
     // workflow steps
   } catch (error) {
     // Notify team, retry, fallback
     await notifyError(error);
   }
   ```

### Example: Custom Workflow for Your Client

**Goal:** Sync AfricaBiz opportunities → Excel file → Email to investor

```javascript
// Step 1: Fetch opportunities
const opps = await axios.get('https://api.africabiz.dev/opportunities', {
  headers: { 'Authorization': `Bearer ${this.api_key}` },
  params: { status: 'closing', minValue: 250000 }
});

// Step 2: Format for Excel
const rows = opps.data.map(opp => [
  opp.date,
  opp.company,
  opp.value,
  opp.agent,
  opp.confidence + '%',
  opp.nextSteps
]);

// Step 3: Create Excel file (using Pipedream's built-in step)
const buffer = createExcelFile(rows);

// Step 4: Email to investor
await axios.post('https://api.sendgrid.com/v3/mail/send', {
  personalizations: [{
    to: [{ email: 'investor@example.com' }],
    subject: `AfricaBiz Opportunities Report - ${new Date().toDateString()}`
  }],
  from: { email: 'alerts@africabiz.dev' },
  content: [{ type: 'text/html', value: 'See attached opportunities report' }],
  attachments: [{
    filename: 'opportunities.xlsx',
    type: 'application/vnd.ms-excel',
    content: buffer.toString('base64')
  }]
}, {
  headers: { 'Authorization': `Bearer ${this.sendgrid_key}` }
});

return { opportunities_sent: rows.length };
```

---

## API Reference

### AfricaBiz API Endpoints for Pipedream

All endpoints require:
```
Header: Authorization: Bearer {API_KEY}
Header: Content-Type: application/json
Base URL: https://api.africabiz.dev
```

#### Agents Endpoint
```
GET /agents/summary
  params: { region, period, customer_id }
  returns: { opportunities[], totalDealValue, agentStats[] }

GET /agents/{agent_id}/performance
  returns: { dailyMetrics[], historicalData, successRate }
```

#### Opportunities Endpoint
```
GET /opportunities
  params: { status, region, minValue, maxValue, daysInStage }
  returns: { opportunities[] }

POST /opportunities/link-crm
  body: { opportunity_id, crm_system, crm_lead_id, crm_url }
  returns: { linked: true }
```

#### Infrastructure Endpoint
```
GET /infrastructure/vms
  params: { customer_id }
  returns: { vms[{ name, tier, cpu_usage, memory_usage, status }] }

GET /infrastructure/metrics
  params: { period }
  returns: { resourceMetrics[] }
```

#### Research Center Endpoint
```
GET /research/updates
  params: { working_group, limit }
  returns: { updates[] }

POST /research/subscribe
  body: { webhook_url, events[] }
  returns: { subscription_id }
```

#### Webhooks
```
POST {your_webhook_url}
  when: deal.status_changed
  payload: { event, deal, agent, timestamp }

POST {your_webhook_url}
  when: opportunity.new
  payload: { opportunity, agent, confidence, timestamp }

POST {your_webhook_url}
  when: vm.alert
  payload: { vm, metric, threshold, value, timestamp }
```

---

## Troubleshooting

### Common Issues & Solutions

**Issue 1: "Authentication Failed"**
```
✓ Verify API key is correct (copy from onboarding email)
✓ Check API key hasn't expired (refresh if >90 days old)
✓ Ensure Bearer token format: "Bearer sk_live_xxxxx"
✓ Test in Pipedream's "Test" button before deploying
```

**Issue 2: "Webhook Not Receiving Data"**
```
✓ Verify webhook URL is publicly accessible
✓ Check firewall/security allows POST requests
✓ Ensure Pipedream source is in AfricaBiz webhook whitelist
✓ Monitor "Execution History" in Pipedream dashboard
```

**Issue 3: "Data Not Formatted Correctly"**
```
✓ Use Pipedream's debugging step to inspect payload
✓ Check field names match target service API
✓ Test transformation logic with sample data
✓ Add error handling: `try/catch` blocks
```

**Issue 4: "Rate Limiting / Too Many Requests"**
```
✓ Pipedream free tier: 100,000 events/month
✓ AfricaBiz API: 1,000 requests/hour default
✓ Solution: Upgrade Pipedream tier or batch requests
✓ Add delays between requests: `await sleep(500)`
```

**Issue 5: "Workflow Stops Running"**
```
✓ Check "Monitoring" tab for error logs
✓ Verify external services (Gmail, Slack, etc.) still connected
✓ Ensure API keys for 3rd party services haven't expired
✓ Restart workflow: Deploy → Undeploy → Deploy
```

### Getting Help

1. **Pipedream Docs:** https://pipedream.com/docs
2. **AfricaBiz API Docs:** https://docs.africabiz.dev
3. **Slack Support:** #integrations channel
4. **Email:** integrations@africabiz.dev

---

## Client Onboarding Checklist

### For Each New Client

- [ ] Send Pipedream setup email with link
- [ ] Provide API key in secure onboarding doc
- [ ] Share pre-configured workflow templates
- [ ] Client creates Pipedream account
- [ ] Client connects AfricaBiz API
- [ ] Client selects & deploys workflow
- [ ] Test: Trigger event, verify output
- [ ] Set up 2-3 workflows for their use case
- [ ] Schedule check-in at 1 week, 1 month
- [ ] Gather feedback, iterate

---

## Success Metrics

**Track these to measure integration success:**

| Metric | Target | How to Track |
|--------|--------|-------------|
| **Clients using Pipedream** | >80% | Count active workflows |
| **Average workflows/client** | 3+ | Sum deployments / clients |
| **Data flow errors** | <1% | Monitor Pipedream logs |
| **Client satisfaction** | >4.5/5 | Send feedback survey |
| **Time to deploy** | <15 min | Track from signup to first workflow |
| **Data latency** | <1 min | Check webhook response times |
| **Integration uptime** | >99.5% | Monitor scheduled triggers |

---

## Next Steps

1. **This week:** Build 5 template workflows above
2. **Next week:** Send to pilot clients (Natalia, research center)
3. **After feedback:** Refine, add 5 more templates
4. **By launch:** 15+ workflows ready for Rwanda cohort

**Questions?** Reach out to the AfricaBiz platform team.
