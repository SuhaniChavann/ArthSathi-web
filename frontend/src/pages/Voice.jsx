import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, RotateCcw, Check, ArrowRight, Keyboard } from 'lucide-react';
import { VOICE_SCRIPTS, inr } from '../data/mock';
import { PageWrap, Reveal, EASE } from '../components/motion';
import { PageHeader, TrustNote, Waveform } from '../components/widgets';
import { useApp } from '../context/AppContext';

const EXTRACTED = [
  { k: 'Purpose', v: 'Business expansion — tailoring boutique' },
  { k: 'Project cost', v: inr(400000) },
  { k: 'Loan needed', v: inr(250000) },
  { k: 'Monthly income', v: inr(25000) },
  { k: 'Education loan', v: 'Not applicable' },
];

export default function Voice() {
  const [lang, setLang] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | listening | transcript | extracted
  const timer = useRef(null);
  const navigate = useNavigate();
  const { setRequirement } = useApp();

  useEffect(() => () => clearTimeout(timer.current), []);

  const startListening = () => {
    setPhase('listening');
    timer.current = setTimeout(() => setPhase('transcript'), 3200);
  };
  const confirm = () => {
    setRequirement({ purpose: 'Expand my boutique — buy industrial sewing machines', projectCost: 400000, loanAmount: 250000 });
    navigate('/schemes');
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Speak — we will type"
        title="Tell us what you need, in your own words."
        desc="English, हिन्दी or मराठी. Describe your requirement naturally — we pick out the numbers and take you straight to matching schemes."
        step="requirement"
      />

      <section className="container-x mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="card-premium grain relative overflow-hidden p-8 sm:p-12" data-testid="voice-panel">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-clay/10 blur-3xl" />

          <AnimatePresence mode="wait">
            {!lang && (
              <motion.div key="lang" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }}>
                <p className="eyebrow mb-6">Choose your language</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {Object.entries(VOICE_SCRIPTS).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => setLang(k)}
                      data-testid={`voice-lang-${k}`}
                      className="group flex h-28 flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-white font-display transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-pine hover:shadow-[0_16px_36px_rgb(10,59,44,0.12)]"
                    >
                      <span className="text-xl font-extrabold">{v.name}</span>
                      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-sage">{k === 'en' ? 'English' : k === 'hi' ? 'Hindi' : 'Marathi'}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {lang && phase === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }} className="text-center">
                <button
                  onClick={startListening}
                  data-testid="voice-mic-btn"
                  className="group relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-clay text-white shadow-[0_20px_50px_rgb(231,111,81,0.4)] transition-transform duration-300 hover:scale-105"
                  aria-label="Start speaking"
                >
                  <span className="absolute inset-0 animate-pin-ping rounded-full bg-clay/40" />
                  <Mic size={40} className="relative" />
                </button>
                <h2 className="mt-8 font-display text-2xl font-extrabold">Tell us what you need</h2>
                <p className="mx-auto mt-3 max-w-sm text-sm text-sage">{VOICE_SCRIPTS[lang].hint}</p>
                <button onClick={() => { setLang(null); setPhase('idle'); }} className="mt-6 text-xs font-bold text-sage hover:text-ink" data-testid="voice-change-lang">Change language</button>
              </motion.div>
            )}

            {phase === 'listening' && (
              <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <Waveform active />
                <h2 className="mt-6 font-display text-2xl font-extrabold">Listening…</h2>
                <p className="mt-2 text-sm text-sage">Speak naturally — we're picking out your requirement.</p>
                <button onClick={() => { clearTimeout(timer.current); setPhase('idle'); }} className="btn-ghost mx-auto mt-8" data-testid="voice-stop-btn">
                  <Square size={14} /> Stop
                </button>
              </motion.div>
            )}

            {phase === 'transcript' && (
              <motion.div key="transcript" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }}>
                <p className="eyebrow mb-4">We heard</p>
                <blockquote className="rounded-2xl border-l-4 border-clay bg-sand p-6 font-display text-xl font-bold leading-snug" data-testid="voice-transcript">
                  “{VOICE_SCRIPTS[lang].transcript}”
                </blockquote>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => setPhase('extracted')} className="btn-primary" data-testid="voice-continue-btn">Continue <ArrowRight size={15} /></button>
                  <button onClick={startListening} className="btn-ghost" data-testid="voice-retry-btn"><RotateCcw size={14} /> Try again</button>
                </div>
              </motion.div>
            )}

            {phase === 'extracted' && (
              <motion.div key="extracted" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                <p className="eyebrow mb-4">Here's what we understood</p>
                <div className="grid gap-3 sm:grid-cols-2" data-testid="voice-extracted">
                  {EXTRACTED.map((e, i) => (
                    <motion.div
                      key={e.k}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
                      className="rounded-xl border border-border bg-white p-4"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sage">{e.k}</p>
                      <p className="num mt-1 text-sm font-bold">{e.v}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={confirm} className="btn-primary" data-testid="voice-confirm-btn"><Check size={15} /> Looks correct — show my schemes</button>
                  <button onClick={() => navigate('/requirements')} className="btn-ghost" data-testid="voice-correct-btn"><Keyboard size={14} /> Correct manually</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <Reveal><TrustNote>Voice is simply another doorway into the same journey — what you say lands in the same requirement form, and the same recommendations follow.</TrustNote></Reveal>
          <Reveal delay={0.08}><TrustNote tone="warn">If we can't understand a recording, you can always retry or type it instead — nothing is lost.</TrustNote></Reveal>
          <Reveal delay={0.14} className="card-premium p-6">
            <p className="eyebrow mb-4">Works for</p>
            <ul className="space-y-2.5 text-sm text-sage">
              <li>“मला दुकानासाठी कर्ज हवे आहे”</li>
              <li>“मुझे मशीन खरीदने के लिए पैसे चाहिए”</li>
              <li>“I want to grow my small business”</li>
            </ul>
          </Reveal>
        </div>
      </section>
    </PageWrap>
  );
}
