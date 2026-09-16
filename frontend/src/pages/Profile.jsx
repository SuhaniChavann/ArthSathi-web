import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Pencil, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IMG, inr } from '../data/mock';
import { PageWrap, Reveal } from '../components/motion';
import { PageHeader, ExtBadge, TrustNote } from '../components/widgets';

const FIELDS = [
  { key: 'name', label: 'Full name', type: 'text' },
  { key: 'age', label: 'Age', type: 'number' },
  { key: 'gender', label: 'Gender', type: 'text' },
  { key: 'category', label: 'Social category', type: 'text' },
  { key: 'district', label: 'District', type: 'text' },
  { key: 'state', label: 'State', type: 'text' },
  { key: 'education', label: 'Education', type: 'text' },
  { key: 'business', label: 'Business / work', type: 'text' },
  { key: 'experience', label: 'Years of experience', type: 'number' },
  { key: 'monthlyIncome', label: 'Monthly income (₹)', type: 'number' },
  { key: 'existingEmi', label: 'Existing monthly EMIs (₹)', type: 'number' },
];

export default function Profile() {
  const { state, setProfile } = useApp();
  const navigate = useNavigate();
  const { profile, verified } = state;

  const completion = useMemo(() => {
    const filled = FIELDS.filter((f) => String(profile[f.key] ?? '').trim() !== '').length;
    return Math.round((filled / FIELDS.length) * 100);
  }, [profile]);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Step 1 · Your reusable identity"
        title="Tell us about you — once."
        desc="This profile quietly powers everything: recommendations, eligibility, documents, applications and partner matching. Edit anything; it updates everywhere."
        step="profile"
      />

      <section className="container-x mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
        <Reveal className="card-premium p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="img-frame h-16 w-16 rounded-full border-2 border-sand shadow">
                <img src={IMG.womanDesk} alt="Anita Deshmukh" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">{profile.name}</h2>
                <p className="text-sm text-sage">{profile.business} · {profile.district}, {profile.state}</p>
              </div>
            </div>
            <div className="min-w-[180px]">
              <div className="flex items-center justify-between text-[11px] font-semibold text-sage">
                <span>Profile strength</span><span className="num">{completion}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-pine to-success transition-[width] duration-700" style={{ width: `${completion}%` }} data-testid="profile-completion" />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <label key={f.key} className="block" data-testid={`profile-field-${f.key}`}>
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-sage">
                  <Pencil size={11} /> {f.label}
                </span>
                <input
                  type={f.type}
                  value={profile[f.key]}
                  onChange={(e) => setProfile({ [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                  className="h-12 w-full rounded-xl border border-border bg-cream px-4 text-sm font-medium text-ink outline-none transition-[border-color,box-shadow] focus:border-pine focus:ring-2 focus:ring-pine/15"
                />
              </label>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={() => navigate(verified.udyam ? '/requirements' : '/verify')} className="btn-primary" data-testid="profile-continue-btn">
              {verified.udyam ? 'Continue to my requirement' : 'Continue to verification'} <ArrowRight size={16} />
            </button>
          </div>
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.1} className="card-premium overflow-hidden">
            <div className="img-frame aspect-[16/9] rounded-none">
              <img src={IMG.womanDesk} alt="Verified business owner at her desk" loading="lazy" />
            </div>
            <div className="p-6">
              <p className="eyebrow mb-3">Verification status</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-border p-3.5" data-testid="digilocker-status">
                  <div>
                    <p className="text-sm font-bold">DigiLocker</p>
                    <p className="text-xs text-sage">Identity documents</p>
                  </div>
                  {verified.digilocker
                    ? <span className="flex items-center gap-1.5 text-xs font-bold text-success"><BadgeCheck size={15} /> Connected</span>
                    : <span className="text-xs font-semibold text-sage">Not connected</span>}
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border p-3.5" data-testid="udyam-status">
                  <div>
                    <p className="text-sm font-bold">Udyam Registration</p>
                    <p className="text-xs text-sage">Verified business profile</p>
                  </div>
                  {verified.udyam
                    ? <span className="flex items-center gap-1.5 text-xs font-bold text-success"><BadgeCheck size={15} /> Verified</span>
                    : <span className="text-xs font-semibold text-sage">Pending</span>}
                </div>
              </div>
              {!verified.udyam && (
                <button onClick={() => navigate('/verify')} className="btn-accent mt-5 w-full" data-testid="profile-verify-btn">
                  <ShieldCheck size={16} /> Verify with DigiLocker + Udyam
                </button>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <TrustNote>
              DigiLocker and Udyam are <strong>external government services</strong>. With your consent we fetch verified
              information so you type less — you always review before anything is saved.
            </TrustNote>
          </Reveal>
        </div>
      </section>
    </PageWrap>
  );
}
