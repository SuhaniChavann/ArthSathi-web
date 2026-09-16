import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
const LS = 'sahaysetu-state-v1';

const defaults = {
  profile: {
    name: 'Anita Deshmukh',
    age: 34,
    gender: 'Woman',
    category: 'OBC',
    district: 'Pune',
    state: 'Maharashtra',
    education: 'ITI — Sewing Technology',
    business: 'Tailoring & Boutique',
    experience: 6,
    monthlyIncome: 25000,
    existingEmi: 2500,
  },
  verified: { digilocker: false, udyam: false },
  requirement: {
    purpose: 'Expand my boutique — buy industrial sewing machines',
    projectCost: 400000,
    loanAmount: 250000,
    businessType: 'Tailoring & Boutique',
  },
  selected: ['pm-vishwakarma', 'mudra-kishor'],
  docs: {},
  submitted: false,
  storySubmitted: false,
};

export function AppProvider({ children }) {
  const [s, setS] = useState(() => {
    try {
      const raw = localStorage.getItem(LS);
      return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify(s)); } catch {}
  }, [s]);

  const api = {
    state: s,
    setProfile: (p) => setS((x) => ({ ...x, profile: { ...x.profile, ...p } })),
    setVerified: (v) => setS((x) => ({ ...x, verified: { ...x.verified, ...v } })),
    setRequirement: (r) => setS((x) => ({ ...x, requirement: { ...x.requirement, ...r } })),
    toggleScheme: (id) =>
      setS((x) => ({
        ...x,
        selected: x.selected.includes(id) ? x.selected.filter((k) => k !== id) : [...x.selected, id],
      })),
    setDoc: (key, val) => setS((x) => ({ ...x, docs: { ...x.docs, [key]: val } })),
    setSubmitted: (v) => setS((x) => ({ ...x, submitted: v })),
    setStorySubmitted: (v) => setS((x) => ({ ...x, storySubmitted: v })),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
