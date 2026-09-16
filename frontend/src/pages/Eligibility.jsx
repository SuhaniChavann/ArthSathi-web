import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, XCircle, HelpCircle, UserRound } from 'lucide-react';
import { eligibilityFor, inr } from '../data/mock';
import { PageWrap, Reveal, Stagger, staggerItem } from '../components/motion';
import { PageHeader, TrustNote, EligibilityBadge, FreshnessBadge } from '../components/widgets';
import { SchemeNav, useScheme } from '../components/SchemeNav';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const MESSAGES = {
  likely: 'Your information appears to meet the criteria we currently hold for this scheme.',
  notmet: 'Some criteria do not match your current information. This is not a rejection — see what differs below.',
  verify: 'The information we have is not enough for a clear answer. A quick verification can settle the open points.',
};

export default function Eligibility() {
  const scheme = useScheme();
  const { state } = useApp();
  const { status, rows } = eligibilityFor(scheme, state.requirement, state.verified);

  const profileBits = [
    ['Age', `${state.profile.age} yrs`],
    ['Income', `${inr(state.profile.monthlyIncome)}/mo`],
    ['Category', state.profile.category],
    ['Location', `${state.profile.district}, ${state.profile.state}`],
    ['Education', state.profile.education],
    ['Business', state.profile.business],
    ['Need', inr(state.requirement.loanAmount)],
  ];

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Step 6 · Indicative check"
        title="Does your profile fit this scheme?"
        desc="We compare your saved profile against the scheme’s documented criteria — you see every comparison we make."
        step="eligibility"
      >
        <FreshnessBadge iso={scheme.lastVerified} />
      </PageHeader>
      <SchemeNav />

      <section className="container-x mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Reveal className="card-premium p-6 sm:p-8" data-testid="eligibility-result">
            <div className="flex flex-wrap items-center gap-4">
              <EligibilityBadge status={status} large />
              <p className="text-sm text-sage">{MESSAGES[status]}</p>
            </div>
            <div className="mt-6">
              <TrustNote tone={status === 'likely' ? 'ok' : status === 'verify' ? 'warn' : 'info'}>
                <strong>This is an indicative assessment, not an approval.</strong> Final eligibility is decided by the
                concerned authority or channel partner after verification.
              </TrustNote>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-border">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 border-b border-border bg-sand px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-sage max-sm:hidden">
                <span>Criterion</span><span>Your information</span><span>Scheme requires</span><span className="w-20 text-right">Result</span>
              </div>
              <Stagger className="divide-y divide-border">
                {rows.map((r, i) => (
                  <motion.div variants={staggerItem} key={i} className="grid grid-cols-2 gap-2 px-5 py-4 text-sm sm:grid-cols-[1fr_1fr_1fr_auto]" data-testid={`eligibility-row-${i}`}>
                    <span className="font-semibold">{r.label}</span>
                    <span className="text-sage">{r.user}</span>
                    <span className="text-sage">{r.required}</span>
                    <span className="flex sm:w-20 sm:justify-end">
                      {r.met === true && <span className="flex items-center gap-1.5 text-xs font-bold text-success"><CheckCircle2 size={15} /> Met</span>}
                      {r.met === false && <span className="flex items-center gap-1.5 text-xs font-bold text-destructive"><XCircle size={15} /> Differs</span>}
                      {r.met === null && <span className="flex items-center gap-1.5 text-xs font-bold text-[#8a6d1f]"><HelpCircle size={15} /> Verify</span>}
                    </span>
                  </motion.div>
                ))}
              </Stagger>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {status === 'likely' && (
                <Link to={`/schemes/${scheme.id}/documents`} className="btn-primary" data-testid="eligibility-next-docs">View required documents <ArrowRight size={15} /></Link>
              )}
              {status === 'verify' && (
                <Link to="/verify" className="btn-primary" data-testid="eligibility-next-verify">Complete verification <ArrowRight size={15} /></Link>
              )}
              {status === 'notmet' && (
                <Link to={`/schemes/${scheme.id}`} className="btn-primary" data-testid="eligibility-back-scheme">Review scheme details <ArrowRight size={15} /></Link>
              )}
              <Link to={`/schemes/${scheme.id}/calculator`} className="btn-ghost" data-testid="eligibility-next-calc">Estimate my EMI</Link>
            </div>
          </Reveal>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal className="card-premium p-6">
            <p className="eyebrow mb-4 flex items-center gap-2"><UserRound size={13} /> Profile used for this check</p>
            <div className="space-y-2.5">
              {profileBits.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-[13px]">
                  <span className="text-sage">{k}</span>
                  <span className="num font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <Link to="/profile" className="mt-5 block text-center text-xs font-bold text-clay hover:underline" data-testid="eligibility-edit-profile">Something off? Edit my profile</Link>
          </Reveal>
          <Reveal delay={0.1}>
            <TrustNote tone="info">The same profile drives every scheme’s check — change it once, and all eligibility results update.</TrustNote>
          </Reveal>
        </aside>
      </section>
    </PageWrap>
  );
}
