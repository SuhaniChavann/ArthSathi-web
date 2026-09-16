import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BadgeCheck, CheckCircle2, Send, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { SCHEMES, eligibilityFor, inr } from '../data/mock';
import { PageWrap, Reveal, Stagger, staggerItem } from '../components/motion';
import { PageHeader, TrustNote, EligibilityBadge, FreshnessBadge } from '../components/widgets';
import { useApp } from '../context/AppContext';

const EXTRA = {
  'pm-vishwakarma': 'Trade / Skill Proof',
  'mudra-kishor': 'Machinery Quotation',
  pmegp: 'Project Report',
  'standup-india': 'Project Report',
  'pm-svanidhi': 'Vending Certificate / Letter of Recommendation',
  'day-nrlm': 'SHG Membership Record',
};

export default function Applications() {
  const { state, toggleScheme, setDoc, setSubmitted } = useApp();
  const [justSubmitted, setJustSubmitted] = useState(false);

  const selected = SCHEMES.filter((s) => state.selected.includes(s.id));
  const rows = useMemo(
    () =>
      selected.map((s) => {
        const extra = EXTRA[s.id] || 'None';
        const extraReady = extra === 'None' || !!state.docs[`${s.id}:${extra}`];
        const elig = eligibilityFor(s, state.requirement, state.verified);
        return { scheme: s, extra, ready: extraReady && elig.status !== 'notmet', elig };
      }),
    [selected, state.docs, state.requirement, state.verified]
  );
  const readyCount = rows.filter((r) => r.ready).length;

  const submit = () => {
    if (!rows.length) return;
    setSubmitted(true);
    setJustSubmitted(true);
    toast.success('Applications prepared', { description: `${readyCount} application${readyCount === 1 ? '' : 's'} ready to submit through the applicable channels.` });
  };

  if (justSubmitted) {
    return (
      <PageWrap>
        <section className="container-x grid min-h-[70vh] place-items-center pt-24">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-premium max-w-xl p-10 text-center" data-testid="submit-confirmation">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-white"><CheckCircle2 size={30} /></span>
            <h1 className="mt-6 font-display text-3xl font-extrabold">Applications ready to submit</h1>
            <p className="mt-3 text-sm leading-relaxed text-sage">
              <strong className="num">{readyCount} of {rows.length}</strong> applications are complete. Submission happens
              through the <strong>applicable external application channels</strong> — the scheme portal or your channel partner.
              SahaySetu prepares your file; it does not act as the government authority.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/connect" className="btn-primary" data-testid="submit-next-partner">Find where to apply <ArrowRight size={15} /></Link>
              <button onClick={() => setJustSubmitted(false)} className="btn-ghost" data-testid="submit-back">Back to review</button>
            </div>
          </motion.div>
        </section>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Step 9 · One profile, many applications"
        title="Prepare applications together."
        desc="Select the schemes you want. Your profile and verified information fill the common fields everywhere — you only handle what is genuinely scheme-specific."
        step="apply"
      />

      <section className="container-x mt-10 space-y-10">
        <div>
          <Reveal><h2 className="font-display text-lg font-bold">1 · Choose schemes</h2></Reveal>
          <Stagger className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {SCHEMES.slice(0, 6).map((s) => {
              const on = state.selected.includes(s.id);
              return (
                <motion.button
                  variants={staggerItem}
                  key={s.id}
                  onClick={() => toggleScheme(s.id)}
                  data-testid={`apply-select-${s.id}`}
                  className={`card-premium flex items-center justify-between gap-3 p-5 text-left transition-[border-color,box-shadow] duration-300 ${on ? '!border-pine shadow-[0_0_0_2px_#0A3B2C]' : 'hover:border-pine/30'}`}
                >
                  <div>
                    <p className="font-display text-sm font-bold">{s.name}</p>
                    <p className="mt-0.5 text-xs text-sage">{s.tag} · up to {inr(s.maxLoan)}</p>
                  </div>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${on ? 'border-pine bg-pine text-white' : 'border-border text-transparent'}`}>
                    <CheckCircle2 size={16} />
                  </span>
                </motion.button>
              );
            })}
          </Stagger>
        </div>

        {rows.length > 0 && (
          <div>
            <Reveal><h2 className="font-display text-lg font-bold">2 · Requirement matrix</h2>
            <p className="mt-1 text-sm text-sage">What is reused, what each scheme still needs, and whether that application is ready.</p></Reveal>
            <Reveal className="card-premium mt-5 overflow-hidden" data-testid="requirement-matrix">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-sand text-left text-[10px] font-bold uppercase tracking-[0.14em] text-sage">
                      <th className="p-4">Scheme</th>
                      <th className="p-4">Common information</th>
                      <th className="p-4">Additional requirement</th>
                      <th className="p-4">Eligibility</th>
                      <th className="p-4 text-right">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.map(({ scheme: s, extra, ready, elig }) => (
                      <tr key={s.id} className="align-top">
                        <td className="p-4">
                          <p className="font-display font-bold">{s.name}</p>
                          <FreshnessBadge iso={s.lastVerified} />
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-pine/8 bg-pine/5 px-3 py-1 text-[11px] font-bold text-pine">
                            <UserRound size={12} /> From your profile{state.verified.udyam ? ' · verified' : ''}
                          </span>
                          <p className="mt-1.5 text-xs text-sage">Identity, address, income, business — reused automatically.</p>
                        </td>
                        <td className="p-4">
                          {extra === 'None' ? (
                            <span className="text-xs font-semibold text-sage">None beyond profile</span>
                          ) : state.docs[`${s.id}:${extra}`] ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success"><BadgeCheck size={14} /> {extra}</span>
                          ) : (
                            <button
                              onClick={() => setDoc(`${s.id}:${extra}`, true)}
                              data-testid={`resolve-${s.id}`}
                              className="rounded-full border border-clay/50 px-3.5 py-1.5 text-xs font-bold text-clay transition-colors hover:bg-clay hover:text-white"
                            >
                              Mark “{extra}” ready
                            </button>
                          )}
                        </td>
                        <td className="p-4"><EligibilityBadge status={elig.status} /></td>
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${ready ? 'bg-success/10 text-[#1d7268]' : 'bg-clay/10 text-clay'}`} data-testid={`state-${s.id}`}>
                            {ready ? <CheckCircle2 size={13} /> : null}
                            {ready ? 'Ready' : 'Action required'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        )}

        {rows.length > 0 && (
          <Reveal className="card-premium flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8" data-testid="application-review">
            <div>
              <h2 className="font-display text-lg font-bold">3 · Review & submit</h2>
              <p className="mt-1 text-sm text-sage">
                <strong className="num">{readyCount} of {rows.length}</strong> applications ready · scheme-specific fields kept separate for each.
              </p>
            </div>
            <button onClick={submit} className="btn-accent" data-testid="submit-applications-btn">
              <Send size={15} /> Submit through applicable channels
            </button>
          </Reveal>
        )}

        <AnimatePresence>
          {rows.length === 0 && (
            <Reveal className="card-premium p-12 text-center" data-testid="applications-empty">
              <p className="font-display text-xl font-bold">No schemes selected yet.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-sage">Pick at least one scheme above — your profile will be reused across all of them.</p>
              <Link to="/schemes" className="btn-primary mt-6">Browse recommendations <ArrowRight size={15} /></Link>
            </Reveal>
          )}
        </AnimatePresence>

        <TrustNote>
          <strong>Submission is external.</strong> Applications are submitted through the applicable scheme portal or channel
          partner. SahaySetu prepares and organises your information — it never impersonates the authority.
        </TrustNote>
      </section>
    </PageWrap>
  );
}
