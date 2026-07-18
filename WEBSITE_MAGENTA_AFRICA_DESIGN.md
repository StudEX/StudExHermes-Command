# 🌍 StudEx Command Center - Magenta Africa Theme
## Website Design & Real-Time Dashboard

**Theme:** Magenta Africa - Floating VM Visualization + GlobalMarkets + Restaurant Showcase + Obsidian Brain  
**Status:** Production Design  
**Launch:** August 1, 2026 (Rwanda Hackathon)

---

## 🎨 Color Palette - Magenta Africa

```css
/* Primary Colors */
--magenta-primary: #E01E5A      /* Vivid magenta - leadership, energy */
--magenta-dark: #B71747         /* Deep magenta - authority */
--magenta-light: #FF69B4        /* Light magenta - approachability */

/* Accent Colors */
--gold-accent: #D4AF37          /* Gold - prosperity, wealth */
--terracotta: #CD5C5C           /* Terracotta - earth, authenticity */
--savanna-green: #228B22        /* Forest green - growth, nature */
--ocean-blue: #006994           /* Ocean blue - water, depth */

/* Background */
--bg-dark: #0F0F0F              /* Nearly black - contrast */
--bg-dark-lighter: #1A1A1A      /* Slightly lighter for sections */
--text-primary: #FFFFFF         /* White text */
--text-secondary: #E0E0E0       /* Light gray for secondary */
--text-muted: #999999           /* Muted text for metadata */

/* Borders & Effects */
--magenta-glow: 0 0 20px rgba(224, 30, 90, 0.6)
--gold-glow: 0 0 15px rgba(212, 175, 55, 0.4)
--shadow-soft: 0 10px 40px rgba(0, 0, 0, 0.5)
```

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER/NAV                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  SECTION 1: FLOATING VM VISUALIZATION (Hero)            │ │
│  │  - 3D Computer animation (magenta glowing)              │ │
│  │  - Real-time status (Active/Inactive)                   │ │
│  │  - VM count, uptime, CPU/Memory usage                   │ │
│  │  - Quick access buttons (Rwanda, Nigeria, SA, Global)   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  SECTION 2: GLOBALMARKETS INTEGRATION                   │ │
│  │  - Partnership dashboard (live partnerships)            │ │
│  │  - Deal pipeline (opportunities pending/in-progress)    │ │
│  │  - Revenue metrics (YTD, projected)                      │ │
│  │  - Regional statistics (Rwanda/Nigeria/SA/Global)       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  SECTION 3: KRONENDAL RESTAURANT SHOWCASE               │ │
│  │  - Featured restaurant (Cape Town)                      │ │
│  │  - Photo carousel (magenta-framed gallery)              │ │
│  │  - Instagram feed integration (@kronendal1713)          │ │
│  │  - Menu highlights with gold accents                    │ │
│  │  - Booking/contact CTA                                  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  SECTION 4: OBSIDIAN BRAIN (Intelligence Center)        │ │
│  │  - Daily reports (Ghost Business outputs)               │ │
│  │  - Competitor analysis (Cape Town + Global)             │ │
│  │  - Content strategy (hashtags, posting schedule)        │ │
│  │  - Video scripts (daily Reels recommendations)          │ │
│  │  - Performance analytics (engagement trends)            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                        FOOTER                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🖥️ SECTION 1: FLOATING VM VISUALIZATION (Hero)

### Purpose
Central command center showing real-time infrastructure status with 3D floating computer animation. Establishes visual identity and demonstrates technical sophistication.

### HTML Structure

```html
<section id="vm-hero" class="section-hero">
  <div class="hero-content">
    <h1 class="hero-title">StudEx Command Center</h1>
    <p class="hero-subtitle">Connected. Autonomous. Empowering Africa.</p>
    
    <div class="vm-container">
      <!-- 3D Computer Animation -->
      <div class="vm-computer">
        <div class="computer-monitor">
          <div class="monitor-screen">
            <div class="status-display">
              <div class="status-indicator active"></div>
              <span class="status-text">SYSTEMS ACTIVE</span>
            </div>
            <div class="metrics-grid">
              <div class="metric">
                <span class="label">VMs Online</span>
                <span class="value" id="vm-count">247</span>
              </div>
              <div class="metric">
                <span class="label">Uptime</span>
                <span class="value" id="vm-uptime">99.8%</span>
              </div>
              <div class="metric">
                <span class="label">CPU Usage</span>
                <span class="value" id="vm-cpu">34%</span>
              </div>
              <div class="metric">
                <span class="label">Memory Usage</span>
                <span class="value" id="vm-memory">52%</span>
              </div>
            </div>
          </div>
          <div class="monitor-bezel"></div>
          <div class="monitor-stand"></div>
        </div>
      </div>
      
      <!-- Quick Access Buttons -->
      <div class="vm-quick-access">
        <button class="region-btn" data-region="rwanda">
          <span class="region-icon">🇷🇼</span>
          <span class="region-name">Rwanda</span>
          <span class="region-vms">50 VMs</span>
        </button>
        <button class="region-btn" data-region="nigeria">
          <span class="region-icon">🇳🇬</span>
          <span class="region-name">Nigeria</span>
          <span class="region-vms">85+ VMs</span>
        </button>
        <button class="region-btn" data-region="south-africa">
          <span class="region-icon">🇿🇦</span>
          <span class="region-name">South Africa</span>
          <span class="region-vms">120+ VMs</span>
        </button>
        <button class="region-btn" data-region="global">
          <span class="region-icon">🌐</span>
          <span class="region-name">Global</span>
          <span class="region-vms">50+ VMs</span>
        </button>
      </div>
    </div>
  </div>
</section>
```

### CSS Styling

```css
/* Hero Section */
.section-hero {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-dark) 0%, #1a0f15 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 80px 20px;
}

.hero-content {
  text-align: center;
  max-width: 1200px;
  width: 100%;
  z-index: 10;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, var(--magenta-primary), var(--magenta-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
  text-shadow: var(--magenta-glow);
  filter: drop-shadow(var(--magenta-glow));
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 60px;
  letter-spacing: 2px;
}

/* VM Container */
.vm-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  margin-bottom: 40px;
}

/* 3D Computer Visualization */
.vm-computer {
  perspective: 1000px;
  width: 100%;
  max-width: 500px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: floatComputer 4s ease-in-out infinite;
}

@keyframes floatComputer {
  0%, 100% { transform: translateY(0px) rotateX(0deg) rotateZ(0deg); }
  50% { transform: translateY(-20px) rotateX(2deg) rotateZ(1deg); }
}

.computer-monitor {
  position: relative;
  width: 350px;
  height: 300px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 
    0 0 40px rgba(224, 30, 90, 0.5),
    0 0 80px rgba(224, 30, 90, 0.3),
    inset 0 0 20px rgba(224, 30, 90, 0.2);
  border: 2px solid var(--magenta-primary);
  animation: pulseGlow 3s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 
    0 0 40px rgba(224, 30, 90, 0.5),
    0 0 80px rgba(224, 30, 90, 0.3),
    inset 0 0 20px rgba(224, 30, 90, 0.2);
  }
  50% { box-shadow: 
    0 0 60px rgba(224, 30, 90, 0.7),
    0 0 120px rgba(224, 30, 90, 0.5),
    inset 0 0 30px rgba(224, 30, 90, 0.3);
  }
}

.monitor-screen {
  width: 100%;
  height: 220px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid var(--magenta-light);
}

.status-display {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #FF6B6B;
  animation: pulse 2s ease-in-out infinite;
}

.status-indicator.active {
  background: #51CF66;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  color: var(--text-primary);
  font-weight: bold;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.metric {
  background: rgba(224, 30, 90, 0.1);
  border: 1px solid rgba(224, 30, 90, 0.3);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.metric .label {
  display: block;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric .value {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--magenta-light);
}

.monitor-bezel {
  width: 350px;
  height: 40px;
  background: linear-gradient(90deg, #2a2a2a 0%, #3a3a3a 50%, #2a2a2a 100%);
  margin-top: -5px;
  border-radius: 0 0 15px 15px;
  border-left: 2px solid var(--magenta-primary);
  border-right: 2px solid var(--magenta-primary);
  border-bottom: 2px solid var(--magenta-primary);
}

.monitor-stand {
  width: 20px;
  height: 60px;
  background: linear-gradient(90deg, #2a2a2a 0%, #1a1a1a 50%, #2a2a2a 100%);
  margin: 0 auto;
  border-radius: 0 0 10px 10px;
  border-left: 2px solid var(--magenta-primary);
  border-right: 2px solid var(--magenta-primary);
  border-bottom: 2px solid var(--magenta-primary);
  position: relative;
  top: -15px;
}

/* Quick Access Buttons */
.vm-quick-access {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

.region-btn {
  background: linear-gradient(135deg, rgba(224, 30, 90, 0.2), rgba(255, 105, 180, 0.1));
  border: 2px solid var(--magenta-primary);
  color: var(--text-primary);
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-family: inherit;
}

.region-btn:hover {
  background: linear-gradient(135deg, rgba(224, 30, 90, 0.4), rgba(255, 105, 180, 0.2));
  box-shadow: var(--magenta-glow);
  transform: translateY(-5px);
}

.region-icon {
  font-size: 2rem;
}

.region-name {
  font-weight: bold;
  font-size: 1rem;
}

.region-vms {
  font-size: 0.8rem;
  color: var(--text-muted);
}
```

### JavaScript - Real-Time Updates

```javascript
class VMDashboard {
  constructor() {
    this.updateInterval = 5000; // Update every 5 seconds
    this.init();
  }

  init() {
    this.startMetricsUpdates();
    this.setupRegionButtons();
  }

  async startMetricsUpdates() {
    setInterval(async () => {
      try {
        const metrics = await this.fetchVMMetrics();
        this.updateDisplay(metrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    }, this.updateInterval);
  }

  async fetchVMMetrics() {
    // Replace with actual API endpoint
    const response = await fetch('/api/vm/metrics');
    return await response.json();
  }

  updateDisplay(metrics) {
    document.getElementById('vm-count').textContent = metrics.vms_online;
    document.getElementById('vm-uptime').textContent = metrics.uptime + '%';
    document.getElementById('vm-cpu').textContent = metrics.cpu_usage + '%';
    document.getElementById('vm-memory').textContent = metrics.memory_usage + '%';

    // Update status indicator
    const indicator = document.querySelector('.status-indicator');
    if (metrics.system_healthy) {
      indicator.classList.add('active');
      indicator.classList.remove('inactive');
    } else {
      indicator.classList.remove('active');
      indicator.classList.add('inactive');
    }
  }

  setupRegionButtons() {
    document.querySelectorAll('.region-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const region = e.currentTarget.dataset.region;
        this.navigateToRegion(region);
      });
    });
  }

  navigateToRegion(region) {
    // Navigate to region dashboard
    window.location.href = `/dashboard/${region}`;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new VMDashboard();
});
```

---

## 🤝 SECTION 2: GLOBALMARKETS INTEGRATION

### Purpose
Display active partnerships, deal pipeline, revenue metrics, and regional performance with real-time data from GlobalMarkets.pplx.app.

### HTML Structure

```html
<section id="globalmarkets" class="section-markets">
  <div class="section-header">
    <h2>Partnership Ecosystem</h2>
    <p>Real-time opportunities across Africa</p>
  </div>

  <div class="markets-grid">
    <!-- Live Partnerships -->
    <div class="markets-card partnerships-card">
      <div class="card-header">
        <h3>Active Partnerships</h3>
        <span class="card-count">47</span>
      </div>
      <div class="partnerships-list">
        <div class="partnership-item">
          <span class="partnership-name">Russian Export Co. ↔ Nigerian Tech Hub</span>
          <span class="partnership-status active">Active</span>
          <span class="partnership-value">$85K</span>
        </div>
        <div class="partnership-item">
          <span class="partnership-name">Rwanda Startup ↔ SA Gaming Network</span>
          <span class="partnership-status active">Active</span>
          <span class="partnership-value">$42K</span>
        </div>
        <div class="partnership-item">
          <span class="partnership-name">Coffee Exporters ↔ Global Traders</span>
          <span class="partnership-status pending">Pending</span>
          <span class="partnership-value">$156K</span>
        </div>
        <div class="partnership-item">
          <span class="partnership-name">Gaming Tournament ↔ Esports Org</span>
          <span class="partnership-status active">Active</span>
          <span class="partnership-value">$28K</span>
        </div>
      </div>
    </div>

    <!-- Deal Pipeline -->
    <div class="markets-card pipeline-card">
      <div class="card-header">
        <h3>Deal Pipeline</h3>
        <span class="card-count">23</span>
      </div>
      <div class="pipeline-stages">
        <div class="pipeline-stage">
          <span class="stage-name">Qualified</span>
          <span class="stage-value">8</span>
          <div class="stage-bar">
            <div class="stage-fill" style="width: 35%"></div>
          </div>
        </div>
        <div class="pipeline-stage">
          <span class="stage-name">In Progress</span>
          <span class="stage-value">10</span>
          <div class="stage-bar">
            <div class="stage-fill" style="width: 43%"></div>
          </div>
        </div>
        <div class="pipeline-stage">
          <span class="stage-name">Closing</span>
          <span class="stage-value">5</span>
          <div class="stage-bar">
            <div class="stage-fill" style="width: 22%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue Metrics -->
    <div class="markets-card revenue-card">
      <div class="card-header">
        <h3>Revenue This Year</h3>
        <span class="card-badge">YTD</span>
      </div>
      <div class="revenue-display">
        <div class="revenue-main">$487,340</div>
        <div class="revenue-projection">Projected: $1.2M</div>
        <div class="revenue-breakdown">
          <div class="breakdown-item">
            <span class="breakdown-label">Partnerships</span>
            <span class="breakdown-value">$245K</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Platform Fees</span>
            <span class="breakdown-value">$156K</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Services</span>
            <span class="breakdown-value">$86.3K</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Regional Performance -->
    <div class="markets-card regional-card">
      <div class="card-header">
        <h3>Regional Performance</h3>
      </div>
      <div class="regional-stats">
        <div class="region-stat">
          <span class="region-flag">🇷🇼</span>
          <span class="region-label">Rwanda</span>
          <span class="region-value">$120K</span>
          <span class="region-vms">50 VMs</span>
        </div>
        <div class="region-stat">
          <span class="region-flag">🇳🇬</span>
          <span class="region-label">Nigeria</span>
          <span class="region-value">$185K</span>
          <span class="region-vms">85+ VMs</span>
        </div>
        <div class="region-stat">
          <span class="region-flag">🇿🇦</span>
          <span class="region-label">South Africa</span>
          <span class="region-value">$142K</span>
          <span class="region-vms">120+ VMs</span>
        </div>
        <div class="region-stat">
          <span class="region-flag">🌐</span>
          <span class="region-label">Global</span>
          <span class="region-value">$40.3K</span>
          <span class="region-vms">50+ VMs</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

### CSS Styling

```css
.section-markets {
  background: linear-gradient(180deg, var(--bg-dark-lighter) 0%, var(--bg-dark) 100%);
  padding: 80px 40px;
  position: relative;
  overflow: hidden;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 10;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, var(--magenta-primary), var(--gold-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.section-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.markets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

/* Market Cards */
.markets-card {
  background: linear-gradient(135deg, rgba(224, 30, 90, 0.08), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(224, 30, 90, 0.3);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.markets-card:hover {
  border-color: var(--magenta-primary);
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(224, 30, 90, 0.3);
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(224, 30, 90, 0.2);
  padding-bottom: 15px;
}

.card-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.card-count {
  background: var(--magenta-primary);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.card-badge {
  background: var(--gold-accent);
  color: var(--bg-dark);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Partnerships List */
.partnerships-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.partnership-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 15px;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border-left: 3px solid var(--magenta-primary);
  font-size: 0.9rem;
}

.partnership-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.partnership-status.active {
  background: rgba(81, 207, 102, 0.3);
  color: #51CF66;
}

.partnership-status.pending {
  background: rgba(255, 159, 64, 0.3);
  color: #FF9F40;
}

.partnership-value {
  color: var(--gold-accent);
  font-weight: bold;
}

/* Pipeline Stages */
.pipeline-stages {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pipeline-stage {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stage-name {
  min-width: 80px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.stage-value {
  min-width: 30px;
  text-align: right;
  font-weight: bold;
  color: var(--magenta-light);
}

.stage-bar {
  flex: 1;
  height: 8px;
  background: rgba(224, 30, 90, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.stage-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--magenta-primary), var(--magenta-light));
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Revenue Display */
.revenue-display {
  text-align: center;
}

.revenue-main {
  font-size: 2rem;
  font-weight: 800;
  color: var(--magenta-primary);
  margin-bottom: 10px;
}

.revenue-projection {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.revenue-breakdown {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(224, 30, 90, 0.2);
}

.breakdown-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.breakdown-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.breakdown-value {
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-primary);
}

/* Regional Stats */
.regional-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.region-stat {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  border: 1px solid rgba(224, 30, 90, 0.2);
  transition: all 0.3s ease;
}

.region-stat:hover {
  border-color: var(--magenta-primary);
  background: rgba(224, 30, 90, 0.1);
}

.region-flag {
  display: block;
  font-size: 2rem;
  margin-bottom: 8px;
}

.region-label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.region-value {
  display: block;
  font-size: 1.2rem;
  color: var(--gold-accent);
  font-weight: bold;
  margin-bottom: 4px;
}

.region-vms {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
}
```

---

## 🍽️ SECTION 3: KRONENDAL RESTAURANT SHOWCASE

### Purpose
Feature Kronendal Cape Town restaurant with photo gallery, Instagram integration, and booking capabilities. Demonstrates real-world application of the ecosystem.

### HTML Structure

```html
<section id="kronendal" class="section-restaurant">
  <div class="section-header">
    <h2>Kronendal Cape Town</h2>
    <p>Fine Dining Excellence on the slopes of Table Mountain</p>
  </div>

  <div class="restaurant-content">
    <!-- Main Feature -->
    <div class="restaurant-hero">
      <div class="hero-image-container">
        <img src="/images/kronendal-hero.jpg" alt="Kronendal Restaurant" class="hero-image">
        <div class="image-overlay">
          <div class="instagram-badge">
            <span>@kronendal1713</span>
            <span class="follower-count">12.4K followers</span>
          </div>
        </div>
      </div>
      
      <div class="restaurant-info">
        <h3>Dining with a View</h3>
        <p class="description">Nestled on the slopes of Table Mountain, Kronendal offers an exceptional culinary experience combining local ingredients with international expertise. Our chef's tasting menu celebrates African flavors while maintaining European sophistication.</p>
        
        <div class="restaurant-highlights">
          <div class="highlight">
            <span class="highlight-icon">⭐</span>
            <span class="highlight-text">Michelin-Recommended</span>
          </div>
          <div class="highlight">
            <span class="highlight-icon">🏆</span>
            <span class="highlight-text">Award-Winning Chef</span>
          </div>
          <div class="highlight">
            <span class="highlight-icon">📍</span>
            <span class="highlight-text">Constantia Nek, Cape Town</span>
          </div>
        </div>

        <div class="cta-buttons">
          <button class="btn btn-primary">Reserve a Table</button>
          <button class="btn btn-secondary">View Menu</button>
        </div>
      </div>
    </div>

    <!-- Photo Carousel -->
    <div class="photo-carousel">
      <h3>Restaurant Gallery</h3>
      <div class="carousel-container">
        <button class="carousel-control prev">❮</button>
        
        <div class="carousel-track">
          <div class="carousel-item" style="background-image: url('/images/kronendal-1.jpg')"></div>
          <div class="carousel-item" style="background-image: url('/images/kronendal-2.jpg')"></div>
          <div class="carousel-item" style="background-image: url('/images/kronendal-3.jpg')"></div>
          <div class="carousel-item" style="background-image: url('/images/kronendal-4.jpg')"></div>
          <div class="carousel-item" style="background-image: url('/images/kronendal-5.jpg')"></div>
        </div>
        
        <button class="carousel-control next">❯</button>
      </div>
      
      <div class="carousel-dots">
        <button class="dot active" data-slide="0"></button>
        <button class="dot" data-slide="1"></button>
        <button class="dot" data-slide="2"></button>
        <button class="dot" data-slide="3"></button>
        <button class="dot" data-slide="4"></button>
      </div>
    </div>

    <!-- Instagram Feed -->
    <div class="instagram-section">
      <h3>Latest from Instagram</h3>
      <div class="instagram-feed">
        <!-- Posts fetched from Instagram API -->
        <div class="instagram-post">
          <div class="post-image" style="background-image: url('/images/ig-post-1.jpg')"></div>
          <div class="post-info">
            <div class="post-stats">
              <span>❤️ 342 likes</span>
              <span>💬 28 comments</span>
            </div>
            <p class="post-caption">Sunset views with our signature seafood platter... #KronendallCT</p>
          </div>
        </div>
        
        <div class="instagram-post">
          <div class="post-image" style="background-image: url('/images/ig-post-2.jpg')"></div>
          <div class="post-info">
            <div class="post-stats">
              <span>❤️ 287 likes</span>
              <span>💬 31 comments</span>
            </div>
            <p class="post-caption">Our pastry chef at work... dessert service is about to blow your mind!</p>
          </div>
        </div>

        <div class="instagram-post">
          <div class="post-image" style="background-image: url('/images/ig-post-3.jpg')"></div>
          <div class="post-info">
            <div class="post-stats">
              <span>❤️ 415 likes</span>
              <span>💬 44 comments</span>
            </div>
            <p class="post-caption">Table Mountain backdrop, chef's tasting menu perfection 🍽️ #DiningExperience</p>
          </div>
        </div>
      </div>
      <a href="https://instagram.com/kronendal1713" class="view-all-link">View all posts on Instagram →</a>
    </div>
  </div>
</section>
```

### CSS Styling

```css
.section-restaurant {
  background: linear-gradient(180deg, var(--bg-dark) 0%, #1a0f15 100%);
  padding: 80px 40px;
  position: relative;
  overflow: hidden;
}

.restaurant-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

/* Hero Section */
.restaurant-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 80px;
  align-items: center;
}

.hero-image-container {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 
    0 15px 50px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(224, 30, 90, 0.3);
  border: 2px solid var(--magenta-primary);
}

.hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent, rgba(0, 0, 0, 0.5));
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.instagram-badge {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.8);
  padding: 12px 20px;
  border-radius: 8px;
  border-left: 3px solid var(--magenta-primary);
  backdrop-filter: blur(10px);
}

.instagram-badge span {
  color: var(--text-primary);
  font-size: 0.9rem;
}

.follower-count {
  color: var(--magenta-light) !important;
  font-size: 0.8rem !important;
  margin-top: 4px;
}

.restaurant-info h3 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--magenta-primary);
  margin-bottom: 15px;
}

.restaurant-info .description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 25px;
}

.restaurant-highlights {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.highlight {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(224, 30, 90, 0.1);
  border-radius: 8px;
  border-left: 2px solid var(--magenta-primary);
}

.highlight-icon {
  font-size: 1.5rem;
}

.highlight-text {
  font-size: 0.9rem;
  color: var(--text-primary);
}

.cta-buttons {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 12px 30px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--magenta-primary), var(--magenta-light));
  color: white;
  box-shadow: 0 10px 30px rgba(224, 30, 90, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(224, 30, 90, 0.5);
}

.btn-secondary {
  background: transparent;
  color: var(--magenta-primary);
  border: 2px solid var(--magenta-primary);
}

.btn-secondary:hover {
  background: var(--magenta-primary);
  color: white;
}

/* Photo Carousel */
.photo-carousel {
  margin-bottom: 60px;
}

.photo-carousel h3 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--magenta-primary);
  margin-bottom: 25px;
}

.carousel-container {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

.carousel-track {
  display: flex;
  overflow: hidden;
  border-radius: 15px;
  height: 300px;
  border: 2px solid var(--magenta-primary);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
}

.carousel-item {
  min-width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.carousel-control {
  background: var(--magenta-primary);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-control:hover {
  background: var(--magenta-light);
  transform: scale(1.1);
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--magenta-primary);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--magenta-primary);
}

/* Instagram Section */
.instagram-section h3 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--magenta-primary);
  margin-bottom: 25px;
}

.instagram-feed {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.instagram-post {
  background: linear-gradient(135deg, rgba(224, 30, 90, 0.08), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(224, 30, 90, 0.3);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.instagram-post:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(224, 30, 90, 0.3);
  border-color: var(--magenta-primary);
}

.post-image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
}

.post-info {
  padding: 15px;
}

.post-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.post-caption {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.view-all-link {
  display: inline-block;
  color: var(--magenta-primary);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.view-all-link:hover {
  color: var(--magenta-light);
  transform: translateX(5px);
}
```

---

## 🧠 SECTION 4: OBSIDIAN BRAIN (Intelligence Center)

### Purpose
Display real-time Ghost Business Agent outputs: daily competitor analysis, content strategy, video scripts, and performance analytics. This is the central intelligence hub powered by daily autonomous research.

### HTML Structure

```html
<section id="obsidian-brain" class="section-brain">
  <div class="section-header">
    <h2>Obsidian Brain</h2>
    <p>Autonomous Intelligence Center | Daily Research & Strategy</p>
  </div>

  <div class="brain-container">
    <!-- Brain Navigation -->
    <div class="brain-nav">
      <button class="nav-btn active" data-view="daily-report">Daily Report</button>
      <button class="nav-btn" data-view="competitors">Competitors</button>
      <button class="nav-btn" data-view="content-strategy">Content Strategy</button>
      <button class="nav-btn" data-view="video-scripts">Video Scripts</button>
      <button class="nav-btn" data-view="analytics">Analytics</button>
    </div>

    <!-- Daily Report View -->
    <div class="brain-view active" id="daily-report">
      <div class="view-header">
        <h3>Today's Intelligence Report</h3>
        <span class="timestamp">Generated: Today at 9:00 AM by Ghost Business Agent</span>
      </div>

      <div class="report-sections">
        <div class="report-card">
          <h4>🎯 Today's Focus</h4>
          <p>Based on competitor analysis and engagement trends, focus today on behind-the-scenes content and dessert presentations. Competitors averaging 340 likes/post on food prep content. Our last similar post: 312 likes.</p>
        </div>

        <div class="report-card">
          <h4>📊 Recommended Actions</h4>
          <ul>
            <li>Post morning Reel: Kitchen prep (30s, trending audio)</li>
            <li>Afternoon Stories: 3-post series of wine pairings</li>
            <li>Evening Post: Sunset plating carousel (5 images)</li>
            <li>Hashtag targets: #CapeTownDining #FineFood #TableMountainView</li>
          </ul>
        </div>

        <div class="report-card">
          <h4>⚡ Engagement Insights</h4>
          <div class="insights-grid">
            <div class="insight">
              <span class="metric-label">Peak Engagement Time</span>
              <span class="metric-value">7-9 PM</span>
            </div>
            <div class="insight">
              <span class="metric-label">Top Hashtag Category</span>
              <span class="metric-value">#LocalDining</span>
            </div>
            <div class="insight">
              <span class="metric-label">Avg Competitor Posts/Day</span>
              <span class="metric-value">2.3 posts</span>
            </div>
            <div class="insight">
              <span class="metric-label">Our Posts/Day (Target)</span>
              <span class="metric-value">3 posts</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Competitor Analysis View -->
    <div class="brain-view" id="competitors">
      <div class="view-header">
        <h3>Competitor Analysis</h3>
        <span class="timestamp">Cape Town Restaurants + Global Analysis</span>
      </div>

      <div class="competitors-grid">
        <div class="competitor-card">
          <div class="comp-header">
            <h4>The Pot Luck Club</h4>
            <span class="comp-followers">18.2K followers</span>
          </div>
          <div class="comp-stats">
            <div class="stat">
              <span class="label">Posts/Week</span>
              <span class="value">8</span>
            </div>
            <div class="stat">
              <span class="label">Avg Engagement</span>
              <span class="value">385 likes</span>
            </div>
            <div class="stat">
              <span class="label">Content Strategy</span>
              <span class="value">Plating + Team</span>
            </div>
          </div>
          <div class="comp-insights">
            <strong>Key Insight:</strong> High-quality plating shots perform 25% better than team photos. Using consistent filter/aesthetic.
          </div>
        </div>

        <div class="competitor-card">
          <div class="comp-header">
            <h4>Codfather Seafood</h4>
            <span class="comp-followers">14.7K followers</span>
          </div>
          <div class="comp-stats">
            <div class="stat">
              <span class="label">Posts/Week</span>
              <span class="value">6</span>
            </div>
            <div class="stat">
              <span class="label">Avg Engagement</span>
              <span class="value">298 likes</span>
            </div>
            <div class="stat">
              <span class="label">Content Strategy</span>
              <span class="value">Seafood Focus</span>
            </div>
          </div>
          <div class="comp-insights">
            <strong>Key Insight:</strong> Seafood close-ups (macro photography) average 418 likes. Strong Monday engagement (5 PM).
          </div>
        </div>

        <div class="competitor-card">
          <div class="comp-header">
            <h4>Maze by Gordon Ramsay (Global)</h4>
            <span class="comp-followers">847K followers</span>
          </div>
          <div class="comp-stats">
            <div class="stat">
              <span class="label">Posts/Week</span>
              <span class="label">14</span>
            </div>
            <div class="stat">
              <span class="label">Avg Engagement</span>
              <span class="value">4,200 likes</span>
            </div>
            <div class="stat">
              <span class="label">Content Strategy</span>
              <span class="value">Video + Reels</span>
            </div>
          </div>
          <div class="comp-insights">
            <strong>Key Insight:</strong> 60% Reels, 25% static posts, 15% Stories. Short-form video dominates. Music choices critical.
          </div>
        </div>
      </div>
    </div>

    <!-- Content Strategy View -->
    <div class="brain-view" id="content-strategy">
      <div class="view-header">
        <h3>Content Strategy</h3>
        <span class="timestamp">30-Day Content Calendar</span>
      </div>

      <div class="strategy-cards">
        <div class="strategy-card">
          <h4>📅 Posting Schedule</h4>
          <div class="schedule">
            <div class="schedule-item">
              <span class="day">Monday</span>
              <span class="time">7:00 PM</span>
              <span class="type">Reel</span>
            </div>
            <div class="schedule-item">
              <span class="day">Tuesday</span>
              <span class="time">1:00 PM</span>
              <span class="type">Carousel</span>
            </div>
            <div class="schedule-item">
              <span class="day">Wednesday</span>
              <span class="time">7:00 PM</span>
              <span class="type">Reel</span>
            </div>
            <div class="schedule-item">
              <span class="day">Thursday</span>
              <span class="time">12:00 PM</span>
              <span class="type">Stories (3x)</span>
            </div>
            <div class="schedule-item">
              <span class="day">Friday</span>
              <span class="time">7:00 PM</span>
              <span class="type">Reel</span>
            </div>
          </div>
        </div>

        <div class="strategy-card">
          <h4>🏷️ Hashtag Strategy</h4>
          <div class="hashtag-groups">
            <div class="hashtag-group">
              <span class="group-label">Reach (100K-1M)</span>
              <div class="hashtags">
                <span>#CapeTownDining</span>
                <span>#FineFood</span>
                <span>#RestaurantLife</span>
              </div>
            </div>
            <div class="hashtag-group">
              <span class="group-label">Engagement (10K-100K)</span>
              <div class="hashtags">
                <span>#TabletopPhotography</span>
                <span>#ChefLife</span>
                <span>#LocalEats</span>
              </div>
            </div>
            <div class="hashtag-group">
              <span class="group-label">Community (1K-10K)</span>
              <div class="hashtags">
                <span>#KronendallCT</span>
                <span>#ConstantiaWine</span>
                <span>#SouthAfricaEats</span>
              </div>
            </div>
          </div>
        </div>

        <div class="strategy-card">
          <h4>🎬 Content Themes (Weekly Rotation)</h4>
          <ul class="theme-list">
            <li><strong>Behind-the-Scenes (Mon):</strong> Kitchen prep, chef interviews, ingredient selection</li>
            <li><strong>Plating Artistry (Wed):</strong> Close-ups, artistic angles, color theory</li>
            <li><strong>Guest Experience (Fri):</strong> Diners enjoying meals, ambiance shots, testimonials</li>
            <li><strong>Stories & Events (Thu):</strong> Daily life, team moments, special events</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Video Scripts View -->
    <div class="brain-view" id="video-scripts">
      <div class="view-header">
        <h3>Video Scripts</h3>
        <span class="timestamp">30-Second Reels & Content Ideas</span>
      </div>

      <div class="scripts-container">
        <div class="script-card">
          <div class="script-header">
            <h4>Script #1: Morning Kitchen Prep</h4>
            <span class="difficulty">⭐⭐ Easy to Execute</span>
          </div>
          <div class="script-content">
            <div class="timing">Duration: 30 seconds</div>
            <div class="hook">
              <strong>Hook (0-3s):</strong> "Watch our head chef prep for tonight..." [Fast-motion montage of knife work, ingredients]
            </div>
            <div class="body">
              <strong>Body (3-24s):</strong> Close-ups of:
              - Dicing vegetables (rhythmic cuts to music beat)
              - Plating components being prepped
              - Sauce being prepared
              - Final arrangement on plates
            </div>
            <div class="outro">
              <strong>Outro (24-30s):</strong> Wide shot of plated dish, text overlay: "Kronendall Tonight" + CTA to book
            </div>
            <div class="music">
              <strong>Music:</strong> Trending audio: "Drill instrumental - 120 BPM" [Energetic, percussion-heavy]
            </div>
            <div class="hashtags">
              <strong>Hashtags:</strong> #BehindTheScenes #ChefLife #FineFood #KronendallCT
            </div>
          </div>
        </div>

        <div class="script-card">
          <div class="script-header">
            <h4>Script #2: Wine Pairing Carousel</h4>
            <span class="difficulty">⭐⭐⭐ Medium Difficulty</span>
          </div>
          <div class="script-content">
            <div class="timing">5-image carousel</div>
            <div class="images">
              <strong>Images:</strong>
              - Image 1: Wine glass against mountain backdrop
              - Image 2: Chef holding bottle (candid)
              - Image 3: Pour shot (slow-motion quality photo)
              - Image 4: Paired dish close-up
              - Image 5: Full table setting with wine
            </div>
            <div class="caption">
              <strong>Caption:</strong> "Every dish tells a story. Every wine completes it. Our sommelier's pairing recommendation for tonight... Link in bio to explore our wine collection. 🍷 #WinePairing #FineFood"
            </div>
            <div class="hashtags">
              <strong>Hashtags:</strong> #WineLover #SouthAfricanWine #FoodAndWine #CapeTown
            </div>
          </div>
        </div>

        <div class="script-card">
          <div class="script-header">
            <h4>Script #3: Dessert Time-Lapse</h4>
            <span class="difficulty">⭐⭐⭐⭐ Complex</span>
          </div>
          <div class="script-content">
            <div class="timing">Duration: 30 seconds</div>
            <div class="description">
              <strong>Concept:</strong> Time-lapse of plating the signature dessert
            </div>
            <div class="scenes">
              <strong>Key Shots:</strong>
              - Pastry chef hands working (macro)
              - Plate rotation (different angles)
              - Sauce drizzle (slow-motion)
              - Final garnish placement
              - Step back to reveal finished plate
            </div>
            <div class="music">
              <strong>Music:</strong> Trending audio with dramatic crescendo [Uptempo, elegant]
            </div>
            <div class="cta">
              <strong>CTA:</strong> "This is how we end every night. Perfectly. Book your experience today."
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics View -->
    <div class="brain-view" id="analytics">
      <div class="view-header">
        <h3>Performance Analytics</h3>
        <span class="timestamp">30-Day Performance Trends</span>
      </div>

      <div class="analytics-grid">
        <div class="analytics-card">
          <h4>📈 Engagement Trends</h4>
          <div class="metric-display">
            <div class="metric-item">
              <span class="label">Avg Likes/Post</span>
              <span class="value">287</span>
              <span class="trend up">↑ +12% vs last month</span>
            </div>
            <div class="metric-item">
              <span class="label">Comments/Post</span>
              <span class="value">24</span>
              <span class="trend up">↑ +8% vs last month</span>
            </div>
            <div class="metric-item">
              <span class="label">Shares/Post</span>
              <span class="value">6</span>
              <span class="trend down">↓ -3% vs last month</span>
            </div>
            <div class="metric-item">
              <span class="label">Saves/Post</span>
              <span class="value">18</span>
              <span class="trend up">↑ +22% vs last month</span>
            </div>
          </div>
        </div>

        <div class="analytics-card">
          <h4>👥 Audience Growth</h4>
          <div class="metric-display">
            <div class="metric-item">
              <span class="label">Current Followers</span>
              <span class="value">12,428</span>
              <span class="trend up">↑ +340 this month</span>
            </div>
            <div class="metric-item">
              <span class="label">Follower Growth Rate</span>
              <span class="value">2.8%</span>
              <span class="trend up">↑ vs industry avg 1.2%</span>
            </div>
            <div class="metric-item">
              <span class="label">Audience Retention</span>
              <span class="value">94.2%</span>
              <span class="trend stable">→ Stable</span>
            </div>
            <div class="metric-item">
              <span class="label">New Followers Source</span>
              <span class="value">Hashtags 52%</span>
              <span class="trend neutral">Explore: 38%, Direct: 10%</span>
            </div>
          </div>
        </div>

        <div class="analytics-card">
          <h4>🎯 Top Performing Content</h4>
          <div class="top-posts">
            <div class="top-post">
              <span class="rank">1st</span>
              <span class="content">Behind-the-Scenes Plating Reel</span>
              <span class="engagement">542 likes</span>
            </div>
            <div class="top-post">
              <span class="rank">2nd</span>
              <span class="content">Wine Pairing Carousel</span>
              <span class="engagement">418 likes</span>
            </div>
            <div class="top-post">
              <span class="rank">3rd</span>
              <span class="content">Chef Interview Story</span>
              <span class="engagement">3.2K views</span>
            </div>
            <div class="top-post">
              <span class="rank">4th</span>
              <span class="content">Dessert Time-Lapse</span>
              <span class="engagement">385 likes</span>
            </div>
          </div>
        </div>

        <div class="analytics-card">
          <h4>📅 Optimal Posting Times</h4>
          <div class="posting-times">
            <div class="time-slot best">
              <span class="day">Monday</span>
              <span class="time">7:00 PM</span>
              <span class="score">Best ⭐⭐⭐⭐⭐</span>
            </div>
            <div class="time-slot good">
              <span class="day">Wednesday</span>
              <span class="time">1:00 PM</span>
              <span class="score">Good ⭐⭐⭐⭐</span>
            </div>
            <div class="time-slot best">
              <span class="day">Friday</span>
              <span class="time">7:00 PM</span>
              <span class="score">Best ⭐⭐⭐⭐⭐</span>
            </div>
            <div class="time-slot okay">
              <span class="day">Sunday</span>
              <span class="time">6:00 PM</span>
              <span class="score">Okay ⭐⭐⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### CSS Styling

```css
.section-brain {
  background: linear-gradient(180deg, var(--bg-dark) 0%, #1a0f15 100%);
  padding: 80px 40px;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.brain-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

/* Brain Navigation */
.brain-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  border-bottom: 2px solid rgba(224, 30, 90, 0.2);
  padding-bottom: 0;
}

.nav-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-bottom: 3px solid transparent;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-btn:hover {
  color: var(--magenta-primary);
}

.nav-btn.active {
  color: var(--magenta-primary);
  border-bottom-color: var(--magenta-primary);
}

/* Brain Views */
.brain-view {
  display: none;
  animation: fadeIn 0.3s ease;
}

.brain-view.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.view-header {
  margin-bottom: 40px;
  border-bottom: 2px solid rgba(224, 30, 90, 0.3);
  padding-bottom: 20px;
}

.view-header h3 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--magenta-primary);
  margin-bottom: 10px;
}

.view-header .timestamp {
  color: var(--text-muted);
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

/* Report Sections */
.report-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.report-card {
  background: linear-gradient(135deg, rgba(224, 30, 90, 0.08), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(224, 30, 90, 0.3);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.report-card h4 {
  color: var(--magenta-primary);
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.report-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 15px;
}

.report-card ul {
  list-style: none;
  padding: 0;
}

.report-card li {
  color: var(--text-secondary);
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
  line-height: 1.6;
}

.report-card li:before {
  content: "→";
  position: absolute;
  left: 0;
  color: var(--magenta-primary);
  font-weight: bold;
}

/* Insights Grid */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 15px;
}

.insight {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 8px;
  border-left: 2px solid var(--magenta-primary);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--magenta-light);
}

/* Competitor Cards */
.competitors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.competitor-card {
  background: linear-gradient(135deg, rgba(224, 30, 90, 0.08), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(224, 30, 90, 0.3);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.competitor-card:hover {
  transform: translateY(-5px);
  border-color: var(--magenta-primary);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
}

.comp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(224, 30, 90, 0.2);
}

.comp-header h4 {
  color: var(--magenta-primary);
  margin: 0;
}

.comp-followers {
  background: rgba(224, 30, 90, 0.2);
  color: var(--magenta-light);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.comp-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 6px;
  text-align: center;
}

.stat .label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat .value {
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-primary);
}

.comp-insights {
  background: rgba(212, 175, 55, 0.1);
  border-left: 3px solid var(--gold-accent);
  padding: 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Strategy Cards */
.strategy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
}

.strategy-card {
  background: linear-gradient(135deg, rgba(224, 30, 90, 0.08), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(224, 30, 90, 0.3);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.strategy-card h4 {
  color: var(--magenta-primary);
  font-size: 1.1rem;
  margin-bottom: 20px;
}

/* Schedule */
.schedule {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: grid;
  grid-template-columns: 80px 80px 80px;
  gap: 15px;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border-left: 2px solid var(--magenta-primary);
}

.schedule-item .day {
  font-weight: bold;
  color: var(--magenta-light);
}

.schedule-item .time {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.schedule-item .type {
  background: var(--magenta-primary);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
}

/* Hashtags */
.hashtag-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hashtag-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: bold;
}

.hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hashtags span {
  background: rgba(224, 30, 90, 0.2);
  color: var(--magenta-light);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  border: 1px solid rgba(224, 30, 90, 0.3);
}

/* Themes */
.theme-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.theme-list li {
  color: var(--text-secondary);
  line-height: 1.6;
  padding-left: 0;
}

.theme-list strong {
  color: var(--magenta-light);
}

/* Video Scripts */
.scripts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
}

.script-card {
  background: linear-gradient(135deg, rgba(224, 30, 90, 0.08), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(224, 30, 90, 0.3);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.script-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(224, 30, 90, 0.2);
}

.script-header h4 {
  color: var(--magenta-primary);
  margin: 0;
  flex: 1;
}

.difficulty {
  background: rgba(212, 175, 55, 0.2);
  color: var(--gold-accent);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  margin-left: 15px;
}

.script-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.script-content > div {
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border-left: 2px solid var(--magenta-primary);
}

.script-content strong {
  color: var(--magenta-light);
  display: block;
  margin-bottom: 5px;
}

.timing {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Analytics */
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.analytics-card {
  background: linear-gradient(135deg, rgba(224, 30, 90, 0.08), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(224, 30, 90, 0.3);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.analytics-card h4 {
  color: var(--magenta-primary);
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.metric-display {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.metric-item {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 15px;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border-left: 2px solid var(--magenta-primary);
}

.metric-item .label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-item .value {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--magenta-light);
  text-align: right;
}

.metric-item .trend {
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.metric-item .trend.up {
  background: rgba(81, 207, 102, 0.2);
  color: #51CF66;
}

.metric-item .trend.down {
  background: rgba(255, 105, 105, 0.2);
  color: #FF6B6B;
}

.metric-item .trend.stable {
  background: rgba(212, 175, 55, 0.2);
  color: var(--gold-accent);
}

/* Top Posts */
.top-posts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top-post {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 15px;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border-left: 3px solid var(--magenta-primary);
}

.rank {
  background: var(--magenta-primary);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
}

.content {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.engagement {
  color: var(--magenta-light);
  font-weight: bold;
}

/* Posting Times */
.posting-times {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time-slot {
  display: grid;
  grid-template-columns: 100px 80px 1fr;
  gap: 15px;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid var(--magenta-primary);
}

.time-slot.best {
  background: rgba(81, 207, 102, 0.1);
}

.time-slot.good {
  background: rgba(212, 175, 55, 0.1);
}

.time-slot.okay {
  background: rgba(0, 0, 0, 0.2);
}

.time-slot .day {
  font-weight: bold;
  color: var(--text-primary);
}

.time-slot .time {
  color: var(--text-secondary);
}

.time-slot .score {
  text-align: right;
  font-size: 0.9rem;
  font-weight: 600;
}

.time-slot.best .score {
  color: #51CF66;
}

.time-slot.good .score {
  color: var(--gold-accent);
}

.time-slot.okay .score {
  color: var(--text-muted);
}
```

---

## 📱 Responsive Design

```css
/* Mobile Responsiveness */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .vm-container {
    flex-direction: column;
  }

  .vm-computer {
    max-width: 100%;
  }

  .restaurant-hero {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .competitors-grid,
  .scripts-container,
  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .carousel-container {
    grid-template-columns: 1fr;
  }

  .brain-nav {
    gap: 5px;
  }

  .nav-btn {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }

  .section-header h2 {
    font-size: 1.8rem;
  }

  .vm-quick-access {
    grid-template-columns: 1fr 1fr;
  }

  .restaurant-highlights {
    grid-template-columns: 1fr;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }

  .comp-stats {
    grid-template-columns: 1fr;
  }
}
```

---

## 🔄 JavaScript Integration - Brain Navigation

```javascript
class BrainController {
  constructor() {
    this.views = {
      'daily-report': '#daily-report',
      'competitors': '#competitors',
      'content-strategy': '#content-strategy',
      'video-scripts': '#video-scripts',
      'analytics': '#analytics'
    };
    this.init();
  }

  init() {
    this.setupNavigation();
    this.loadInitialView();
  }

  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchView(e.currentTarget.dataset.view);
      });
    });
  }

  switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.brain-view').forEach(view => {
      view.classList.remove('active');
    });

    // Show selected view
    const viewElement = document.querySelector(this.views[viewName]);
    if (viewElement) {
      viewElement.classList.add('active');
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    // Refresh data for view
    this.refreshViewData(viewName);
  }

  async refreshViewData(viewName) {
    try {
      const response = await fetch(`/api/brain/${viewName}`);
      const data = await response.json();
      this.updateViewContent(viewName, data);
    } catch (error) {
      console.error(`Error loading ${viewName}:`, error);
    }
  }

  updateViewContent(viewName, data) {
    // Update DOM with fresh data from Ghost Business Agent
    // This pulls from Obsidian brain via API
  }

  loadInitialView() {
    this.switchView('daily-report');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new BrainController();
});
```

---

## 📊 API Endpoints (Backend Integration)

```
GET /api/vm/metrics              → Real-time VM statistics
GET /api/globalmarkets/partnerships  → Active partnerships
GET /api/globalmarkets/pipeline   → Deal pipeline data
GET /api/globalmarkets/revenue    → Revenue metrics
GET /api/instagram/feed           → Kronendal Instagram posts
GET /api/brain/{view}             → Obsidian Brain data by view
POST /api/brain/refresh           → Force refresh Ghost data
GET /api/brain/latest-report      → Latest daily report
```

---

## 🚀 Deployment Checklist

- [ ] All CSS variables defined for magenta-africa-theme
- [ ] Floating VM animation works smoothly
- [ ] Real-time metrics updating every 5 seconds
- [ ] GlobalMarkets integration fetching live data
- [ ] Kronendal Instagram feed connected
- [ ] Obsidian Brain views loading dynamically
- [ ] Responsive design tested on mobile/tablet
- [ ] Performance optimized (< 3s first load)
- [ ] Accessibility standards met (WCAG 2.1)
- [ ] Analytics tracking installed
- [ ] SSL/HTTPS configured
- [ ] Monitoring alerts set up

---

**Status:** Ready for Implementation  
**Timeline:** August 1, 2026 (Rwanda Launch)  
**Ownership:** StudEx Tech Team + Natalia (Ghost Business Agent)

This design transforms your infrastructure into a living, breathing intelligence center.
