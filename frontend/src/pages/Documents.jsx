import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Circle, FileText, Info } from 'lucide-react';
import { PageWrap, Reveal, Stagger, staggerItem } from '../components/motion';
import { PageHeader, TrustNote, FreshnessBadge } from '../components/widgets';
import { SchemeNav, useScheme } from '../components/SchemeNav';
import { useApp } from '../context/AppContext';

export default function Documents() {
  const scheme = useScheme();
  const { state, setDoc } = useApp();

  const ready = useMemo(
    () => scheme.documents.filter((d) => state.docs[`${scheme.id}:${d.name}`]).length,
    [scheme, state.docs]
  );
  const pct = Math.round((ready / scheme.documents.length) * 100);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Step 7 · Prepare, don't scramble"
        title="Documents you need to prepare."
        desc={`A scheme-specific checklist for ${scheme.name} — with the reason each document is asked for. Tick items off as you collect them.`}
        step="documents"
      >
        <FreshnessBadge iso={scheme.lastVerified} />
      </PageHeader>
      <SchemeNav />

      <section className="container-x mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <Reveal className="card-premium p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-xl font-bold">{scheme.name} checklist</h2>
            <span className="num text-sm font-bold text-pine" data-testid="docs-progress-label">{ready} of {scheme.documents.length} ready</span>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pine to-success"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              data-testid="docs-progress-bar"
            />
          </div>

          <Stagger className="mt-8 space-y-3">
            {scheme.documents.map((d, i) => {
              const key = `${scheme.id}:${d.name}`;
              const isReady = !!state.docs[key];
              return (
                <motion.button
                  variants={staggerItem}
                  key={d.name}
                  onClick={() => setDoc(key, !isReady)}
                  data-testid={`doc-item-${i}`}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-[border-color,background-color] duration-300 ${isReady ? 'border-success/40 bg-success/5' : 'border-border bg-white hover:border-pine/30'}`}
                >
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isReady ? 'bg-success text-white' : 'bg-muted text-sage'}`}>
                    {isReady ? <CheckCircle2 size={17} /> : <FileText size={16} />}
                  </span>
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={`font-display text-[15px] font-bold ${isReady ? 'text-ink' : 'text-ink'}`}>{d.name}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${isReady ? 'bg-success/15 text-[#1d7268]' : 'bg-warning/20 text-[#8a6d1f]'}`}>
                        {isReady ? 'Ready' : 'Need to prepare'}
                      </span>
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-sage"><strong className="text-ink/70">Why it's needed:</strong> {d.purpose}</span>
                  </span>
                </motion.button>
              );
            })}
          </Stagger>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={`/schemes/${scheme.id}/calculator`} className="btn-primary" data-testid="docs-next-calc">Next — can I afford it? <ArrowRight size={15} /></Link>
            <Link to="/applications" className="btn-ghost" data-testid="docs-next-apply">Prepare my applications</Link>
          </div>
        </Reveal>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <div className="card-premium border-warning/40 bg-warning/10 p-6">
              <p className="flex items-center gap-2 font-display text-sm font-bold text-[#7a5f18]"><Info size={15} /> Informational checklist only</p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#7a5f18]">
                This platform does <strong>not</strong> collect or upload documents. You carry the originals to your
                channel partner — the checklist just makes sure you never arrive missing one.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <TrustNote tone="ok">Documents fetched through DigiLocker during verification are already trusted by most partners — fewer originals to carry.</TrustNote>
          </Reveal>
        </aside>
      </section>
    </PageWrap>
  );
}
