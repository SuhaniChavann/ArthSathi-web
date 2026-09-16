import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, ShieldCheck, ArrowRight, RotateCcw, Landmark, FileText, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { PageWrap, EASE } from '../components/motion';
import { PageHeader, ExtBadge, TrustNote, JourneyStepper } from '../components/widgets';

const STAGES = [
  { label: 'Authenticating with DigiLocker', icon: ShieldCheck },
  { label: 'Fetching Udyam Registration', icon: Landmark },
  { label: 'Retrieving PAN details', icon: CreditCard },
  { label: 'Preparing your verified profile', icon: FileText },
];

const RETRIEVED = [
  { k: 'Full name', v: 'Anita Deshmukh', src: 'DigiLocker' },
  { k: 'Udyam Registration No.', v: 'UDYAM-MH-26-0042317', src: 'Udyam' },
  { k: 'Enterprise name', v: 'Anita Boutique & Tailors', src: 'Udyam' },
  { k: 'Enterprise type', v: 'Micro · Services', src: 'Udyam' },
  { k: 'PAN', v: 'BN••••••21F', src: 'DigiLocker' },
  { k: 'Date of incorporation', v: '14 Mar 2020', src: 'Udyam' },
];

export default function Verify() {
  const { state, setVerified } = useApp();
  const navigate = useNavigate();
  const [stage, setStage] = useState(-1); // -1 idle, 0..3 running, 4 done
  const done = stage >= STAGES.length;

  useEffect(() => {
    if (stage < 0 || stage >= STAGES.length) return;
    const t = setTimeout(() => setStage((s) => s + 1), 1300);
    return () => clearTimeout(t);
  }, [stage]);

  const confirm = () => {
    setVerified({ digilocker: true, udyam: true });
    toast.success('Verified profile confirmed', { description: 'DigiLocker & Udyam information added to your profile.' });
    navigate('/requirements');
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Step 2 · Verify once, reuse everywhere"
        title="Verify your business."
        desc="One consent fetches your identity, enterprise and PAN information from government sources — so you never retype it."
      />
      <div className="container-x mt-2"><JourneyStepper current="verify" /></div>

      <section className="container-x mt-12 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="card-premium p-6 sm:p-10" data-testid="verify-panel">
          <div className="flex flex-wrap gap-2">
            <ExtBadge name="DigiLocker" />
            <ExtBadge name="Udyam" />
          </div>

          {stage === -1 && !state.verified.udyam && (
            <div className="mt-10 text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-pine text-sand">
                <ShieldCheck size={36} />
              </span>
              <h2 className="mt-6 font-display text-2xl font-extrabold">Fetch verified information</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-sage">
                We will authenticate with DigiLocker, verify your Udyam Registration and retrieve available PAN
                details. Nothing is saved until you review and confirm.
              </p>
              <button onClick={() => setStage(0)} className="btn-primary mt-8" data-testid="verify-start-btn">
                Verify with DigiLocker <ArrowRight size={16} />
              </button>
              <p className="mt-4 text-xs text-sage">Prototype: this flow is simulated — no real credentials are requested.</p>
            </div>
          )}

          {(stage >= 0 && !done) && (
            <div className="mt-10" data-testid="verify-progress">
              <div className="space-y-3">
                {STAGES.map((s, i) => {
                  const active = i === stage;
                  const complete = i < stage;
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className={`flex items-center gap-4 rounded-xl border p-4 ${active ? 'border-clay/50 bg-clay/5' : complete ? 'border-success/30 bg-success/5' : 'border-border'}`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${complete ? 'bg-success text-white' : active ? 'bg-clay text-white' : 'bg-muted text-sage'}`}>
                        {complete ? <BadgeCheck size={18} /> : <s.icon size={17} className={active ? 'animate-pulse' : ''} />}
                      </span>
                      <div>
                        <p className="text-sm font-bold">{s.label}</p>
                        <p className="text-xs text-sage">{complete ? 'Retrieved' : active ? 'In progress…' : 'Waiting'}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                <motion.div className="h-full bg-gradient-to-r from-pine to-success" animate={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} transition={{ duration: 0.9, ease: EASE }} />
              </div>
            </div>
          )}

          <AnimatePresence>
            {(done || state.verified.udyam) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="mt-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-white"><BadgeCheck size={22} /></span>
                  <div>
                    <h2 className="font-display text-xl font-extrabold">Information retrieved</h2>
                    <p className="text-sm text-sage">Review what came from each source. Confirm to add it to your profile.</p>
                  </div>
                </div>
                <div className="mt-6 divide-y divide-border rounded-2xl border border-border" data-testid="verify-retrieved">
                  {RETRIEVED.map((r) => (
                    <div key={r.k} className="flex flex-wrap items-center justify-between gap-2 p-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sage">{r.k}</p>
                        <p className="num mt-0.5 text-sm font-bold">{r.v}</p>
                      </div>
                      <span className="rounded-full bg-sand px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-pine">via {r.src}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={confirm} className="btn-primary" data-testid="verify-confirm-btn">
                    Looks correct — confirm <ArrowRight size={16} />
                  </button>
                  {!state.verified.udyam && (
                    <button onClick={() => setStage(-1)} className="btn-ghost" data-testid="verify-retry-btn">
                      <RotateCcw size={15} /> Retry verification
                    </button>
                  )}
                  {state.verified.udyam && (
                    <button onClick={() => navigate('/requirements')} className="btn-ghost" data-testid="verify-next-btn">
                      Skip to my requirement <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <TrustNote tone="info">
            <strong>DigiLocker and Udyam are external Government of India services.</strong> We only read what you consent
            to share, and you confirm everything before it enters your profile.
          </TrustNote>
          <TrustNote tone="ok">
            A verified profile removes most re-typing later: applications, partner visits and ONDC onboarding all reuse it.
          </TrustNote>
          <div className="card-premium p-6">
            <p className="eyebrow mb-4">Why verify?</p>
            <ul className="space-y-3 text-sm text-sage">
              {['Identity fields filled automatically', 'Business proof ready for every scheme', 'PAN retrieved where available', 'Stronger file when you meet a channel partner'].map((t) => (
                <li key={t} className="flex items-start gap-2.5"><BadgeCheck size={16} className="mt-0.5 shrink-0 text-success" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageWrap>
  );
}
