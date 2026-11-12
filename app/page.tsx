'use client';

import { useEffect, useRef, useState } from 'react';

type Section = 'Overview' | 'Agents' | 'Content' | 'Connections' | 'Memory';
type Integration = { id: string; name: string; state: string; detail: string };
type Snapshot = { checkedAt: string; integrations: Integration[]; mode: string };
const sections: Section[] = ['Overview', 'Agents', 'Content', 'Connections', 'Memory'];
const queueUrl = 'https://app.notion.com/p/e9a5ca9fbd6041c9920f4982bb64864d';
const draftKey = 'studbot-local-draft-v1';
const products = [
  { name: 'Meat', mark: '01', description: 'The land. The herd. The table.', category: 'Our foundation' },
  { name: 'Biltong', mark: '02', description: 'A tradition worth taking further.', category: 'Product story' },
  { name: 'Coffee', mark: '03', description: 'A daily ritual, thoughtfully made.', category: 'Product story' },
  { name: 'StudBot', mark: '04', description: 'Intelligence in service of your business.', category: 'Guided pilot' },
  { name: 'Robo Noir', mark: '05', description: 'The next chapter in human-led robotics.', category: 'Concept' },
];

function Icon({ name }: { name: Section | 'arrow' | 'voice' }) {
  const paths: Record<string, React.ReactNode> = {
    Overview: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    Agents: <><circle cx="12" cy="9" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M12 1v3M3 9h3M18 9h3"/></>,
    Content: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    Connections: <><path d="M9 15l6-6M7 12l-2 2a4 4 0 0 0 5 6l3-3M17 12l2-2a4 4 0 0 0-5-6l-3 3"/></>,
    Memory: <><path d="M4 4h7l1 2 1-2h7v15h-7l-1 2-1-2H4zM12 6v15"/></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
    voice: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M8 22h8"/></>,
  };
  return <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Home() {
  const [section, setSection] = useState<Section>('Overview');
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [connectionError, setConnectionError] = useState('');
  const [checking, setChecking] = useState(false);
  const [clock, setClock] = useState('SAST');
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
    const tick = () => setClock(new Intl.DateTimeFormat('en-ZA', { timeZone: 'Africa/Johannesburg', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()) + ' SAST');
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => { window.clearInterval(timer); request.current?.abort(); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);

  async function checkConnections() {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setChecking(true);
    setConnectionError('');
    const timeout = window.setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch('/api/integrations', { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Status request unavailable.');
      const data: unknown = await response.json();
      const candidate = data as Snapshot;
      if (!candidate || !Array.isArray(candidate.integrations) || typeof candidate.checkedAt !== 'string' || !candidate.integrations.every(item => item && ['id','name','state','detail'].every(key => typeof item[key as keyof Integration] === 'string'))) throw new Error('Status response could not be verified.');
      setSnapshot(candidate);
    } catch {
      if (request.current === controller) { setSnapshot(null); setConnectionError('Connection status is unavailable. No service has been marked online.'); }
    } finally {
      window.clearTimeout(timeout);
      if (request.current === controller) setChecking(false);
    }
  }

  function saveDraft() {
    try { localStorage.setItem(draftKey, draft); setNotice('Draft saved in this browser only. Nothing was sent to an agent.'); }
    catch { setNotice('This browser could not save the draft. Copy it before leaving.'); }
  }
  function loadDraft() {
    try { const saved = localStorage.getItem(draftKey); if (saved === null) setNotice('No saved draft in this browser.'); else { setDraft(saved); setNotice('Saved draft loaded from this browser.'); } }
    catch { setNotice('Saved draft could not be read.'); }
  }
  function readDraft() {
    if (!speechSupported || !draft.trim()) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(draft);
    utterance.lang = 'en-ZA';
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => { setSpeaking(false); setNotice('Read-aloud stopped or is unavailable in this browser.'); };
    window.speechSynthesis.cancel();
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }
  function openContent() { setSection('Content'); setNotice('Start with one clear brief. Saving stays in this browser.'); }

  const composer = <section className="panel composer" aria-labelledby="composer-title">
    <div className="panel-heading"><div><p className="eyebrow">YOUR NEXT MOVE</p><h2 id="composer-title">Give the work a direction.</h2></div><span className="label quiet-label">LOCAL DRAFT</span></div>
    <label className="sr-only" htmlFor="brief">Your content brief</label>
    <textarea id="brief" value={draft} onChange={event => { setDraft(event.target.value); setNotice(''); }} placeholder="What would you like to create? Include the audience, outcome and sources…" rows={4} maxLength={12000}/>
    <div className="composer-actions"><div className="tool-actions"><button type="button" className="icon-text" disabled title="Phone and microphone pairing are not configured"><Icon name="voice"/> Voice pairing pending</button><button type="button" className="text-button" disabled={!speechSupported || !draft.trim()} onClick={readDraft}>{speaking ? 'Stop reading' : speechSupported ? 'Read aloud' : 'Read-aloud unavailable'}</button></div><button type="button" className="button gold-button" onClick={saveDraft} disabled={!draft.trim()}>Save draft <Icon name="arrow"/></button></div>
    <div className="composer-foot"><span>Drafting surface · Hermes is not connected</span><button type="button" className="text-button" onClick={loadDraft}>Load saved draft</button></div>
    {notice && <p className="feedback" role="status">{notice}</p>}
  </section>;

  const connections = <section className="panel connections-panel" aria-labelledby="connection-title"><div className="panel-heading"><div><p className="eyebrow">THE CONNECTION LAYER</p><h2 id="connection-title">Evidence before status.</h2></div><button type="button" className="button outline-button" onClick={checkConnections} disabled={checking}>{checking ? 'Checking…' : 'Check readiness'}</button></div><p className="section-copy">Readiness describes this application’s adapters. It does not certify a remote agent, store or VM is running.</p>{connectionError && <p role="status" className="feedback">{connectionError}</p>}{snapshot ? <><div className="integration-list">{snapshot.integrations.map(item => <article key={item.id} className="integration-row"><div className="integration-monogram">{item.name.slice(0,1)}</div><div><h3>{item.name}</h3><p>{item.detail}</p></div><span className="label quiet-label">{item.state.replaceAll('_', ' ')}</span></article>)}</div><p className="fine-print">Checked: {Number.isNaN(Date.parse(snapshot.checkedAt)) ? 'Timestamp unavailable' : new Intl.DateTimeFormat('en-ZA', {timeZone:'Africa/Johannesburg',dateStyle:'medium',timeStyle:'short'}).format(new Date(snapshot.checkedAt)) + ' SAST'}</p></> : <div className="connection-empty"><span className="status-ring"/><div><h3>No live connections verified</h3><p>Check readiness to inspect the local adapter registry.</p></div></div>}</section>;

  return <div className="command-shell">
    <a className="skip-link" href="#workspace">Skip to workspace</a>
    <aside className="sidebar"><a className="brand" href="/" aria-label="StudEx Factory home"><span className="brand-symbol">S<span>✦</span></span><span>STUDEX<span className="brand-sub">THE FACTORY</span></span></a><div className="workspace-label"><span className="workspace-square">SG</span><div>StudEx Group<small>Founder workspace</small></div><span className="workspace-chevron">⌄</span></div><p className="nav-label">WORKSPACE</p><nav aria-label="Workspace">{sections.map((item,index) => <button type="button" key={item} className={`nav-item ${section === item ? 'active' : ''}`} onClick={() => setSection(item)} aria-current={section === item ? 'page' : undefined}><Icon name={item}/><span>{item}</span><small>0{index+1}</small></button>)}</nav><div className="sidebar-note"><span className="tiny-star">✧</span><p>Human intelligence.<br/>Artificial execution.</p><span>One considered next step.</span></div><a className="queue-link" href={queueUrl} target="_blank" rel="noreferrer">Canonical build queue <span>↗</span></a><div className="profile"><div className="avatar">T</div><div>Tumelo<small>Founder · preview identity</small></div></div></aside>
    <div className="workspace-main"><header className="topbar"><div className="breadcrumb">Factory <span>/</span> <strong>{section}</strong></div><div className="topbar-right"><span className="preview-badge"><i/> Local preview</span><time>{clock}</time></div></header><main id="workspace" tabIndex={-1}>
      {section === 'Overview' ? <>
        <section className="hero"><div className="hero-copy"><p className="eyebrow">STUDEX GROUP / A NEW CHAPTER</p><h1>From the herd<br/>to the <em>horizon.</em></h1><p className="hero-description">Rooted in the land. Built for what comes next.<br/>A shared home for our businesses, our ideas and the intelligence that helps them grow.</p><button type="button" className="button ivory-button" onClick={openContent}>Begin with a brief <Icon name="arrow"/></button></div><div className="orbital-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><span className="orbit-dot dot-one"/><span className="orbit-dot dot-two"/><span className="orbit-dot dot-three"/><div className="orbital-core"><span>S</span><small>STUDEX</small></div><span className="orbital-caption">PEOPLE · PURPOSE · POSSIBILITY</span></div><div className="hero-index">01 — THE FOUNDER’S STATION</div></section>
        <div className="readiness-strip"><div><span className="small-dot"/><strong>Build with intention</strong><span>One workflow at a time</span></div><div><span className="small-dot hollow"/><strong>Connections unverified</strong><span>Readiness checks available</span></div><div><span className="small-dot gold"/><strong>Founder-led approvals</strong><span>No automatic execution</span></div></div>
        <div className="section-heading"><div><p className="eyebrow">ONE FAMILY. MANY CHAPTERS.</p><h2>The StudEx world</h2></div><span className="muted">Brand roadmap · availability not verified</span></div><section className="product-grid" aria-label="StudEx brand roadmap">{products.map(product => <article className={`product-card product-${product.mark}`} key={product.name}><div className="product-top"><span>{product.mark}</span><span>↗</span></div><div className="product-glyph" aria-hidden="true">{product.name === 'Meat' ? '◒' : product.name === 'Biltong' ? '≋' : product.name === 'Coffee' ? '◔' : product.name === 'StudBot' ? '✳' : '✧'}</div><div><p className="eyebrow">{product.category}</p><h3>{product.name}</h3><p>{product.description}</p></div></article>)}</section>
        <div className="workspace-columns">{composer}<aside className="panel next-panel"><p className="eyebrow">THE NEXT MILESTONE</p><h2>A brief.<br/>A draft.<br/><em>Your decision.</em></h2><p>Connect one verified agent to one scoped source, then review the result before it leaves the workspace.</p><button type="button" className="text-button arrow-link" onClick={() => setSection('Connections')}>Review connections <Icon name="arrow"/></button><span className="fine-print">Implementation plan · not an active job</span></aside></div>
      </> : section === 'Content' ? <><SectionTitle eyebrow="THE CONTENT DESK" title="Make something worth sharing." description="Start with a clear brief. Keep the story, evidence and final decision together."/>{composer}<div className="panel guidance-panel"><h2>A useful brief includes</h2><div className="guidance-grid"><div><span>01</span><h3>The audience</h3><p>Who is this for, and what do they need to understand?</p></div><div><span>02</span><h3>The evidence</h3><p>Link approved facts and assets. Mark anything still unverified.</p></div><div><span>03</span><h3>The outcome</h3><p>Name the format, destination and person who will review it.</p></div></div></div></> : section === 'Connections' ? <><SectionTitle eyebrow="TOOLS, WITH BOUNDARIES" title="Connect with confidence." description="A shared interface for commerce, creative tools and agent work. Every connection needs its own evidence."/>{connections}</> : section === 'Agents' ? <><SectionTitle eyebrow="THE AGENT STATION" title="A capable team.<br />A clear mandate." description="These are proposed roles, not live worker telemetry. Pair and verify each runtime before assigning work."/><div className="agent-grid">{[{name:'Hermes',role:'Research & content',initial:'H',copy:'Turns a bounded brief into sourced work for review.'},{name:'OpenClaw',role:'Operations & tools',initial:'O',copy:'Carries out explicitly approved operational tasks.'},{name:'Codex',role:'Engineering & verification',initial:'C',copy:'Builds reviewable changes and records acceptance evidence.'}].map(agent => <article className="panel agent-card" key={agent.name}><div className="agent-orb">{agent.initial}</div><span className="label quiet-label">Runtime unverified</span><h2>{agent.name}</h2><p className="eyebrow">{agent.role}</p><p>{agent.copy}</p><button className="button outline-button" onClick={() => setSection('Connections')}>View connection requirements</button></article>)}</div><div className="panel guidance-panel"><h2>Human direction stays at the centre.</h2><p className="section-copy">A role card does not grant access. Phone pairing, cloud workers, tool permissions and spending limits must be verified separately. There are no deploy or remote-control actions in this preview.</p></div></> : <><SectionTitle eyebrow="THE BUSINESS BRAIN" title="Knowledge with a source." description="Keep the story close, the evidence traceable and every client’s knowledge separate."/><div className="memory-grid"><article className="panel memory-card"><span className="memory-icon">01 / SOUL</span><h2>Our shared story</h2><p>StudEx brings its food businesses, agent services and robotics ambitions into one family. The founder’s judgment remains central as the business grows.</p><p className="fine-print">Draft brand narrative for review. Historical and product claims need approved sources.</p></article><article className="panel memory-card"><span className="memory-icon">02 / SOURCE</span><h2>Canonical coordination</h2><p>Use the existing Notion build queue for ownership and work status. Local notes and a polished dashboard are not acceptance evidence.</p><a className="text-button arrow-link" href={queueUrl} target="_blank" rel="noreferrer">Open build queue ↗</a></article><article className="panel memory-card"><span className="memory-icon">03 / SCOPE</span><h2>Scoped business memory</h2><p>Obsidian, Drive and agent memory are planned connections. No private documents have been ingested into this preview.</p><button className="text-button arrow-link" onClick={() => setSection('Connections')}>Review readiness <Icon name="arrow"/></button></article></div></>}
      <footer className="workspace-footer"><span>STUDEX GROUP <span className="footer-star">✦</span> BUILT WITH PURPOSE</span><span>Local prototype · no live agent execution</span></footer>
    </main></div>
  </div>;
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title.split('<br />').map((line,index) => <span key={line}>{index > 0 && <br/>}{line}</span>)}</h1><p>{description}</p></div>;
}
