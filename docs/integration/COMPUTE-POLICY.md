# On-demand workers and costs

Proposal; actual account billing mode and VM identities not yet verified. Orgo browser currently requires sign-in. No machines started, stopped, resized or purchased.

Use workers for finite research, content, testing and coding tasks. Keep the durable queue and scheduling mechanism outside sleeping workers. At wake: acquire one lease, confirm identity/health and budget, restore the job context, execute the approved scope, checkpoint outputs, release the lease, then stop only when no active job/call or unsaved output remains. A busy VM must not be stopped by an idle timer.

AutoMeat and the Super Agent VM are user-named targets, not yet matched to authenticated Orgo IDs. The user's 05:04 SAST report is historical evidence: connection refusal does not alone establish that the entire VM is down, and HTTP 302 is not proof of functioning agent tools.

Orgo published hourly Medium Linux rates on 12 November 2026: $0.055 running, $0.0027 stopped. Stopped disks still cost money. Illustration for 30 days: 4 hours/day running + 20 hours/day stopped = $8.22, versus $39.60 at the hourly running rate for all 720 hours. This excludes model/tool/voice charges, other resources and taxes; it is not the user's bill. Always-on subscription pricing is different, and stopping an included VM does not imply cancelling the subscription.

Source: https://www.orgo.ai/pricing.md

Customer offers should specify job-hours, model/tool allowance, storage and support separately. Show measured usage, unresolved billing and approved maximums in the OS; don't invent cost totals from model token estimates alone.

Ten-minute checkpoints during this build: inspect progress and tests; commit/push only scoped reviewed changes on the integration branch. Never run the repositories' existing git-add-all default-branch auto-push scripts. No persistent scheduler is created for this bounded two-hour delivery request.
