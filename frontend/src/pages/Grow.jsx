import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Circle, Store, PackageOpen, Truck, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { IMG } from '../data/mock';
import { PageWrap, Reveal, Stagger, staggerItem } from '../components/motion';
import { PageHeader, TrustNote, ExtBadge } from '../components/widgets';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const STEPS = [
  { icon: BadgeCheck, t: 'Verified business', d: 'Your Udyam-verified profile becomes the foundation — no re-entry.' },
  { icon: PackageOpen, t: 'Catalogue your products', d: 'List what you sell: blouses, alterations, festive wear — with photos and prices.' },
  { icon: Store, t: 'Choose a seller app', d: 'Onboard through any ONDC-participating seller application of your choice.' },
  { icon: Truck, t: 'Reach buyers nationwide', d: 'Your boutique appears to customers across the network, with logistics handled by partners.' },
];

export default function Grow() {
  const { state } = useApp();
  const checks = [
    { label: 'Verified business profile (Udyam)', ok: state.verified.udyam, fix: '/verify', fixLabel: 'Verify now' },
    { label: 'Bank account for settlements', ok: true },
    { label: 'Product catalogue information', ok: false, fix: '/profile', fixLabel: 'Add details' },
    { label: 'GST (if applicable to turnover)', ok: null },
  ];

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Step 13 · From loan to livelihood"
        title="Take your business online with ONDC."
        desc="The same verified profile that earned your loan can open the door to digital commerce — selling beyond your street, your city, your state."
        step="grow"
      >
        <ExtBadge name="ONDC" />
      </PageHeader>

      <section className="container-x mt-12 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-10">
          <Stagger className="grid gap-5 sm:grid-cols-2" gap={0.08}>
            {STEPS.map((s, i) => (
              <motion.div variants={staggerItem} key={s.t} className="card-premium relative p-6 pt-8" data-testid={`ondc-step-${i}`}>
                <span className="chapter-num absolute -top-5 left-5 text-5xl">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sand text-pine"><s.icon size={19} /></span>
                <h3 className="mt-4 font-display text-base font-bold">{s.t}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-sage">{s.d}</p>
              </motion.div>
            ))}
          </Stagger>

          <Reveal className="card-premium overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-6 sm:p-8">
                <p className="eyebrow mb-3">Suitability snapshot</p>
                <h3 className="font-display text-lg font-bold">Is {state.profile.business} ready for ONDC?</h3>
                <div className="mt-5 space-y-3">
                  {checks.map((c) => (
                    <div key={c.label} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3.5 text-sm" data-testid={`ondc-check-${c.label.slice(0, 12).replace(/\s/g, '-')}`}>
                      <span className="font-medium">{c.label}</span>
                      {c.ok === true && <span className="flex items-center gap-1.5 text-xs font-bold text-success"><BadgeCheck size={15} /> In place</span>}
                      {c.ok === false && <Link to={c.fix} className="text-xs font-bold text-clay hover:underline">{c.fixLabel}</Link>}
                      {c.ok === null && <span className="flex items-center gap-1.5 text-xs font-bold text-[#8a6d1f]"><Circle size={12} /> Check applicability</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="img-frame">
                <img src={IMG.painter} alt="Indian artisan woman preparing her work for online sale" loading="lazy" />
              </div>
            </div>
          </Reveal>

          <Reveal className="flex flex-wrap gap-3">
            <button
              onClick={() => toast('Opening ONDC (external)', { description: 'You would now continue onboarding on an ONDC-participating seller app.' })}
              className="btn-primary"
              data-testid="ondc-start-btn"
            >
              Begin ONDC onboarding <ArrowRight size={15} />
            </button>
            <Link to="/stories" className="btn-ghost" data-testid="ondc-stories-link"><IndianRupee size={15} /> See how sellers like you did it</Link>
          </Reveal>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal><TrustNote tone="info"><strong>ONDC is an external, open commerce network</strong> — not a marketplace run by this platform. We guide your suitability and hand you to a participating seller app.</TrustNote></Reveal>
          <Reveal delay={0.08} className="card-premium bg-pine p-6 text-sand grain relative overflow-hidden">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-clay/25 blur-3xl" />
            <p className="eyebrow !text-sand/60">Why it matters</p>
            <p className="mt-3 font-display text-2xl font-extrabold leading-snug">A loan grows your shop.<br />ONDC grows your market.</p>
            <p className="mt-3 text-[13px] leading-relaxed text-sand/70">Sellers on open networks report reaching buyers they could never have met from a single street. Your craft deserves that reach.</p>
          </Reveal>
        </aside>
      </section>
    </PageWrap>
  );
}
