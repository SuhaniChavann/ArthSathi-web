# PRD — SahaySetu · SIH 09-2 Beneficiary Platform

## Original problem statement
Build a premium, modern, responsive beneficiary website for SIH 09-2 (government scheme discovery → application → growth journey), per the uploaded combined PRD (Part 1 + Part 2). High-end fintech/startup feel — not a government portal. Realistic Indian human photography on every major page, elegant typography, lightweight signature animations, exact nav (Home | Schemes | Applications | Connect | Grow | Profile), full clickable core journey (Profile → Verify → Requirement → Recommendations → Why This Scheme → Eligibility → Documents → Financial Calculator → Apply → Channel Partner → Mentor → ONDC → Seller Stories), strict trust language (Likely Eligible ≠ Approved; Match Score ≠ approval probability; estimates ≠ official; freshness ≠ guarantee; DigiLocker/Udyam/ADPList/ONDC labelled external; no document upload). 1440px desktop-first, responsive at 1024px and 390px.

## User choices (this session)
- Frontend-only prototype — all data hardcoded in React (no backend APIs used).
- No login — single demo beneficiary; "DigiLocker or Udyam" answered → simulated verification flow.
- Voice assistant: simulated guided flow with animated waveform (EN/HI/MR).
- Scope: full core journey, all key pages, top polish on hero screens.

## Architecture
- React 19 + Tailwind + framer-motion 11 + lenis (smooth scroll). Shadcn UI available; custom design system in index.css (earthy palette: pine #0A3B2C, clay #E76F51, sand #F4F1EA; Manrope display + Inter body).
- State: `src/context/AppContext.jsx` (profile, verification, requirement, shortlisted schemes, document readiness, submissions) persisted to localStorage.
- Data: `src/data/mock.js` — 6 schemes, 5 channel partners, 4 domain mentors, 3 ADPList mentors, 4 seller stories, voice scripts, eligibility evaluator.
- Shared: `src/components/widgets.jsx` (MatchRing, FreshnessBadge, EligibilityBadge, ExtBadge, TrustNote, JourneyStepper, Waveform, SchemeCard, PageHeader), `src/components/motion.jsx` (PageWrap, Reveal, Stagger, MaskReveal, CountUp, LiveNumber), `src/components/SchemeNav.jsx`.
- Pages: Home (kinetic masked hero, marquee, manifesto chapters, stats, trust band, stories teaser), Profile, Verify (simulated DigiLocker/Udyam staging), Requirements, Schemes (search/filters/compare/shortlist), SchemeDetail, WhyScheme, Eligibility (3 indicative states), Documents (readiness checklist, no upload), Calculator (live EMI/affordability), Applications (bulk matrix + submit confirmation), Connect (animated map + partner list + routing reasons, mentors, ADPList), Voice (language → waveform listening → transcript → extracted info), Grow (ONDC pathway + suitability), Stories (cards, modal detail, moderated submission).
- Backend (server.py) untouched — not used by the prototype.

## User personas
- Low-digital-literacy beneficiary (demo persona: Anita Deshmukh, 34, tailoring boutique, Pune, needs ₹2.5L).
- Returning user resuming the journey; voice-first user; multi-scheme applicant; existing business seeking growth.

## Implemented (2026-09-16)
- Full 15-page clickable journey with page transitions, journey stepper, scroll reveals, parallax hero, marquee, animated match rings, count-up stats, live financial number transitions, document progress bar, animated map pins, voice waveform.
- Trust system end-to-end (badges + disclaimers on every decision surface; external-service labelling).
- Responsive: 1440 / 1024 / 390 verified via screenshots.

## Verified
- Home render + hero imagery; voice flow (language → listening → transcript → extracted → confirm); schemes search/clear/compare/shortlist; eligibility states; calculator (Comfortable state, live numbers); connect map pin interaction + ADPList tab; applications matrix resolve + submit confirmation; mobile 390px layouts.

## Backlog
- P0: none blocking.
- P1: real DigiLocker/Udyam OAuth integration; real Whisper voice transcription; admin scheme-verification console (PRD A01–A09).
- P2: scheme data from backend/CMS; multilingual full-UI (not just voice); PDF application pack export; partner geolocation via real maps API; notifications (explicitly future scope in PRD).

## Next tasks
1. Collect real scheme dataset + admin freshness workflow.
2. Wire real auth/verification integrations.
3. Real speech-to-text for voice assistant.
