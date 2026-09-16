import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Mic, BadgeCheck, Quote, ShieldCheck, Sparkles, Calculator, FileCheck, MapPin } from 'lucide-react';
import { IMG, SCHEMES, STORIES } from '../data/mock';
import { PageWrap, MaskReveal, Reveal, Stagger, staggerItem, CountUp, EASE } from '../components/motion';
import { SchemeCard, TrustNote, FreshnessBadge, MatchRing } from '../components/widgets';

const MARQUEE = ['PM Vishwakarma', 'PM Mudra Yojana', 'PMEGP', 'Stand-Up India', 'PM SVANidhi', 'DAY-NRLM'];

function Hero() {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const cardY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  return (
    <section ref={ref} className="grain relative overflow-hidden bg-cream pt-28 lg:pt-40">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-clay/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-52 top-64 h-[480px] w-[480px] rounded-full bg-pine/10 blur-3xl" />

      <div className="container-x relative grid items-center gap-14 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28">
        <div>
          <Reveal delay={0.05} y={14}>
            <p className="eyebrow mb-6 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-clay" />
              Smart India Hackathon · 09-2 · Beneficiary-first
            </p>
          </Reveal>
          <MaskReveal
            className="font-display text-[44px] font-extrabold leading-[1.02] text-ink sm:text-6xl lg:text-[76px]"
            lines={[
              <>Government support,</>,
              <>finally speaks</>,
              <span className="text-pine">your language.</span>,
            ]}
          />
          <Reveal delay={0.55}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-sage sm:text-lg">
              One profile. Schemes ranked for you, explained in plain words, with honest numbers —
              and a guided path from <em className="not-italic font-semibold text-ink">“I need help”</em> to{' '}
              <em className="not-italic font-semibold text-ink">“I know exactly what to do next.”</em>
            </p>
          </Reveal>
          <Reveal delay={0.7}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button onClick={() => navigate('/profile')} className="btn-primary" data-testid="hero-start-btn">
                Start my journey <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/voice')} className="btn-ghost" data-testid="hero-voice-btn">
                <Mic size={16} className="text-clay" /> Speak instead — हिन्दी · मराठी
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.85}>
            <div className="mt-10 flex items-center gap-6 text-xs text-sage">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-success" /> Indicative, never “approved”</span>
              <span className="hidden items-center gap-1.5 sm:flex"><BadgeCheck size={14} className="text-success" /> Freshness always visible</span>
            </div>
          </Reveal>
        </div>

        <div className="relative">
          <Reveal delay={0.35} y={40}>
            <div className="img-frame relative aspect-[4/5] max-h-[560px] w-full shadow-[0_40px_80px_-30px_rgb(10,59,44,0.45)]">
              <motion.img
                src={IMG.proMan}
                alt="Indian man planning to launch his own technology business"
                style={{ y: imgY, scale: 1.15 }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine/50 via-transparent to-transparent" />
            </div>
          </Reveal>
          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: EASE }}
            className="card-premium absolute -bottom-6 -left-4 flex items-center gap-4 p-4 pr-6 sm:-left-10"
            data-testid="hero-match-card"
          >
            <MatchRing score={94} size={64} stroke={6} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sage">Top match · PM Vishwakarma</p>
              <p className="font-display text-sm font-bold text-ink">94% match for Anita</p>
              <p className="mt-0.5 text-[11px] text-sage">Match score is suitability — not approval.</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: EASE }}
            className="card-premium absolute -right-3 top-8 p-3 sm:-right-8"
          >
            <FreshnessBadge iso="2026-07-02" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden border-y border-pine/15 bg-pine py-4" data-testid="scheme-marquee">
      <div className="flex w-max animate-marquee items-center gap-10">
        {row.map((s, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-sm font-semibold uppercase tracking-[0.24em] text-sand/80">
            {s}
            <Sparkles size={13} className="text-clay" />
          </span>
        ))}
      </div>
    </div>
  );
}

const CHAPTERS = [
  { n: '01', icon: Sparkles, title: 'Tell us about you — once', desc: 'Your profile is created once and reused everywhere: recommendations, eligibility, applications, partner matching. DigiLocker and Udyam verification fill it for you.', to: '/profile', cta: 'Build my profile' },
  { n: '02', icon: FileCheck, title: 'See what fits — and why', desc: 'Schemes are ranked against your situation with a match score and honest reasoning. “Why this scheme?” explains every recommendation.', to: '/schemes', cta: 'See recommendations' },
  { n: '03', icon: Calculator, title: 'Know before you commit', desc: 'Estimated EMI, remaining income and a plain Comfortable / High Burden read — so a loan never surprises you later.', to: '/schemes/pm-vishwakarma/calculator', cta: 'Try the calculator' },
  { n: '04', icon: MapPin, title: 'Apply, connect, grow', desc: 'Prepare multiple applications from one profile, find the right channel partner near you, meet domain mentors, and step toward ONDC commerce.', to: '/connect', cta: 'Find partners' },
];

export default function Home() {
  const top = [...SCHEMES].sort((a, b) => b.match - a.match).slice(0, 3);
  return (
    <PageWrap>
      <Hero />
      <Marquee />

      <section className="container-x grid grid-cols-2 gap-6 py-14 lg:grid-cols-4" data-testid="home-stats">
        {[
          { to: 6, suffix: '', label: 'national schemes mapped end-to-end' },
          { to: 13, suffix: '', label: 'guided steps, zero guesswork' },
          { to: 3, suffix: '', label: 'voice languages — EN · हिं · मरा' },
          { to: 4, suffix: '', label: 'external ecosystems connected' },
        ].map((s, i) => (
          <Reveal key={i} delay={i * 0.08} className="border-l-2 border-clay/50 pl-5">
            <CountUp to={s.to} className="font-display text-4xl font-extrabold text-pine lg:text-5xl" />
            <p className="mt-1.5 text-[13px] leading-snug text-sage">{s.label}</p>
          </Reveal>
        ))}
      </section>

      <section className="container-x py-10 lg:py-16">
        <Reveal>
          <p className="eyebrow mb-3">The manifesto</p>
          <h2 className="max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Don’t learn the government system. <span className="text-clay">Let the system learn you.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.06} className="group relative bg-white p-8 transition-colors duration-300 hover:bg-sand lg:p-12">
              <div className="flex items-start justify-between">
                <span className="chapter-num text-6xl lg:text-7xl">{c.n}</span>
                <c.icon size={22} className="text-clay" />
              </div>
              <h3 className="mt-6 font-display text-xl font-bold lg:text-2xl">{c.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-sage">{c.desc}</p>
              <Link to={c.to} data-testid={`chapter-${c.n}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-pine transition-colors group-hover:text-clay">
                {c.cta} <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand py-16 lg:py-24">
        <div className="container-x">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">Ranked for Anita · Pune</p>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Your top scheme matches</h2>
            </div>
            <Link to="/schemes" className="btn-ghost" data-testid="home-all-schemes">Compare all schemes <ArrowRight size={15} /></Link>
          </Reveal>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {top.map((s, i) => (
              <motion.div variants={staggerItem} key={s.id}>
                <SchemeCard scheme={s} rank={i} />
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <Reveal>
          <div className="img-frame relative aspect-[4/3] shadow-[0_30px_60px_-30px_rgb(10,59,44,0.4)]">
            <img src={IMG.womanOffice} alt="Indian woman entrepreneur organising her business paperwork" loading="lazy" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow mb-3">Trust, by design</p>
            <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">We say “likely”.<br />Never “approved”.</h2>
          </Reveal>
          <div className="mt-8 space-y-4">
            <Reveal delay={0.1}><TrustNote tone="ok"><strong>Likely Eligible</strong> means your information appears to meet the criteria we hold. The final decision always belongs to the authority or channel partner.</TrustNote></Reveal>
            <Reveal delay={0.18}><TrustNote><strong>94% match</strong> is suitability against your profile — it is not a 94% chance of approval.</TrustNote></Reveal>
            <Reveal delay={0.26}><TrustNote tone="warn"><strong>Last verified</strong> dates tell you how fresh our information is. Always confirm details with your channel partner before you act.</TrustNote></Reveal>
          </div>
        </div>
      </section>

      <section className="container-x pb-8 lg:pb-16">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">Seller stories</p>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">People like you, further ahead</h2>
          </div>
          <Link to="/stories" className="btn-ghost" data-testid="home-all-stories">Read all stories <ArrowRight size={15} /></Link>
        </Reveal>
        <Stagger className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {STORIES.map((s) => (
            <motion.div variants={staggerItem} key={s.id}>
              <Link to={`/stories?open=${s.id}`} data-testid={`story-teaser-${s.id}`} className="card-premium group block overflow-hidden p-0">
                <div className="img-frame aspect-[4/3] rounded-none">
                  <img src={s.image} alt={`${s.seller} — ${s.business}`} loading="lazy" className="transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-clay">{s.scheme}</p>
                  <p className="mt-2 flex gap-2 text-sm font-semibold leading-snug text-ink"><Quote size={13} className="mt-0.5 shrink-0 text-clay" />{s.quote}</p>
                  <p className="mt-3 text-xs text-sage">{s.seller} · {s.location}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </section>

      <section className="container-x">
        <Reveal className="grain relative overflow-hidden rounded-3xl bg-pine px-8 py-14 text-center text-sand lg:py-20">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-clay/25 blur-3xl" />
          <p className="eyebrow !text-sand/60">Begin where you are</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Your scheme is already out there. Let’s find it together.
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/profile" className="btn-accent" data-testid="cta-start-bottom">Start with my profile <ArrowRight size={16} /></Link>
            <Link to="/voice" className="btn-ghost !border-sand/40 !text-sand hover:!bg-sand/10" data-testid="cta-voice-bottom"><Mic size={16} /> Use your voice</Link>
          </div>
        </Reveal>
      </section>
    </PageWrap>
  );
}
