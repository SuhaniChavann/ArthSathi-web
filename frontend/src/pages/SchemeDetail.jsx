import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, MapPin, IndianRupee, Percent, CalendarClock, Hourglass, Gift } from 'lucide-react';
import { IMG, inr } from '../data/mock';
import { PageWrap, Reveal, Stagger, staggerItem } from '../components/motion';
import { PageHeader, FreshnessBadge, TrustNote, MatchRing } from '../components/widgets';
import { SchemeNav, useScheme } from '../components/SchemeNav';
import { motion } from 'framer-motion';

export default function SchemeDetail() {
  const scheme = useScheme();

  const stats = [
    { icon: IndianRupee, label: 'Loan amount', value: scheme.loanWindow },
    { icon: Percent, label: 'Interest rate', value: `${scheme.rate}% p.a.` },
    { icon: CalendarClock, label: 'Tenure', value: `${scheme.tenureYears} years` },
    { icon: Hourglass, label: 'Moratorium', value: scheme.moratoriumMonths ? `${scheme.moratoriumMonths} months` : 'None' },
    { icon: Gift, label: 'Benefits', value: scheme.subsidy },
    { icon: MapPin, label: 'Where it applies', value: scheme.location },
  ];

  return (
    <PageWrap>
      <PageHeader
        eyebrow={`${scheme.tag} · ${scheme.ministry}`}
        title={scheme.name}
        desc={scheme.tagline}
      >
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <FreshnessBadge iso={scheme.lastVerified} />
          <div className="flex items-center gap-3">
            <MatchRing score={scheme.match} size={56} stroke={5} />
            <div className="text-xs text-sage">Match Score<br /><span className="font-semibold text-ink">for your profile</span></div>
          </div>
        </div>
      </PageHeader>
      <SchemeNav />

      <nav className="container-x mt-6 flex items-center gap-1.5 text-xs text-sage" aria-label="Breadcrumb">
        <Link to="/schemes" className="hover:text-ink">Schemes</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-ink">{scheme.name}</span>
      </nav>

      <section className="container-x mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {stats.map((s) => (
              <motion.div variants={staggerItem} key={s.label} className="card-premium flex items-start gap-4 p-5" data-testid={`scheme-stat-${s.label.toLowerCase().replace(/\s|\/|\(|\)/g, '-')}`}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sand text-pine"><s.icon size={19} /></span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sage">{s.label}</p>
                  <p className="num mt-1 text-sm font-bold leading-snug">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </Stagger>

          <Reveal className="card-premium p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold">What this scheme is for</h2>
            <p className="mt-3 text-sm leading-relaxed text-sage">
              {scheme.name} supports people like {`“${'Anita'}”`} — {scheme.tagline} It operates under the {scheme.ministry}.
            </p>
            <h3 className="mt-8 font-display text-lg font-bold">How applying usually works</h3>
            <ol className="mt-4 space-y-3">
              {scheme.process.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-sage">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pine text-[11px] font-bold text-white">{i + 1}</span>
                  {p}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="img-frame aspect-[21/8]">
            <img src={IMG.professionals} alt="Professionals reviewing scheme paperwork together" loading="lazy" />
          </Reveal>

          <Reveal><TrustNote tone="warn">Scheme details can change — loan limits, rates and documents included. <strong>Verify with your channel partner before you act.</strong></TrustNote></Reveal>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Reveal className="card-premium p-6">
            <p className="eyebrow mb-4">Your next steps</p>
            <div className="space-y-2.5">
              <Link to={`/schemes/${scheme.id}/eligibility`} className="btn-primary w-full" data-testid="cta-check-eligibility">Check my eligibility <ArrowRight size={15} /></Link>
              <Link to={`/schemes/${scheme.id}/why`} className="btn-ghost w-full" data-testid="cta-why">Why this scheme?</Link>
              <Link to={`/schemes/${scheme.id}/documents`} className="btn-ghost w-full" data-testid="cta-documents">Required documents</Link>
              <Link to={`/schemes/${scheme.id}/calculator`} className="btn-ghost w-full" data-testid="cta-calculator">Calculate loan affordability</Link>
              <Link to="/applications" className="btn-ghost w-full" data-testid="cta-apply">Add to my applications</Link>
              <Link to="/connect" className="btn-ghost w-full" data-testid="cta-partner">Find where to apply</Link>
            </div>
            <p className="mt-5 border-t border-border pt-4 text-[11px] leading-relaxed text-sage">
              One guided path — each step reuses what you already told us.
            </p>
          </Reveal>
        </aside>
      </section>
    </PageWrap>
  );
}
