import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote, X, Send, CheckCircle2, MapPin, Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { STORIES, IMG } from '../data/mock';
import { PageWrap, Reveal, Stagger, staggerItem, EASE } from '../components/motion';
import { PageHeader, TrustNote } from '../components/widgets';
import { useApp } from '../context/AppContext';

export default function Stories() {
  const [params, setParams] = useSearchParams();
  const open = params.get('open');
  const story = useMemo(() => STORIES.find((s) => s.id === open), [open]);
  const { state, setStorySubmitted } = useApp();
  const [form, setForm] = useState({ name: '', business: '', scheme: '', journey: '' });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.journey) {
      toast.error('A few details are missing', { description: 'Please add your name and your journey before submitting.' });
      return;
    }
    setStorySubmitted(true);
    toast.success('Story submitted for review', { description: 'It will appear publicly only after moderation.' });
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Real journeys, real numbers"
        title="Seller stories & reviews."
        desc="Practical experience from beneficiaries who walked this road — what worked, what hurt, and what they would tell you over chai."
        step="stories"
      />

      <section className="container-x mt-12">
        <Stagger className="grid gap-6 md:grid-cols-2" gap={0.09}>
          {STORIES.map((s) => (
            <motion.button
              variants={staggerItem}
              key={s.id}
              onClick={() => setParams({ open: s.id })}
              data-testid={`story-card-${s.id}`}
              className="card-premium group grid overflow-hidden text-left sm:grid-cols-[180px_1fr]"
            >
              <div className="img-frame aspect-[4/3] sm:aspect-auto sm:h-full">
                <img src={s.image} alt={`${s.seller}`} loading="lazy" className="transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-clay">{s.scheme}</p>
                <h3 className="mt-1.5 font-display text-lg font-bold">{s.seller}</h3>
                <p className="flex items-center gap-1.5 text-xs text-sage"><MapPin size={11} /> {s.business} · {s.location}</p>
                <p className="mt-3 flex gap-2 text-[13px] leading-relaxed text-sage"><Quote size={13} className="mt-0.5 shrink-0 text-clay" />{s.quote}</p>
              </div>
            </motion.button>
          ))}
        </Stagger>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_380px]">
          <Reveal className="card-premium p-6 sm:p-10">
            <h2 className="font-display text-2xl font-extrabold">Share your journey</h2>
            <p className="mt-2 text-sm text-sage">Your experience — the hard parts especially — helps the next beneficiary.</p>
            {state.storySubmitted ? (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex items-start gap-4 rounded-2xl border border-success/30 bg-success/5 p-6" data-testid="story-moderation">
                <CheckCircle2 size={26} className="shrink-0 text-success" />
                <div>
                  <p className="font-display font-bold">Submitted for review</p>
                  <p className="mt-1 text-sm text-sage">Your submission has been received and will be reviewed before publication. It is not public yet.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-sage">Your name</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none focus:border-pine focus:ring-2 focus:ring-pine/15" data-testid="story-name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-sage">Business type</span>
                  <input value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none focus:border-pine focus:ring-2 focus:ring-pine/15" data-testid="story-business" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-semibold text-sage">Scheme you used</span>
                  <input value={form.scheme} onChange={(e) => setForm({ ...form, scheme: e.target.value })} className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none focus:border-pine focus:ring-2 focus:ring-pine/15" data-testid="story-scheme" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-semibold text-sage">Your journey, challenges and outcome</span>
                  <textarea rows={4} value={form.journey} onChange={(e) => setForm({ ...form, journey: e.target.value })} className="w-full rounded-xl border border-border p-4 text-sm outline-none focus:border-pine focus:ring-2 focus:ring-pine/15" data-testid="story-journey" />
                </label>
                <button className="btn-primary sm:col-span-2 sm:w-max" data-testid="story-submit-btn"><Send size={15} /> Submit for review</button>
              </form>
            )}
          </Reveal>
          <div className="space-y-6">
            <Reveal><TrustNote tone="info">Stories share real experiences — helpful context, not guaranteed outcomes. Your journey may differ, and that is okay.</TrustNote></Reveal>
            <Reveal delay={0.08} className="img-frame overflow-hidden rounded-3xl">
              <img src={IMG.vendorStreet} alt="Street vendor arranging colourful goods" className="aspect-[4/3]" loading="lazy" />
            </Reveal>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {story && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-pine/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setParams({})}
            data-testid="story-modal"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
            >
              <div className="img-frame relative aspect-[21/9] rounded-none">
                <img src={story.image} alt={story.seller} />
                <button onClick={() => setParams({})} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow" aria-label="Close story" data-testid="story-close-btn"><X size={17} /></button>
              </div>
              <div className="p-6 sm:p-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-clay">{story.scheme}</p>
                <h2 className="mt-2 font-display text-3xl font-extrabold">{story.seller}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-sage"><Sprout size={14} className="text-pine" /> {story.business} · {story.location}</p>
                <div className="mt-8 space-y-6">
                  {[['Business journey', story.journey], ['Challenges', story.challenges], ['Outcomes & learnings', story.outcomes]].map(([t, d]) => (
                    <div key={t}>
                      <h3 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-pine">{t}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-sage">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrap>
  );
}
