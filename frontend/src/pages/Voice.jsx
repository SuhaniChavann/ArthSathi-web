import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, RotateCcw, Check, ArrowRight, Keyboard, Play, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { VOICE_SCRIPTS, inr } from '../data/mock';
import { PageWrap, Reveal, EASE } from '../components/motion';
import { PageHeader, TrustNote, Waveform } from '../components/widgets';
import { useApp } from '../context/AppContext';

const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
const SR_LANG = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

const DEV_DIGITS = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
const normalize = (s) => s.replace(/[०-९]/g, (d) => DEV_DIGITS[d]);

const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const SPECIAL = { 'अडीच': 2.5, 'ढाई': 2.5, 'अढाई': 2.5, 'दीड़': 1.5, 'डेढ़': 1.5 };
const MULT = { lakh: 1e5, lakhs: 1e5, 'लाख': 1e5, 'लाखा': 1e5, thousand: 1e3, thousands: 1e3, 'हज़ार': 1e3, 'हजार': 1e3, crore: 1e7, crores: 1e7, 'करोड': 1e7, 'करोड़': 1e7 };

const PURPOSES = [
  { match: ['tailor', 'सिलाई', 'शिंपी', 'बुटीक', 'boutique', 'सिलणी'], label: 'Tailoring / boutique business' },
  { match: ['dairy', 'दूध', 'डेअरी', 'पशुधन', 'गाई'], label: 'Dairy / livestock' },
  { match: ['farm', 'शेती', 'कृषी', 'खेती', 'agri'], label: 'Agriculture / allied work' },
  { match: ['education', 'study', 'शिक्षण', 'शिक्षा', 'पढ़ाई', 'course', 'college'], label: 'Education' },
  { match: ['home', 'house', 'घर', 'मकान'], label: 'Housing' },
  { match: ['vehicle', 'गाडी', 'वाहन', 'रिक्षा', 'auto'], label: 'Vehicle' },
  { match: ['kirana', 'किराणा', 'shop', 'दुकान', 'stall', 'स्टॉल', 'business', 'व्यवसाय', 'व्यापार', 'उद्योग', 'धंदा'], label: 'Business expansion / working capital' },
];

function extractAmounts(text) {
  const t = ' ' + normalize(text.toLowerCase()).replace(/,/g, '') + ' ';
  const found = [];
  const push = (v, i, len) => {
    v = Math.round(v);
    if (v >= 1000 && !found.some((f) => f.v === v)) found.push({ v, i, len });
  };
  const re = /(अडीच|ढाई|अढाई|दीड़|डेढ़|\d+(?:\.\d+)?)\s*(लाखा?|lakhs?|हज़ार|हजार|thousands?|करोड़?|crores?)?/g;
  let m;
  while ((m = re.exec(t))) {
    const v = SPECIAL[m[1]] ?? parseFloat(m[1]);
    if (!m[2] && v < 1000) continue;
    push(v * (MULT[m[2]] || 1), m.index, m[0].length);
  }
  const toks = [...t.matchAll(/\S+/g)];
  let acc = 0, accIdx = -1;
  for (const w of toks) {
    const tok = w[0];
    if (tok in WORDS) { acc += WORDS[tok]; if (accIdx < 0) accIdx = w.index; }
    else if (tok === 'hundred') { acc = (acc || 1) * 100; }
    else if (tok === 'half') { acc += 0.5; }
    else if (tok === 'quarter') { acc += 0.25; }
    else if (tok in MULT) { if (acc > 0) push(acc * MULT[tok], accIdx, w.index + tok.length - accIdx); acc = 0; accIdx = -1; }
    else { acc = 0; accIdx = -1; }
  }
  const income = found.filter((f) => /income|कमाई|उत्पन्न|आय|earnings?|महिन्याचे|महीने की/.test(t.slice(Math.max(0, f.i - 45), f.i + f.len + 12)));
  const amounts = found.filter((f) => !income.includes(f)).sort((a, b) => b.v - a.v);
  return { amounts, income };
}

function extract(text, profile) {
  const lower = text.toLowerCase();
  const p = PURPOSES.find((x) => x.match.some((k) => lower.includes(k)));
  const { amounts, income } = extractAmounts(text);
  return {
    purpose: p ? p.label : 'Business / self-employment support',
    loanAmount: amounts.length ? Math.min(...amounts.map((a) => a.v)) : 0,
    projectCost: amounts.length ? Math.max(...amounts.map((a) => a.v)) : 0,
    monthlyIncome: income.length ? income[0].v : profile.monthlyIncome,
  };
}

const ERRORS = {
  'not-allowed': 'Microphone permission was blocked. Allow mic access in the browser bar and try again.',
  network: 'The speech service could not be reached. Check your connection and try again.',
  'no-speech': "We couldn't hear anything. Try speaking a little closer to the microphone.",
  default: "We couldn't understand the recording. Try speaking again or continue with manual entry.",
};

export default function Voice() {
  const [lang, setLang] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | listening | transcript | extracted | error
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [error, setError] = useState(null);
  const [sampled, setSampled] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [editLoan, setEditLoan] = useState(0);
  const [editCost, setEditCost] = useState(0);
  const recRef = useRef(null);
  const finalRef = useRef('');
  const navigate = useNavigate();
  const { state, setRequirement, setProfile } = useApp();

  useEffect(() => () => { try { recRef.current?.abort(); } catch {} }, []);

  const stopAndFinish = () => {
    try { recRef.current?.stop(); } catch {}
  };

  const startListening = () => {
    if (!SR) return;
    setError(null);
    setTranscript('');
    setInterim('');
    setSampled(false);
    finalRef.current = '';
    const rec = new SR();
    rec.lang = SR_LANG[lang];
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e) => {
      let inter = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalRef.current += e.results[i][0].transcript + ' ';
        else inter += e.results[i][0].transcript;
      }
      setInterim(inter);
      setTranscript(finalRef.current.trim());
    };
    rec.onerror = (e) => {
      setError(ERRORS[e.error] || ERRORS.default);
      setPhase('error');
    };
    rec.onend = () => {
      setInterim('');
      setPhase((p) => {
        if (p === 'listening') {
          if (finalRef.current.trim()) { setTranscript(finalRef.current.trim()); return 'transcript'; }
          setError(ERRORS['no-speech']);
          return 'error';
        }
        return p;
      });
    };
    recRef.current = rec;
    try {
      rec.start();
      setPhase('listening');
    } catch {
      setError(ERRORS.default);
      setPhase('error');
    }
  };

  const useSample = () => {
    setSampled(true);
    setTranscript(VOICE_SCRIPTS[lang].transcript);
    setPhase('transcript');
  };

  const runExtraction = () => {
    const x = extract(transcript, state.profile);
    setParsed(x);
    setEditLoan(x.loanAmount);
    setEditCost(x.projectCost);
    setPhase('extracted');
  };

  const confirm = () => {
    if (!editLoan || editLoan <= 0) {
      toast.error('Loan amount missing', { description: 'Enter how much you need, or correct manually.' });
      return;
    }
    setRequirement({ purpose: parsed.purpose, projectCost: editCost || editLoan, loanAmount: editLoan });
    if (parsed.monthlyIncome && parsed.monthlyIncome !== state.profile.monthlyIncome) {
      setProfile({ monthlyIncome: parsed.monthlyIncome });
    }
    toast.success('Requirement captured from your voice', { description: 'Schemes are being ranked against it.' });
    navigate('/schemes');
  };

  const liveText = (transcript + ' ' + interim).trim();

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Speak — we will type"
        title="Tell us what you need, in your own words."
        desc="Live speech recognition in English, हिन्दी or मराठी. Describe your requirement naturally — we listen, transcribe and pick out the numbers."
        step="requirement"
      />

      <section className="container-x mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="card-premium grain relative overflow-hidden p-8 sm:p-12" data-testid="voice-panel">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-clay/10 blur-3xl" />

          {!SR && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-warning/50 bg-warning/10 p-4 text-[13px] text-[#7a5f18]" data-testid="voice-unsupported">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <p>Live recognition needs Chrome or Edge. On this browser, use <strong>Play a sample phrase</strong> or type your requirement manually.</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!lang && (
              <motion.div key="lang" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }}>
                <p className="eyebrow mb-6">Choose your language</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {Object.entries(VOICE_SCRIPTS).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => { setLang(k); setPhase('idle'); }}
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
                  disabled={!SR}
                  data-testid="voice-mic-btn"
                  className="group relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-clay text-white shadow-[0_20px_50px_rgb(231,111,81,0.4)] transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Start speaking"
                >
                  {SR && <span className="absolute inset-0 animate-pin-ping rounded-full bg-clay/40" />}
                  <Mic size={40} className="relative" />
                </button>
                <h2 className="mt-8 font-display text-2xl font-extrabold">Tell us what you need</h2>
                <p className="mx-auto mt-3 max-w-sm text-sm text-sage">{VOICE_SCRIPTS[lang].hint}</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  <button onClick={useSample} className="inline-flex items-center gap-1.5 text-xs font-bold text-clay hover:underline" data-testid="voice-sample-btn">
                    <Play size={13} /> Play a sample phrase
                  </button>
                  <button onClick={() => { setLang(null); setPhase('idle'); }} className="text-xs font-bold text-sage hover:text-ink" data-testid="voice-change-lang">Change language</button>
                </div>
              </motion.div>
            )}

            {phase === 'listening' && (
              <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <Waveform active />
                <h2 className="mt-6 font-display text-2xl font-extrabold">Listening…</h2>
                <p className="mt-2 text-sm text-sage">Speak naturally in {VOICE_SCRIPTS[lang].name} — we're transcribing live.</p>
                <div className="mx-auto mt-6 min-h-[72px] max-w-lg rounded-2xl border border-border bg-white p-4 text-left" data-testid="voice-live-transcript">
                  {liveText
                    ? <p className="text-[15px] font-medium leading-relaxed text-ink">{liveText}<span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-clay align-middle" /></p>
                    : <p className="text-sm italic text-sage">Your words will appear here as you speak…</p>}
                </div>
                <button onClick={stopAndFinish} className="btn-ghost mx-auto mt-6" data-testid="voice-stop-btn">
                  <Square size={14} /> Done — stop listening
                </button>
              </motion.div>
            )}

            {phase === 'transcript' && (
              <motion.div key="transcript" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }}>
                <p className="eyebrow mb-4">{sampled ? 'Sample phrase (demo)' : 'We heard'}</p>
                <blockquote className="rounded-2xl border-l-4 border-clay bg-sand p-6 font-display text-xl font-bold leading-snug" data-testid="voice-transcript">
                  “{transcript}”
                </blockquote>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={runExtraction} className="btn-primary" data-testid="voice-continue-btn">Continue <ArrowRight size={15} /></button>
                  <button onClick={startListening} disabled={!SR} className="btn-ghost disabled:opacity-40" data-testid="voice-retry-btn"><RotateCcw size={14} /> Try again</button>
                </div>
              </motion.div>
            )}

            {phase === 'extracted' && parsed && (
              <motion.div key="extracted" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                <p className="eyebrow mb-4">Here's what we understood</p>
                <div className="grid gap-3 sm:grid-cols-2" data-testid="voice-extracted">
                  <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EASE }} className="rounded-xl border border-border bg-white p-4 sm:col-span-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sage">Purpose</p>
                    <p className="mt-1 text-sm font-bold">{parsed.purpose}</p>
                  </motion.div>
                  {[
                    { label: 'Loan needed (₹)', val: editLoan, set: setEditLoan, tid: 'voice-edit-loan' },
                    { label: 'Total project cost (₹)', val: editCost, set: setEditCost, tid: 'voice-edit-cost' },
                  ].map((f, i) => (
                    <motion.div key={f.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * (i + 1), duration: 0.4, ease: EASE }} className="rounded-xl border border-border bg-white p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sage">{f.label}</p>
                      <input
                        type="number"
                        value={f.val || ''}
                        onChange={(e) => f.set(Number(e.target.value))}
                        placeholder="Tap to enter"
                        className="num mt-1 w-full bg-transparent font-display text-lg font-bold outline-none placeholder:text-sm placeholder:font-body placeholder:font-medium placeholder:text-sage/60"
                        data-testid={f.tid}
                      />
                    </motion.div>
                  ))}
                  <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24, duration: 0.4, ease: EASE }} className="rounded-xl border border-border bg-white p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sage">Monthly income</p>
                    <p className="num mt-1 text-sm font-bold">{inr(parsed.monthlyIncome)}</p>
                    <p className="text-[10px] text-sage">{parsed.monthlyIncome === state.profile.monthlyIncome ? 'from your profile' : 'heard in your speech'}</p>
                  </motion.div>
                </div>
                <p className="mt-4 text-xs text-sage">Heard wrong? Edit the numbers above — everything else flows from your profile.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={confirm} className="btn-primary" data-testid="voice-confirm-btn"><Check size={15} /> Looks correct — show my schemes</button>
                  <button onClick={() => navigate('/requirements')} className="btn-ghost" data-testid="voice-correct-btn"><Keyboard size={14} /> Correct manually</button>
                </div>
              </motion.div>
            )}

            {phase === 'error' && (
              <motion.div key="error" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} className="text-center" data-testid="voice-error-panel">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/20 text-[#8a6d1f]"><AlertTriangle size={28} /></span>
                <h2 className="mt-5 font-display text-xl font-extrabold">Something didn't work</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-sage">{error}</p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <button onClick={startListening} disabled={!SR} className="btn-primary disabled:opacity-40" data-testid="voice-error-retry-btn"><RotateCcw size={14} /> Try speaking again</button>
                  <button onClick={useSample} className="btn-ghost" data-testid="voice-error-sample-btn"><Play size={14} /> Use a sample phrase</button>
                  <button onClick={() => navigate('/requirements')} className="btn-ghost" data-testid="voice-error-manual-btn"><Keyboard size={14} /> Type it instead</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <Reveal><TrustNote>Live speech is transcribed by your <strong>browser's speech service</strong> and converted into the same requirement form — the same recommendations follow.</TrustNote></Reveal>
          <Reveal delay={0.08}><TrustNote tone="warn">If recognition fails or the browser doesn't support it, you can retry, play a sample phrase, or type — nothing is lost.</TrustNote></Reveal>
          <Reveal delay={0.14} className="card-premium p-6">
            <p className="eyebrow mb-4">Try saying</p>
            <ul className="space-y-2.5 text-sm text-sage">
              <li>“मला दुकानासाठी अडीच लाख रुपये हवे आहेत”</li>
              <li>“मुझे सिलाई के काम के लिए दो लाख का कर्ज़ चाहिए”</li>
              <li>“I need two and a half lakh rupees to expand my boutique”</li>
            </ul>
          </Reveal>
        </div>
      </section>
    </PageWrap>
  );
}
