import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Mic, GitCompareArrows, X } from 'lucide-react';
import { SCHEMES, inr, IMG } from '../data/mock';
import { PageWrap, Reveal, Stagger, staggerItem } from '../components/motion';
import { PageHeader, SchemeCard, TrustNote, FreshnessBadge } from '../components/widgets';
import { useApp } from '../context/AppContext';

const FILTERS = ['All', 'Loans', 'Subsidy', 'Women', 'Artisans', 'Vendors'];

export default function Schemes() {
  const { state, toggleScheme } = useApp();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [compare, setCompare] = useState([]);

  const ranked = useMemo(() => [...SCHEMES].sort((a, b) => b.match - a.match), []);
  const list = useMemo(() => {
    let l = ranked;
    if (q.trim()) {
      const t = q.toLowerCase();
      l = l.filter((s) => `${s.name} ${s.tag} ${s.ministry} ${s.tagline}`.toLowerCase().includes(t));
    }
    if (filter === 'Women') l = l.filter((s) => /women|woman|स/i.test(s.tagline + s.tag));
    if (filter === 'Artisans') l = l.filter((s) => /artisan|craft|trade/i.test(s.tagline + s.tag));
    if (filter === 'Vendors') l = l.filter((s) => /vendor/i.test(s.tagline + s.tag));
    if (filter === 'Subsidy') l = l.filter((s) => /subsidy|subvention/i.test(s.subsidy));
    if (filter === 'Loans') l = l.filter((s) => s.maxLoan >= 50000);
    return l;
  }, [ranked, q, filter]);

  const toggleCompare = (id) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c));

  const cmpSchemes = SCHEMES.filter((s) => compare.includes(s.id));

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Step 4 · Ranked for your profile"
        title="Schemes that may fit you."
        desc={`Based on ${state.profile.business} in ${state.profile.district} and a need of ${inr(state.requirement.loanAmount)}. Ranked by suitability — never by approval chances.`}
        step="recommend"
      >
        <button
          onClick={() => setCompare([])}
          className="btn-ghost !h-11"
          data-testid="compare-clear"
          style={{ display: compare.length ? 'inline-flex' : 'none' }}
        >
          <X size={15} /> Clear comparison
        </button>
      </PageHeader>

      <section className="container-x mt-10">
        <Reveal className="card-premium flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a scheme by name, purpose or ministry…"
              className="h-12 w-full rounded-full border border-border bg-cream pl-11 pr-4 text-sm outline-none transition-[border-color,box-shadow] focus:border-pine focus:ring-2 focus:ring-pine/15"
              data-testid="scheme-search-input"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={15} className="text-sage" />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-testid={`filter-${f.toLowerCase()}`}
                className={`h-9 rounded-full border px-4 text-xs font-semibold transition-colors ${filter === f ? 'border-pine bg-pine text-white' : 'border-border text-sage hover:border-pine/40'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-sand px-4 py-3 text-xs text-pine">
            <span><strong>{list.length}</strong> schemes matched to your profile · match score = suitability, not approval probability</span>
            <Link to="/voice" className="hidden items-center gap-1.5 font-bold text-clay sm:flex" data-testid="schemes-voice-link"><Mic size={13} /> Prefer voice?</Link>
          </div>
        </Reveal>

        {list.length === 0 ? (
          <Reveal className="card-premium mt-8 p-12 text-center" data-testid="schemes-empty">
            <p className="font-display text-xl font-bold">We couldn't find a suitable match with that search.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-sage">Try a different keyword, or review your requirement so we can widen the search.</p>
            <Link to="/requirements" className="btn-primary mt-6" data-testid="schemes-review-req">Review my requirement</Link>
          </Reveal>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {list.map((s, i) => {
              const rank = ranked.findIndex((r) => r.id === s.id);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: Math.min(i * 0.06, 0.36), ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <SchemeCard
                    scheme={s}
                    rank={rank === 0 && filter === 'All' && !q ? 0 : -1}
                    action={
                      <button
                        onClick={() => toggleCompare(s.id)}
                        data-testid={`compare-toggle-${s.id}`}
                        className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-[13px] font-semibold transition-colors ${compare.includes(s.id) ? 'border-clay bg-clay text-white' : 'border-border text-sage hover:border-clay/50 hover:text-clay'}`}
                      >
                        <GitCompareArrows size={14} /> {compare.includes(s.id) ? 'Added' : 'Compare'}
                      </button>
                    }
                  />
                  <button
                    onClick={() => toggleScheme(s.id)}
                    data-testid={`shortlist-${s.id}`}
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${state.selected.includes(s.id) ? 'bg-success text-white' : 'bg-muted text-sage hover:bg-pine hover:text-white'}`}
                    title="Shortlist for application"
                  >
                    {state.selected.includes(s.id) ? 'Shortlisted' : 'Shortlist'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {cmpSchemes.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="card-premium mt-12 overflow-hidden"
              data-testid="comparison-table"
            >
              <div className="border-b border-border bg-sand px-6 py-4">
                <h2 className="font-display text-lg font-bold">Side-by-side comparison</h2>
                <p className="text-xs text-sage">Only documented scheme parameters are compared.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="p-4 text-xs font-semibold uppercase tracking-[0.12em] text-sage">Parameter</th>
                      {cmpSchemes.map((s) => <th key={s.id} className="p-4 font-display font-bold">{s.name}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ['Match score', (s) => `${s.match}%`],
                      ['Loan amount', (s) => s.loanWindow],
                      ['Interest rate', (s) => `${s.rate}% p.a.`],
                      ['Tenure', (s) => `${s.tenureYears} years`],
                      ['Moratorium', (s) => s.moratoriumMonths ? `${s.moratoriumMonths} months` : 'None'],
                      ['Benefits / subsidy', (s) => s.subsidy],
                      ['Location', (s) => s.location],
                    ].map(([label, fn]) => (
                      <tr key={label}>
                        <td className="p-4 text-xs font-semibold uppercase tracking-[0.12em] text-sage">{label}</td>
                        {cmpSchemes.map((s) => <td key={s.id} className="num p-4 align-top text-[13px] font-medium">{fn(s)}</td>)}
                      </tr>
                    ))}
                    <tr>
                      <td className="p-4 text-xs font-semibold uppercase tracking-[0.12em] text-sage">Freshness</td>
                      {cmpSchemes.map((s) => <td key={s.id} className="p-4"><FreshnessBadge iso={s.lastVerified} /></td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Reveal className="mt-12">
          <TrustNote>
            <strong>Recommendations are not approvals.</strong> A high match score means a scheme’s documented rules fit your
            profile well. The final decision always rests with the concerned authority or channel partner.
          </TrustNote>
        </Reveal>

        <div className="mt-8 overflow-hidden rounded-3xl">
          <div className="img-frame aspect-[21/6] hidden lg:block">
            <img src={IMG.womanDesk} alt="Woman entrepreneur comparing options at her desk" loading="lazy" />
          </div>
        </div>
      </section>
    </PageWrap>
  );
}
