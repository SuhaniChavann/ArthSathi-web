import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Landmark, MessageCircle, CalendarClock, ExternalLink, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { PARTNERS, MENTORS, ADPLIST, IMG } from '../data/mock';
import { PageWrap, Reveal, Stagger, staggerItem } from '../components/motion';
import { PageHeader, TrustNote, ExtBadge } from '../components/widgets';

const TYPE_CLS = { Bank: 'bg-pine text-white', NBFC: 'bg-clay text-white', MFI: 'bg-warning text-ink', SCA: 'bg-success text-white' };

function PartnerMap({ active, setActive }) {
  return (
    <div className="grain relative h-[380px] overflow-hidden rounded-3xl bg-pine lg:h-full lg:min-h-[560px]" data-testid="partner-map" role="img" aria-label="Stylised map of Pune showing participating channel partners">
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 600 560" preserveAspectRatio="none">
        <path d="M-20 180 C 120 140, 240 240, 400 190 S 620 260, 640 220" stroke="#F4F1EA" strokeWidth="10" fill="none" opacity="0.25" />
        <path d="M120 -20 C 160 140, 90 300, 200 420 S 260 560, 240 600" stroke="#F4F1EA" strokeWidth="7" fill="none" opacity="0.18" />
        <path d="M-20 400 C 180 360, 320 460, 640 380" stroke="#F4F1EA" strokeWidth="6" fill="none" opacity="0.15" />
        <path d="M420 -20 C 380 160, 480 300, 420 580" stroke="#F4F1EA" strokeWidth="5" fill="none" opacity="0.12" />
        <path d="M-20 90 C 200 60, 380 120, 640 70" stroke="#2A9D8F" strokeWidth="14" fill="none" opacity="0.22" />
      </svg>
      <span className="absolute left-[52%] top-[46%] flex flex-col items-center" aria-hidden>
        <span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold text-pine shadow-lg">You · Shivajinagar</span>
        <span className="mt-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-clay shadow" />
      </span>
      {PARTNERS.map((p) => (
        <button
          key={p.id}
          onClick={() => setActive(p.id)}
          data-testid={`map-pin-${p.id}`}
          aria-label={`${p.name}, ${p.distance}`}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y * 0.75 + 8}%` }}
        >
          <span className={`absolute inset-0 rounded-full ${active === p.id ? 'animate-pin-ping bg-clay' : 'group-hover:animate-pin-ping bg-sand/50'}`} />
          <span className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-lg transition-transform duration-300 group-hover:scale-110 ${active === p.id ? 'border-white bg-clay text-white scale-110' : 'border-pine bg-sand text-pine'}`}>
            <Landmark size={15} />
          </span>
          {active === p.id && (
            <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="absolute left-1/2 top-full z-10 mt-2 w-44 -translate-x-1/2 rounded-xl bg-white p-3 text-left shadow-xl">
              <span className="block text-xs font-bold text-ink">{p.name}</span>
              <span className="mt-0.5 block text-[11px] text-sage">{p.type} · {p.distance}</span>
            </motion.span>
          )}
        </button>
      ))}
    </div>
  );
}

function Partners() {
  const [active, setActive] = useState(PARTNERS[0].id);
  const activePartner = useMemo(() => PARTNERS.find((p) => p.id === active), [active]);
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <Reveal><PartnerMap active={active} setActive={setActive} /></Reveal>
      <div className="space-y-4">
        <Stagger className="space-y-4" gap={0.06}>
          {PARTNERS.map((p) => (
            <motion.button
              variants={staggerItem}
              key={p.id}
              onClick={() => setActive(p.id)}
              data-testid={`partner-card-${p.id}`}
              className={`card-premium w-full p-5 text-left transition-[border-color,box-shadow] duration-300 ${active === p.id ? '!border-pine shadow-[0_0_0_2px_#0A3B2C]' : 'hover:border-pine/30'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-[15px] font-bold">{p.name}</h3>
                    {p.recommended && <span className="rounded-full bg-clay/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-clay">Recommended</span>}
                  </div>
                  <p className="mt-1 flex items-center gap-2 text-xs text-sage"><MapPin size={12} /> {p.area} · {p.distance} away</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${TYPE_CLS[p.type]}`}>{p.type}</span>
              </div>
              <p className="mt-3 text-xs text-sage">Supports: {p.schemes.length} of your schemes · <span className="font-semibold text-ink">{p.capacity}</span></p>
            </motion.button>
          ))}
        </Stagger>
        {activePartner && (
          <Reveal className="card-premium border-pine/20 bg-sand p-5" data-testid="partner-why">
            <p className="eyebrow mb-2 flex items-center gap-1.5"><Navigation size={12} /> Why {activePartner.recommended ? 'this partner' : 'it may fit'}</p>
            <ul className="space-y-1.5 text-[13px] text-pine">
              {activePartner.reasons.map((r) => <li key={r} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />{r}</li>)}
            </ul>
            <button
              onClick={() => toast('Approach this partner', { description: `${activePartner.name} — carry your prepared documents. Final processing happens at their desk.` })}
              className="btn-primary mt-4 w-full !h-11"
              data-testid="partner-approach-btn"
            >
              View / approach partner <ExternalLink size={14} />
            </button>
          </Reveal>
        )}
        <TrustNote tone="info">Partner suggestions are routing help based on proximity, scheme participation and reported capacity — not a guarantee of service or sanction.</TrustNote>
      </div>
    </div>
  );
}

function Mentors() {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <Stagger className="grid gap-5 sm:grid-cols-2">
          {MENTORS.map((m) => (
            <motion.div variants={staggerItem} key={m.id} className="card-premium group p-6" data-testid={`mentor-card-${m.id}`}>
              <div className="flex items-center gap-4">
                <div className="img-frame h-14 w-14 rounded-full border-2 border-sand">
                  <img src={m.avatar} alt={m.name} loading="lazy" />
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-bold">{m.name}</h3>
                  <p className="text-xs font-semibold text-clay">{m.domain}</p>
                </div>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-sage"><strong className="text-ink/80">Expertise:</strong> {m.expertise}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-sage"><strong className="text-ink/80">Experience:</strong> {m.experience}</p>
              <button
                onClick={() => toast.success(`Request sent to ${m.name}`, { description: 'They typically respond within 2 working days.' })}
                className="btn-ghost mt-5 w-full !h-11 !text-[13px]"
                data-testid={`mentor-connect-${m.id}`}
              >
                <MessageCircle size={14} /> Connect / message
              </button>
            </motion.div>
          ))}
        </Stagger>
        <Reveal className="img-frame hidden self-start overflow-hidden rounded-3xl lg:block">
          <img src={IMG.hero} alt="Experienced Indian shop owner who mentors new entrepreneurs" className="aspect-[3/4]" loading="lazy" />
        </Reveal>
      </div>
      <TrustNote>Domain mentors are matched to your business field — people who have actually run tailoring units, boutiques and MSME loan files.</TrustNote>
    </div>
  );
}

function AdpList() {
  return (
    <div className="space-y-8">
      <div className="card-premium flex flex-col gap-4 border-clay/30 bg-clay/5 p-6 sm:flex-row sm:items-center sm:justify-between" data-testid="adplist-banner">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-lg font-bold">Broader mentoring via ADPList</h3>
            <ExtBadge name="ADPList" />
          </div>
          <p className="mt-1.5 max-w-xl text-sm text-sage">Beyond local domain experts — career, strategy, tech and marketing mentors from ADPList's global community. Booking happens on their platform.</p>
        </div>
      </div>
      <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {ADPLIST.map((m) => (
          <motion.div variants={staggerItem} key={m.id} className="card-premium p-6" data-testid={`adplist-card-${m.id}`}>
            <div className="flex items-center gap-4">
              <div className="img-frame h-14 w-14 rounded-full border-2 border-sand">
                <img src={m.avatar} alt={m.name} loading="lazy" />
              </div>
              <div>
                <h3 className="font-display text-[15px] font-bold">{m.name}</h3>
                <p className="text-xs font-semibold text-pine">{m.category}</p>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-sage">{m.detail}</p>
            <p className="mt-1.5 text-xs text-sage">{m.location}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-pine">ADPList Mentor</span>
              <button
                onClick={() => toast('Opening ADPList (external)', { description: `You would now book a session with ${m.name} on adplist.org.` })}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-clay hover:underline"
                data-testid={`adplist-book-${m.id}`}
              >
                <CalendarClock size={13} /> Book session
              </button>
            </div>
          </motion.div>
        ))}
      </Stagger>
    </div>
  );
}

export default function Connect() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'partners';
  const TABS = [
    { id: 'partners', label: 'Channel Partners' },
    { id: 'mentors', label: 'Domain Mentors' },
    { id: 'adplist', label: 'ADPList' },
  ];
  return (
    <PageWrap>
      <PageHeader
        eyebrow="Steps 10–12 · Humans & doorways"
        title="Know where to go, and who can help."
        desc="Find participating banks, SCAs, NBFCs and MFIs near you — then talk to people who have done this before."
        step="partner"
      />
      <section className="container-x mt-10">
        <div className="mb-8 flex w-max items-center gap-1 rounded-full border border-border bg-white p-1.5" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setParams({ tab: t.id })}
              data-testid={`connect-tab-${t.id}`}
              className={`rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors ${tab === t.id ? 'bg-pine text-white' : 'text-sage hover:text-ink'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'partners' && <Partners />}
        {tab === 'mentors' && <Mentors />}
        {tab === 'adplist' && <AdpList />}
      </section>
    </PageWrap>
  );
}
