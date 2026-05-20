'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

type Citation = { id: string; source?: string; score: number };
type Message = {
  role: 'user' | 'assistant';
  content: string;
  source?: 'cloud' | 'fallback';
  citations?: Citation[];
};

type CallState = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error';

const QUICK_PROMPTS = [
  'Recommend a Wagyu cut for two',
  "I'm hosting a braai for 8 on Saturday",
  'Corporate gift for 12 clients',
  "What's your premium tier?",
];

const SILENCE_RMS_THRESHOLD = 0.012;
const SILENCE_HOLD_MS = 1200;
const MIN_SPEECH_MS = 500;

export default function SalesAgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Welcome to StudEx. I'm ADA — your sales concierge. Tell me the occasion, headcount, and budget and I'll lock in the right cut.",
      source: 'fallback',
    },
  ]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);

  const [callState, setCallState] = useState<CallState>('idle');
  const [callError, setCallError] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const callActiveRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recorderChunksRef = useRef<Blob[]>([]);
  const speechStartedAtRef = useRef<number | null>(null);
  const silenceStartedAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const conversationRef = useRef<Message[]>(messages);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    conversationRef.current = messages;
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pending, liveTranscript]);

  const stopCall = useCallback(() => {
    callActiveRef.current = false;
    setCallState('idle');
    setLiveTranscript('');
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      try { recorderRef.current.stop(); } catch {}
    }
    recorderRef.current = null;
    if (mediaStreamRef.current) {
      for (const t of mediaStreamRef.current.getTracks()) t.stop();
    }
    mediaStreamRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
    }
    audioCtxRef.current = null;
    analyserRef.current = null;
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current = null;
    }
  }, []);

  useEffect(() => () => stopCall(), [stopCall]);

  async function sendText(text: string, channel: 'web' | 'voice' = 'web'): Promise<Message | null> {
    const userMsg: Message = { role: 'user', content: text };
    const next = [...conversationRef.current, userMsg];
    setMessages(next);
    setPending(true);
    try {
      const res = await fetch('/api/sales/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      const reply: Message = {
        role: 'assistant',
        content: data?.content ?? 'Connection to the butcher dropped. Try again.',
        source: data?.source,
        citations: data?.citations,
      };
      setMessages(prev => [...prev, reply]);
      return reply;
    } catch {
      const reply: Message = {
        role: 'assistant',
        content: 'Network error. Please retry.',
        source: 'fallback',
      };
      setMessages(prev => [...prev, reply]);
      return reply;
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || pending) return;
    setInput('');
    sendText(trimmed, 'web');
  }

  async function speakReply(text: string): Promise<void> {
    try {
      const res = await fetch('/api/sales/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      playbackAudioRef.current = audio;
      await new Promise<void>(resolve => {
        audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        audio.play().catch(() => resolve());
      });
    } catch {
      // swallow — call loop continues even if TTS fails
    }
  }

  async function transcribeTurn(blob: Blob): Promise<string> {
    const form = new FormData();
    form.append('audio', blob, 'turn.webm');
    const res = await fetch('/api/sales/voice/stt', { method: 'POST', body: form });
    if (!res.ok) return '';
    const data = await res.json();
    return (data?.text ?? '').trim();
  }

  function startListenLoop() {
    if (!callActiveRef.current || !mediaStreamRef.current || !audioCtxRef.current) return;

    const recorder = new MediaRecorder(mediaStreamRef.current);
    recorderRef.current = recorder;
    recorderChunksRef.current = [];
    speechStartedAtRef.current = null;
    silenceStartedAtRef.current = null;
    setCallState('listening');
    setLiveTranscript('');

    recorder.ondataavailable = e => {
      if (e.data.size > 0) recorderChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      if (!callActiveRef.current) return;
      const startedAt = speechStartedAtRef.current;
      const blob = new Blob(recorderChunksRef.current, { type: 'audio/webm' });
      const spokeLongEnough = startedAt !== null && Date.now() - startedAt > MIN_SPEECH_MS;
      if (!spokeLongEnough || blob.size < 4000) {
        if (callActiveRef.current) startListenLoop();
        return;
      }
      setCallState('thinking');
      const transcript = await transcribeTurn(blob);
      if (!transcript) {
        if (callActiveRef.current) startListenLoop();
        return;
      }
      setLiveTranscript(transcript);
      const reply = await sendText(transcript, 'voice');
      setLiveTranscript('');
      if (!callActiveRef.current) return;
      if (reply) {
        setCallState('speaking');
        await speakReply(reply.content);
      }
      if (callActiveRef.current) startListenLoop();
    };

    recorder.start(250);

    const analyser = analyserRef.current!;
    const buf = new Float32Array(analyser.fftSize);
    const tick = () => {
      if (!callActiveRef.current || recorder.state !== 'recording') return;
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
      const rms = Math.sqrt(sum / buf.length);
      const now = Date.now();
      if (rms > SILENCE_RMS_THRESHOLD) {
        if (speechStartedAtRef.current === null) speechStartedAtRef.current = now;
        silenceStartedAtRef.current = null;
      } else if (speechStartedAtRef.current !== null) {
        if (silenceStartedAtRef.current === null) silenceStartedAtRef.current = now;
        else if (now - silenceStartedAtRef.current > SILENCE_HOLD_MS) {
          try { recorder.stop(); } catch {}
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  async function startCall() {
    setCallError(null);
    setCallState('connecting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      src.connect(analyser);
      analyserRef.current = analyser;
      callActiveRef.current = true;

      const opener = "ADA here. How can I help you find the perfect cut today?";
      setCallState('speaking');
      await speakReply(opener);
      if (!callActiveRef.current) return;
      startListenLoop();
    } catch (err: any) {
      setCallError(err?.message || 'Mic permission denied');
      setCallState('error');
      stopCall();
    }
  }

  const liveBadge = (() => {
    switch (callState) {
      case 'idle': return { text: 'CHANNEL: WEB', color: 'bg-[#1a1a1a] text-[#ffff00]' };
      case 'connecting': return { text: 'CONNECTING…', color: 'bg-[#ff6b00] text-white animate-pulse' };
      case 'listening': return { text: '🎙 LISTENING', color: 'bg-[#556b2f] text-white' };
      case 'thinking': return { text: 'ADA THINKING…', color: 'bg-[#1a1a1a] text-[#ff6b00] animate-pulse' };
      case 'speaking': return { text: '🔊 ADA SPEAKING', color: 'bg-[#ff6b00] text-white' };
      case 'error': return { text: 'CALL ERROR', color: 'bg-red-700 text-white' };
    }
  })();

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#1a1a1a] p-8 font-mono">
      <header className="mb-10 border-b-2 border-[#ff6b00] pb-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#ff6b00]">
            <span className="text-[#ffff00] font-black text-xl italic">SX</span>
          </div>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              ADA <span className="text-[#ff6b00]">SALES CONCIERGE</span>
            </h1>
            <p className="text-[10px] text-orange-600 font-bold tracking-widest uppercase mt-1">
              Voice + RAG · pattern from ada_v2 + dograh
            </p>
          </div>
        </div>
        <div className={`inline-block px-3 py-1 text-[10px] font-bold ${liveBadge.color}`}>
          {liveBadge.text}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-8">
          <div className="bg-white border-4 border-[#1a1a1a] shadow-[10px_10px_0px_#ff6b00] flex flex-col h-[72vh]">
            <div className="px-6 py-4 border-b-2 border-[#1a1a1a] flex justify-between items-center">
              <h2 className="text-xs font-black uppercase tracking-widest">Live Conversation</h2>
              <div className="flex gap-2">
                {callState === 'idle' || callState === 'error' ? (
                  <button
                    onClick={startCall}
                    className="px-4 py-1 bg-[#556b2f] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#1a1a1a]"
                  >
                    📞 Start Live Call
                  </button>
                ) : (
                  <button
                    onClick={stopCall}
                    className="px-4 py-1 bg-red-700 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#1a1a1a]"
                  >
                    ⏹ End Call
                  </button>
                )}
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-4 text-sm leading-relaxed border-2 ${
                      m.role === 'user'
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                        : 'bg-[#fffaf3] text-[#1a1a1a] border-[#ff6b00]/40'
                    }`}
                  >
                    <div className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-70">
                      {m.role === 'user' ? 'CUSTOMER' : `ADA · ${m.source ?? 'cloud'}`}
                      {m.citations && m.citations.length > 0 && (
                        <span className="ml-2 text-[#556b2f]">
                          · {m.citations.length} context chunk{m.citations.length === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    {m.role === 'assistant' && (
                      <button
                        onClick={() => speakReply(m.content)}
                        className="mt-3 text-[9px] font-bold tracking-widest uppercase text-[#ff6b00] hover:text-[#1a1a1a]"
                      >
                        🔊 Play
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {liveTranscript && (
                <div className="flex justify-end opacity-60">
                  <div className="max-w-[80%] p-3 text-sm border-2 border-dashed border-[#556b2f] bg-[#fafff0]">
                    <div className="text-[9px] font-black uppercase tracking-widest mb-1 text-[#556b2f]">
                      Transcribing…
                    </div>
                    {liveTranscript}
                  </div>
                </div>
              )}
              {pending && !liveTranscript && (
                <div className="flex justify-start">
                  <div className="bg-[#fffaf3] border-2 border-[#ff6b00]/40 p-4 text-xs uppercase tracking-widest text-[#ff6b00] animate-pulse">
                    ADA composing…
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t-2 border-[#1a1a1a] p-4 flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type or start a live call…"
                className="flex-1 px-4 py-3 border-2 border-gray-200 focus:border-[#ff6b00] outline-none text-sm font-mono"
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="px-6 py-3 bg-[#ff6b00] text-white text-xs font-black uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#1a1a1a] text-white p-6">
            <h2 className="text-xs font-black mb-4 tracking-widest text-[#ff6b00] uppercase">
              Quick Openers
            </h2>
            <div className="space-y-2">
              {QUICK_PROMPTS.map(q => (
                <button
                  key={q}
                  onClick={() => !pending && sendText(q, 'web')}
                  disabled={pending}
                  className="block w-full text-left text-xs py-2 px-3 border border-white/20 hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border-2 border-[#1a1a1a] p-6">
            <h2 className="text-xs font-black mb-3 uppercase tracking-widest border-l-4 border-[#ff6b00] pl-3">
              Pipeline
            </h2>
            <ul className="text-[11px] space-y-2 text-gray-700">
              <li><span className="text-gray-400">STT</span> · OpenAI Whisper (STT_API_KEY)</li>
              <li><span className="text-gray-400">RAG</span> · Pinecone (PINECONE_INDEX_HOST)</li>
              <li><span className="text-gray-400">LLM</span> · OpenRouter (SALES_AGENT_MODEL)</li>
              <li><span className="text-gray-400">TTS</span> · ElevenLabs (ELEVENLABS_VOICE_ID)</li>
              <li><span className="text-gray-400">FALLBACK</span> · Deterministic catalog</li>
            </ul>
          </div>

          {callError && (
            <div className="bg-red-50 border-2 border-red-700 p-4 text-[11px] text-red-800">
              {callError}
            </div>
          )}

          <div className="bg-[#fffaf3] border-2 border-[#ff6b00]/40 p-6">
            <h2 className="text-xs font-black mb-3 uppercase tracking-widest text-[#ff6b00]">
              Voice Cloning
            </h2>
            <p className="text-[11px] leading-relaxed text-gray-700">
              Drop 1–25 audio samples (30s–3min each) into <code>voice_samples/</code>, then POST{' '}
              <code>/api/sales/voice/clone</code> to mint ADA's voice on ElevenLabs. Paste the returned{' '}
              <code>voice_id</code> into <code>ELEVENLABS_VOICE_ID</code>.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
