import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, AlertTriangle, Info, BadgeCheck, Clock3, ExternalLink,
  CheckCircle2, HelpCircle, XCircle, Mic,
} from 'lucide-react';
import { JOURNEY, daysSince, fmtDate, inr } from '../data/mock';
import { CountUp, EASE } from './motion';

export function MatchRing({ score = 0, size = 76, stroke = 6, dark = false }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} data-testid="match-ring">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dark ? 'rgba(244,241,234,0.18)' : '#E5E0D8'} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={score >= 80 ? '#2A9D8F' : score >= 60 ? '#E9C46A' : '#E76F51'}
          strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - score / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <CountUp to={score} suffix="%" className={`font-display font-extrabold ${dark ? 'text-sand' : 'text-ink'}`} duration={1.4} />
      </div>
    </div>
  );
}

export function FreshnessBadge({ iso, warnAfter = 90 }) {
  const fresh = (Date.now() - new Date(iso).getTime()) / 86400000 <= warnAfter;
  return (
    <span
      data-testid="freshness-badge"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
        fresh ? 'border-success/30 bg-success/10 text-[#1d7268]' : 'border-warning/50 bg-warning/15 text-[#8a6d1f]'
      }`}
    >
      {fresh ? <BadgeCheck size={13} /> : <Clock3 size={13} />}
      {fresh ? `Verified ${fmtDate(iso)}` : `Last verified: ${daysSince(iso)}`}
    </span>
  );
}

const ELIG = {
  likely: { label: 'Likely Eligible', Icon: CheckCircle2, cls: 'border-success/40 bg-success/10 text-[#1d7268]' },
  notmet: { label: 'Criteria Not Met', Icon: XCircle, cls: 'border-destructive/30 bg-destructive/10 text-destructive' },
  verify: { label: 'Further Verification Required', Icon: HelpCircle, cls: 'border-warning/50 bg-warning/15 text-[#8a6d1f]' },
};

export function EligibilityBadge({ status, large = false }) {
  const s = ELIG[status] || ELIG.verify;
  return (
    <span
      data-testid={`eligibility-badge-${status}`}
      className={`inline-flex items-center gap-2 rounded-full border font-semibold ${s.cls} ${large ? 'px-5 py-2 text-sm' : 'px-3 py-1 text-[11px]'}`}
    >
      <s.Icon size={large ? 16 : 13} />
      {s.label}
    </span>
  );
}

export function ExtBadge({ name }) {
  return (
    <span data-testid={`external-badge-${name.toLowerCase().replace(/\s/g, '-')}`} className="inline-flex items-center gap-1.5 rounded-full border border-pine/20 bg-sand px-3 py-1 text-[11px] font-semibold text-pine">
      <ExternalLink size={11} />
      {name} · External service
    </span>
  );
}

export function TrustNote({ children, tone = 'info' }) {
  const tones = {
    info: { Icon: Info, cls: 'border-pine/15 bg-sand text-pine' },
    warn: { Icon: AlertTriangle, cls: 'border-warning/50 bg-warning/10 text-[#7a5f18]' },
    ok: { Icon: ShieldCheck, cls: 'border-success/30 bg-success/10 text-[#1d7268]' },
  };
  const t = tones[tone];
  return (
    <div data-testid="trust-note" className={`flex items-start gap-3 rounded-xl border p-4 text-[13px] leading-relaxed ${t.cls}`}>
      <t.Icon size={16} className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

export function JourneyStepper({ current = 'profile' }) {
  const idx = Math.max(0, JOURNEY.findIndex((j) => j.id === current));
  return (
    <div data-testid="journey-stepper" className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max items-center gap-1.5">
        {JOURNEY.map((j, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div key={j.id} className="flex items-center gap-1.5">
              <Link
                to={j.path}
                data-testid={`stepper-${j.id}`}
                className="group flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-pine/5"
                title={j.label}
              >
                <motion.span
                  initial={false}
                  animate={{ scale: active ? 1.08 : 1 }}
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300 ${
                    done ? 'bg-pine text-white' : active ? 'bg-clay text-white' : 'bg-muted text-sage'
                  }`}
                >
                  {done ? <CheckCircle2 size={14} /> : i + 1}
                </motion.span>
                <span className={`hidden text-[11px] font-semibold md:block ${active ? 'text-ink' : 'text-sage'}`}>{j.label}</span>
              </Link>
              {i < JOURNEY.length - 1 && <span className={`h-px w-3 ${i < idx ? 'bg-pine' : 'bg-border'}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Waveform({ active, bars = 26, className = '' }) {
  return (
    <div className={`flex h-14 items-center justify-center gap-1 ${className}`} data-testid="voice-waveform" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-1 rounded-full ${active ? 'animate-wave bg-clay' : 'bg-pine/20'}`}
          style={{ height: `${28 + Math.sin(i * 0.7) * 22 + (i % 5) * 3}px`, animationDelay: `${i * 0.055}s`, transform: active ? undefined : 'scaleY(0.3)' }}
        />
      ))}
    </div>
  );
}

export function SchemeCard({ scheme, rank, action }) {
  return (
    <motion.article
      data-testid={`scheme-card-${scheme.id}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="card-premium group relative flex flex-col gap-5 p-6"
    >
      {rank === 0 && (
        <span className="absolute -top-3 left-6 rounded-full bg-pine px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
          Recommended for you
        </span>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-1.5">{scheme.tag}</p>
          <h3 className="font-display text-lg font-bold leading-snug">{scheme.name}</h3>
          <p className="mt-0.5 text-xs text-sage">{scheme.ministry}</p>
        </div>
        <MatchRing score={scheme.match} size={70} stroke={6} />
      </div>
      <p className="text-sm leading-relaxed text-sage">{scheme.tagline}</p>
      <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sage">Loan up to</p>
          <p className="num font-display text-base font-bold text-ink">{inr(scheme.maxLoan)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sage">Interest</p>
          <p className="num font-display text-base font-bold text-ink">{scheme.rate}% p.a.</p>
        </div>
      </div>
      <FreshnessBadge iso={scheme.lastVerified} />
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <Link to={`/schemes/${scheme.id}`} data-testid={`scheme-details-${scheme.id}`} className="btn-primary !h-10 !px-5 !text-[13px]">View details</Link>
        <Link to={`/schemes/${scheme.id}/why`} data-testid={`scheme-why-${scheme.id}`} className="btn-ghost !h-10 !px-5 !text-[13px]">Why this scheme?</Link>
        {action}
      </div>
    </motion.article>
  );
}

export function PageHeader({ eyebrow, title, desc, step, children }) {
  return (
    <header className="container-x pt-28 lg:pt-36">
      <div className="flex flex-col gap-6 border-b border-border pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl">{title}</h1>
          {desc && <p className="mt-4 text-base leading-relaxed text-sage">{desc}</p>}
        </div>
        {children}
      </div>
      {step && <div className="mt-6"><JourneyStepper current={step} /></div>}
    </header>
  );
}
