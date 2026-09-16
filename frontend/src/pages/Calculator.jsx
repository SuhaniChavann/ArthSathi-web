import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingDown, TrendingUp, Wallet, CalendarClock, Percent } from 'lucide-react';
import { IMG, inr } from '../data/mock';
import { PageWrap, Reveal, LiveNumber } from '../components/motion';
import { PageHeader, TrustNote, FreshnessBadge } from '../components/widgets';
import { SchemeNav, useScheme } from '../components/SchemeNav';
import { useApp } from '../context/AppContext';

function emi(p, annualRate, years) {
  const r = annualRate / 1200;
  const n = years * 12;
  if (!p || !n) return 0;
  if (r === 0) return p / n;
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function Calculator() {
  const scheme = useScheme();
  const { state } = useApp();
  const [income, setIncome] = useState(state.profile.monthlyIncome);
  const [oblig, setOblig] = useState(state.profile.existingEmi);
  const [loan, setLoan] = useState(Math.min(state.requirement.loanAmount, scheme.maxLoan));
  const [rate, setRate] = useState(scheme.rate);
  const [years, setYears] = useState(scheme.tenureYears);

  const res = useMemo(() => {
    const e = Math.round(emi(loan, rate, years));
    const remaining = income - oblig - e;
    const disposable = income - oblig;
    const ratio = disposable > 0 ? e / disposable : 1;
    const comfortable = remaining >= 0 && ratio <= 0.4;
    return { e, remaining, comfortable };
  }, [income, oblig, loan, rate, years]);

  const Field = ({ label, value, onChange, prefix, suffix, schemeParam }) => (
    <label className="block" data-testid={`calc-field-${label.toLowerCase().replace(/\s|\(|\)|%/g, '-')}`}>
      <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-sage">
        {label}
        {schemeParam && <span className="rounded-full bg-sand px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-pine">From scheme</span>}
      </span>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-pine">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`num h-13 w-full rounded-xl border border-border bg-white py-3.5 font-display text-base font-bold outline-none transition-[border-color,box-shadow] focus:border-pine focus:ring-2 focus:ring-pine/15 ${prefix ? 'pl-9 pr-4' : 'px-4'} ${suffix ? 'pr-16' : ''}`}
        />
        {suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-sage">{suffix}</span>}
      </div>
    </label>
  );

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Step 8 · Know before you commit"
        title="Can you afford this monthly payment?"
        desc={`Tuned to ${scheme.name} parameters. Every number here is an estimate from what you enter — not an official offer.`}
        step="financial"
      >
        <FreshnessBadge iso={scheme.lastVerified} />
      </PageHeader>
      <SchemeNav />

      <section className="container-x mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
        <Reveal className="card-premium p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold">Your numbers</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Monthly income" value={income} onChange={setIncome} prefix="₹" />
            <Field label="Existing monthly EMIs" value={oblig} onChange={setOblig} prefix="₹" />
            <Field label="Loan you want" value={loan} onChange={setLoan} prefix="₹" />
            <Field label="Interest rate (% p.a.)" value={rate} onChange={setRate} suffix="% p.a." schemeParam />
            <Field label="Repayment period" value={years} onChange={setYears} suffix="years" schemeParam />
            <div className="flex items-end">
              <div className="w-full rounded-xl bg-sand p-3.5 text-[13px] text-pine">
                <CalendarClock size={14} className="mr-1.5 inline" />
                Moratorium: <strong>{scheme.moratoriumMonths ? `${scheme.moratoriumMonths} months` : 'none'}</strong> <span className="text-sage">(scheme info)</span>
              </div>
            </div>
          </div>
          <p className="mt-5 text-xs text-sage">Change any number — the result updates instantly.</p>

          <div className="mt-8 overflow-hidden rounded-2xl img-frame aspect-[21/7] hidden sm:block">
            <img src={IMG.womanDesk} alt="Woman reviewing her business finances" loading="lazy" />
          </div>
        </Reveal>

        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Reveal className={`grain relative overflow-hidden rounded-3xl p-7 text-sand ${res.comfortable ? 'bg-pine' : 'bg-[#5c3a17]'}`} data-testid="calc-result">
            <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-clay/25 blur-3xl" />
            <p className="eyebrow !text-sand/60">Estimated monthly payment (EMI)</p>
            <p className="mt-2 font-display text-5xl font-extrabold">
              <LiveNumber value={res.e} prefix="₹" />
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-sand/15 pt-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sand/60">Income left after EMI</p>
                <p className="num mt-1 font-display text-xl font-bold"><LiveNumber value={res.remaining} prefix="₹" /></p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sand/60">Affordability</p>
                <p className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-sm font-bold ${res.comfortable ? 'bg-success/25 text-[#a8e6cf]' : 'bg-warning/25 text-[#ffe3a3]'}`} data-testid="affordability-status">
                  {res.comfortable ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {res.comfortable ? 'Comfortable' : 'High Burden'}
                </p>
              </div>
            </div>
          </Reveal>

          {!res.comfortable && (
            <Reveal>
              <div className="card-premium border-warning/50 bg-warning/10 p-5" data-testid="calc-suggestions">
                <p className="flex items-center gap-2 text-sm font-bold text-[#7a5f18]"><Wallet size={15} /> Ways to ease the burden</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-[#7a5f18]">
                  <li>Consider a lower loan amount</li>
                  <li>Consider a longer repayment period, where the scheme permits</li>
                </ul>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.05}>
            <TrustNote>
              <Percent size={13} className="mr-1 inline" /> These are <strong>estimates calculated from your inputs</strong> and
              scheme parameters. Actual terms are decided by the lender.
            </TrustNote>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-2.5">
            <Link to="/applications" className="btn-primary w-full" data-testid="calc-next-apply">I understand the cost — apply <ArrowRight size={15} /></Link>
            <Link to={`/schemes/${scheme.id}/documents`} className="btn-ghost w-full" data-testid="calc-back-docs">Back to documents</Link>
          </Reveal>
        </div>
      </section>
    </PageWrap>
  );
}
