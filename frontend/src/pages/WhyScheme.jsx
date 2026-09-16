import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { IMG, inr } from '../data/mock';
import { PageWrap, Reveal, Stagger, staggerItem } from '../components/motion';
import { PageHeader, TrustNote, MatchRing, FreshnessBadge } from '../components/widgets';
import { SchemeNav, useScheme } from '../components/SchemeNav';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function WhyScheme() {
  const scheme = useScheme();
  const { state } = useApp();

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Step 5 · Explainable recommendation"
        title={`Why ${scheme.name} for you?`}
        desc="Every recommendation must explain itself. Here is exactly what in your profile pushed this scheme to the top."
        step="why"
      >
        <FreshnessBadge iso={scheme.lastVerified} />
      </PageHeader>
      <SchemeNav />

      <section className="container-x mt-10 grid gap-8 lg:grid-cols-[400px_1fr]">
        <Reveal className="card-premium grain relative overflow-hidden bg-pine p-8 text-sand lg:sticky lg:top-24 lg:self-start">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-clay/25 blur-3xl" />
          <p className="eyebrow !text-sand/60">Match score</p>
          <div className="mt-4 flex items-center gap-5">
            <MatchRing score={scheme.match} size={110} stroke={8} dark />
            <div>
              <p className="font-display text-2xl font-extrabold">Strong match</p>
              <p className="mt-1 text-xs leading-relaxed text-sand/70">against your profile & {inr(state.requirement.loanAmount)} requirement</p>
            </div>
          </div>
          <div className="mt-6 space-y-2 border-t border-sand/15 pt-5 text-[13px] text-sand/80">
            <p className="flex justify-between"><span>Business</span><strong className="text-sand">{state.profile.business}</strong></p>
            <p className="flex justify-between"><span>Location</span><strong className="text-sand">{state.profile.district}, {state.profile.state}</strong></p>
            <p className="flex justify-between"><span>Need</span><strong className="num text-sand">{inr(state.requirement.loanAmount)}</strong></p>
          </div>
          <p className="mt-6 rounded-xl border border-sand/20 bg-sand/10 p-3.5 text-[11.5px] leading-relaxed text-sand/75">
            A {scheme.match}% match reflects suitability against documented scheme criteria. It is <strong>not</strong> a {scheme.match}% chance of approval.
          </p>
        </Reveal>

        <div className="space-y-8">
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {scheme.why.map((w, i) => (
              <motion.div variants={staggerItem} key={i} className="card-premium p-6" data-testid={`why-reason-${i}`}>
                <span className="chapter-num text-4xl">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-display text-base font-bold">{w.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-sage">{w.desc}</p>
              </motion.div>
            ))}
          </Stagger>

          <Reveal className="card-premium overflow-hidden">
            <div className="grid md:grid-cols-[1fr_220px]">
              <div className="p-6 sm:p-8">
                <p className="eyebrow mb-3 flex items-center gap-2"><ArrowLeftRight size={13} /> Why not the alternative first?</p>
                <h3 className="font-display text-lg font-bold">{scheme.notPreferred.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sage">{scheme.notPreferred.reason}</p>
              </div>
              <div className="img-frame hidden md:block">
                <img src={IMG.womanOffice} alt="Entrepreneur weighing two scheme options" loading="lazy" />
              </div>
            </div>
          </Reveal>

          <Reveal><TrustNote>Honest comparison builds trust: we show what we ranked higher, what we ranked lower, and the reason in both directions.</TrustNote></Reveal>

          <Reveal className="flex flex-wrap gap-3">
            <Link to={`/schemes/${scheme.id}/eligibility`} className="btn-primary" data-testid="why-next-eligibility">Check my eligibility <ArrowRight size={15} /></Link>
            <Link to={`/schemes/${scheme.id}`} className="btn-ghost" data-testid="why-back-detail">Full scheme details</Link>
          </Reveal>
        </div>
      </section>
    </PageWrap>
  );
}
