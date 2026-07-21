# 🚀 AfricaBiz Strategy Document - Deployment Guide

## Quick Deploy to Vercel (30 seconds)

### Option 1: One-Click Deploy (Easiest)

1. Go to https://vercel.com/new
2. Connect your GitHub repository (studex/studexhermes-command)
3. Select branch: `claude/africa-vm-setup-v39tuy`
4. Click "Deploy"
5. Your site goes live at `https://<your-project>.vercel.app`

**That's it!** Share the URL with AfricaBiz.

---

### Option 2: CLI Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# From project root
vercel --prod

# Your project URL will be displayed
```

---

## Setting Up Supabase (Optional - For View Tracking)

### Create Supabase Project

1. Go to https://supabase.com
2. Create new project (free tier available)
3. Get your `Project URL` and `API Key`

### Create Views Table

```sql
create table document_views (
  id bigint primary key generated always as identity,
  viewer_email text,
  viewed_at timestamp default now(),
  organization text
);

alter table document_views enable row level security;
```

### Track Views (Optional Enhancement)

Add this to the bottom of `public/index.html` before `</body>`:

```html
<script>
  // Optional: Track document views in Supabase
  const trackView = async () => {
    try {
      const email = new URLSearchParams(window.location.search).get('email');
      if (email) {
        // Send to your Supabase endpoint
        // This is optional - just for analytics
      }
    } catch (e) {
      console.log('Analytics not configured');
    }
  };
  window.addEventListener('load', trackView);
</script>
```

---

## What Gets Deployed

✅ **Single HTML file** - `/public/index.html`
- Complete AfricaBiz + Agentic Rise strategy
- Professional styling
- Navigation menu
- All pricing, timeline, contact information
- Mobile responsive

---

## Sharing with AfricaBiz

### Send This Email:

```
Subject: AfricaBiz + Agentic Rise: Complete Strategy Document

Hi [AfricaBiz Leadership],

Please review our complete partnership proposal at:

https://[your-project].vercel.app

This document contains:
✓ Three-layer ecosystem overview
✓ Infrastructure & pricing details
✓ Manufacturing + co-investment model
✓ Financial projections (363% Y1 ROI)
✓ Timeline & decision milestones
✓ Contact information

Timeline:
- July 24: Review & questions
- July 27: Contract negotiation
- July 31: Agreement signed
- Aug 1: Go live

Questions? Contact t.ramaphosa@studex.dev

Best regards,
[Your Name]
```

---

## Custom Domain (Optional)

### Add Your Domain to Vercel

1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., africabiz-strategy.studex.dev)
3. Update DNS records as shown
4. Site now at: `https://africabiz-strategy.studex.dev`

---

## Update Strategy Document

If you need to update the proposal:

1. Edit `/public/index.html` or `/AFRICABIZ_COMPLETE_STRATEGY.html`
2. Commit and push:
   ```bash
   git add public/index.html
   git commit -m "Update: [what changed]"
   git push
   ```
3. Vercel auto-redeploys (30 seconds)

---

## Hosting Comparison

| Feature | Vercel | Supabase |
|---------|--------|----------|
| **Purpose** | Serve HTML (this doc) | Database (optional analytics) |
| **Cost** | Free (static site) | Free tier included |
| **Setup Time** | 30 seconds | 5 minutes |
| **Best For** | Quick deployment | View tracking & analytics |

---

## Final Shareable Link

Once deployed to Vercel, your link will be:

```
https://YOUR_PROJECT_NAME.vercel.app
```

**Share this ONE link with AfricaBiz** - they see the entire proposal in one place.

---

## Support

- **Vercel Issues:** https://vercel.com/support
- **Supabase Help:** https://supabase.com/docs
- **Questions:** t.ramaphosa@studex.dev

---

**Status:** Ready to deploy  
**Next Step:** Run `vercel --prod` or connect GitHub to Vercel UI

