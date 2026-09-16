import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { inr } from '../data/mock';
import { PageWrap, Reveal } from '../components/motion';
import { PageHeader, TrustNote } from '../components/widgets';

export default function Requirements() {
  const { state, setRequirement } = useApp();
  const navigate = useNavigate();
  const r = state.requirement;

  const submit = () => {
    if (!r.loanAmount || r.loanAmount <= 0) {
      toast.error('Required loan amount', { description: 'Please enter how much money you need.' });
      return;
    }
    toast.success('Requirement saved', { description: 'We are matching schemes against your profile.' });
    navigate('/schemes');
  };

  const NumField = ({ label, k, helper }) => (
    <label className="block" data-testid={`req-field-${k}`}>
      <span className="mb-1.5 block text-xs font-semibold text-sage">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-pine">₹</span>
        <input
          type="number"
          value={r[k]}
          onChange={(e) => setRequirement({ [k]: Number(e.target.value) })}
          className="num h-14 w-full rounded-xl border border-border bg-white pl-9 pr-4 font-display text-lg font-bold text-ink outline-none transition-[border-color,box-shadow] focus:border-pine focus:ring-2 focus:ring-pine/15"
        />
      </div>
      {helper && <span className="mt-1 block text-[11px] text-sage">{helper}</span>}
    </label>
  );

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Step 3 · Tell us what you need"
        title="How much money do you need — and for what?"
        desc="Plain words, three questions. This is all we need to rank schemes for you."
        step="requirement"
      />

      <section className="container-x mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
        <Reveal className="card-premium p-6 sm:p-10">
          <label className="block" data-testid="req-field-purpose">
            <span className="mb-1.5 block text-xs font-semibold text-sage">What do you need it for?</span>
            <textarea
              rows={3}
              value={r.purpose}
              onChange={(e) => setRequirement({ purpose: e.target.value })}
              className="w-full rounded-xl border border-border bg-white p-4 text-sm font-medium text-ink outline-none transition-[border-color,box-shadow] focus:border-pine focus:ring-2 focus:ring-pine/15"
              placeholder="e.g. Expand my boutique — buy industrial sewing machines"
            />
          </label>

          <label className="mt-6 block" data-testid="req-field-business">
            <span className="mb-1.5 block text-xs font-semibold text-sage">Your business / project type</span>
            <input
              type="text"
              value={r.businessType}
              onChange={(e) => setRequirement({ businessType: e.target.value })}
              className="h-14 w-full rounded-xl border border-border bg-white px-4 text-sm font-medium outline-none transition-[border-color,box-shadow] focus:border-pine focus:ring-2 focus:ring-pine/15"
            />
          </label>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <NumField label="Total project cost" k="projectCost" helper="Roughly what the whole plan will cost" />
            <NumField label="Loan you need" k="loanAmount" helper="The part you want to borrow" />
          </div>

          <div className="mt-6 rounded-xl bg-sand p-4 text-sm text-pine" data-testid="req-summary">
            You want to borrow <strong className="num">{inr(r.loanAmount)}</strong> toward a{' '}
            <strong className="num">{inr(r.projectCost)}</strong> plan for <strong>{r.businessType}</strong>.
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={submit} className="btn-primary" data-testid="req-find-btn">Find suitable schemes <ArrowRight size={16} /></button>
            <button onClick={() => navigate('/voice')} className="btn-ghost" data-testid="req-voice-btn"><Mic size={15} className="text-clay" /> Say it instead</button>
          </div>
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.1}><TrustNote tone="info">Everything you enter here is compared against each scheme’s rules — loan limits, purpose, location — to build your ranked list.</TrustNote></Reveal>
          <Reveal delay={0.16}><TrustNote tone="ok">Your profile from the previous step is already attached. Nothing to repeat.</TrustNote></Reveal>
        </div>
      </section>
    </PageWrap>
  );
}
