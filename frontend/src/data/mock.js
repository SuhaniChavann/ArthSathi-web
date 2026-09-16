export const IMG = {
  hero: 'https://images.pexels.com/photos/36317181/pexels-photo-36317181.jpeg?auto=compress&cs=tinysrgb&w=1400',
  womanOffice: 'https://images.pexels.com/photos/7580752/pexels-photo-7580752.jpeg?auto=compress&cs=tinysrgb&w=1200',
  womanDesk: 'https://images.pexels.com/photos/8837758/pexels-photo-8837758.jpeg?auto=compress&cs=tinysrgb&w=1200',
  professionals: 'https://images.pexels.com/photos/7580644/pexels-photo-7580644.jpeg?auto=compress&cs=tinysrgb&w=1200',
  businesswoman: 'https://images.pexels.com/photos/7581115/pexels-photo-7581115.jpeg?auto=compress&cs=tinysrgb&w=1200',
  vendorStreet: 'https://images.pexels.com/photos/35317008/pexels-photo-35317008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  booksVendor: 'https://images.unsplash.com/photo-1761753088381-9fcaa087edae?auto=format&fit=crop&w=1200&q=80',
  painter: 'https://images.unsplash.com/photo-1641810290430-c24d021d4ace?auto=format&fit=crop&w=1200&q=80',
  proMan: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?auto=format&fit=crop&w=1200&q=80',
  avatar: (n) => `https://i.pravatar.cc/160?img=${n}`,
};

export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

export const daysSince = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 30) return `${d} days ago`;
  const m = Math.round(d / 30);
  return `${m} month${m > 1 ? 's' : ''} ago`;
};

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export const JOURNEY = [
  { id: 'profile', label: 'Profile', path: '/profile' },
  { id: 'verify', label: 'Verify', path: '/verify' },
  { id: 'requirement', label: 'Requirement', path: '/requirements' },
  { id: 'recommend', label: 'Recommendations', path: '/schemes' },
  { id: 'why', label: 'Why This Scheme', path: '/schemes/pm-vishwakarma/why' },
  { id: 'eligibility', label: 'Eligibility', path: '/schemes/pm-vishwakarma/eligibility' },
  { id: 'documents', label: 'Documents', path: '/schemes/pm-vishwakarma/documents' },
  { id: 'financial', label: 'Calculator', path: '/schemes/pm-vishwakarma/calculator' },
  { id: 'apply', label: 'Apply', path: '/applications' },
  { id: 'partner', label: 'Partner', path: '/connect' },
  { id: 'mentor', label: 'Mentor', path: '/connect?tab=mentors' },
  { id: 'grow', label: 'ONDC', path: '/grow' },
  { id: 'stories', label: 'Stories', path: '/stories' },
];

export const SCHEMES = [
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma',
    ministry: 'Ministry of MSME',
    tag: 'Artisans & Craftspeople',
    tagline: 'Collateral-free credit at 5% for traditional artisans — tailors, carpenters, weavers and 15 more trades.',
    minLoan: 0,
    maxLoan: 300000,
    loanWindow: '₹1,00,000 first tranche · up to ₹3,00,000 total',
    rate: 5,
    tenureYears: 3,
    moratoriumMonths: 6,
    subsidy: '5% concessional interest · ₹15,000 toolkit incentive · digital transaction rewards',
    location: 'All India',
    lastVerified: '2026-07-02',
    match: 94,
    process: ['Register on the PM Vishwakarma portal or at a CSC', 'Trade verification by local committee', 'Skill training (basic / advanced)', 'Apply for credit through a participating bank'],
    criteria: [
      { label: 'Age', user: '34 years', required: '18 years or above', met: true },
      { label: 'Trade', user: 'Tailoring & boutique', required: 'One of 18 traditional trades', met: true },
      { label: 'Location', user: 'Pune, Maharashtra', required: 'Any district in India', met: true },
      { label: 'Registration', user: 'Verified via Udyam', required: 'Artisan verification', met: true },
    ],
    why: [
      { title: 'Your trade is directly covered', desc: 'Tailoring is one of the 18 traditional trades supported under PM Vishwakarma — the scheme was designed for exactly your kind of work.' },
      { title: 'Your loan size fits perfectly', desc: 'You need ₹2.5 lakh. Vishwakarma supports up to ₹3 lakh in two tranches, so your full requirement is covered.' },
      { title: 'Lowest cost of borrowing', desc: 'A fixed 5% concessional interest rate — the lowest among all schemes matched to your profile.' },
      { title: 'Your experience strengthens the case', desc: 'Six years in tailoring plus ITI certification supports smooth trade verification.' },
    ],
    notPreferred: {
      name: 'PM Mudra (Kishor)',
      reason: 'Mudra also fits your profile, but its typical 9–11% interest rate would cost you roughly ₹8,400 more over 3 years. Mudra becomes the better route if your requirement grows beyond ₹3 lakh.',
    },
    documents: [
      { name: 'Aadhaar Card', purpose: 'Primary identity proof, fetched instantly through DigiLocker.' },
      { name: 'Voter ID / Address Proof', purpose: 'Confirms your current residential address for the district committee.' },
      { name: 'Bank Account Details', purpose: 'Loan disbursement and digital transaction incentive credit.' },
      { name: 'Trade / Skill Proof', purpose: 'ITI certificate or local artisan verification for tailoring.' },
      { name: 'Passport Photograph', purpose: 'For the Vishwakarma certificate and ID card.' },
    ],
  },
  {
    id: 'mudra-kishor',
    name: 'PM Mudra Yojana — Kishor',
    ministry: 'Department of Financial Services',
    tag: 'Micro Business Loans',
    tagline: 'Loans from ₹50,000 to ₹5 lakh for growing micro-enterprises, without collateral.',
    minLoan: 50000,
    maxLoan: 500000,
    loanWindow: '₹50,000 – ₹5,00,000',
    rate: 9.5,
    tenureYears: 5,
    moratoriumMonths: 3,
    subsidy: 'No collateral required · CGTMSE-backed guarantee cover',
    location: 'All India',
    lastVerified: '2026-05-12',
    match: 91,
    process: ['Approach any participating bank, NBFC or MFI', 'Submit application with business proof', 'Sanction and disbursement to your account'],
    criteria: [
      { label: 'Age', user: '34 years', required: '18 years or above', met: true },
      { label: 'Business type', user: 'Tailoring & boutique', required: 'Income-generating micro-enterprise', met: true },
      { label: 'Vintage', user: '6 years in business', required: 'Existing or new unit', met: true },
      { label: 'Banking history', user: 'Not yet checked', required: '6-month bank statement review', met: null },
    ],
    why: [
      { title: 'Built for exactly your loan size', desc: 'The Kishor category covers ₹50,000–₹5 lakh. Your ₹2.5 lakh requirement sits in the centre of this band.' },
      { title: 'No collateral asked', desc: 'Your loan is covered under a government guarantee fund — no property or gold needs to be pledged.' },
      { title: 'Flexible tenure', desc: 'Repayment of up to 5 years keeps the monthly payment comfortable on a ₹25,000 income.' },
    ],
    notPreferred: {
      name: 'Stand-Up India',
      reason: 'Stand-Up India starts at ₹10 lakh — far above your ₹2.5 lakh need. Borrowing more than required adds burden without benefit.',
    },
    documents: [
      { name: 'Aadhaar Card', purpose: 'Identity verification.' },
      { name: 'PAN Card', purpose: 'Required for loans above ₹50,000.' },
      { name: 'Business / Udyam Proof', purpose: 'Confirms your enterprise exists and is active.' },
      { name: '6-Month Bank Statement', purpose: 'Helps the lender assess cash flow of your boutique.' },
      { name: 'Machinery Quotation', purpose: 'Price quote for the industrial sewing machines you plan to buy.' },
    ],
  },
  {
    id: 'pmegp',
    name: 'PMEGP — Employment Generation',
    ministry: 'Ministry of MSME · KVIC',
    tag: 'New Unit + Subsidy',
    tagline: 'Set up a new unit with 15–35% government subsidy on project cost.',
    minLoan: 0,
    maxLoan: 5000000,
    loanWindow: 'Up to ₹50 lakh (manufacturing) · ₹20 lakh (service)',
    rate: 11,
    tenureYears: 6,
    moratoriumMonths: 6,
    subsidy: '15–35% margin-money subsidy on project cost',
    location: 'All India',
    lastVerified: '2026-02-18',
    match: 78,
    process: ['Apply on the KVIC online portal', 'District task force committee interview', 'Bank sanction', 'Subsidy back-ended after unit setup'],
    criteria: [
      { label: 'Age', user: '34 years', required: '18 years or above', met: true },
      { label: 'Education', user: 'ITI — Sewing Technology', required: 'VIII pass for projects above ₹10 lakh', met: true },
      { label: 'Unit type', user: 'Expansion of existing unit', required: 'New unit preferred', met: null },
    ],
    why: [
      { title: 'Real subsidy money', desc: 'As a woman entrepreneur in an urban area you may receive a 25% margin-money subsidy — ₹1 lakh back on a ₹4 lakh project.' },
      { title: 'Room to grow', desc: 'Supports project costs far beyond your current need — useful if the boutique scales into a small manufacturing unit.' },
    ],
    notPreferred: {
      name: 'PM Vishwakarma',
      reason: 'PMEGP carries a higher interest rate (~11%) and a longer approval process. For your current ₹2.5 lakh need, Vishwakarma is faster and cheaper.',
    },
    documents: [
      { name: 'Aadhaar Card', purpose: 'Identity verification.' },
      { name: 'Education Certificate', purpose: 'VIII pass proof for projects above ₹10 lakh.' },
      { name: 'Project Report', purpose: 'Cost break-up, machinery list and revenue plan for the unit.' },
      { name: 'Caste / Special Category Certificate', purpose: 'To claim the higher subsidy slab, if applicable.' },
      { name: 'Rural Area Proof', purpose: 'Determines your subsidy percentage (15%–35%).' },
    ],
  },
  {
    id: 'standup-india',
    name: 'Stand-Up India',
    ministry: 'Department of Financial Services',
    tag: 'Women & SC/ST Entrepreneurs',
    tagline: 'Bank loans from ₹10 lakh to ₹1 crore for women and SC/ST entrepreneurs.',
    minLoan: 1000000,
    maxLoan: 10000000,
    loanWindow: '₹10,00,000 – ₹1,00,00,000',
    rate: 8.6,
    tenureYears: 7,
    moratoriumMonths: 18,
    subsidy: 'Moratorium up to 18 months · handholding support via SIDBI portal',
    location: 'All India',
    lastVerified: '2026-06-15',
    match: 62,
    process: ['Register on the Stand-Up India portal', 'Get connected to a bank branch', 'Handholding support for documentation', 'Sanction through the branch'],
    criteria: [
      { label: 'Category', user: 'Woman entrepreneur', required: 'Women or SC/ST promoter', met: true },
      { label: 'Unit type', user: 'Existing boutique', required: 'Greenfield (first) enterprise', met: null },
    ],
    why: [
      { title: 'Designed for you — at a bigger scale', desc: 'Women entrepreneurs are the core beneficiary group. Keep this in view when you are ready for a ₹10 lakh+ expansion.' },
    ],
    notPreferred: {
      name: 'PM Mudra (Kishor)',
      reason: 'Your current need of ₹2.5 lakh is below the ₹10 lakh minimum of Stand-Up India. Mudra or Vishwakarma serve this size better.',
    },
    documents: [
      { name: 'Aadhaar & PAN', purpose: 'Promoter identity.' },
      { name: 'Business Proof', purpose: 'Enterprise registration details.' },
      { name: 'Project Report', purpose: 'Detailed plan for the greenfield expansion.' },
      { name: 'Category Certificate', purpose: 'If applying under the SC/ST category.' },
    ],
  },
  {
    id: 'pm-svanidhi',
    name: 'PM SVANidhi',
    ministry: 'Ministry of Housing & Urban Affairs',
    tag: 'Street Vendors',
    tagline: 'Working capital loans of ₹10,000–₹50,000 for street vendors, with cashback on digital payments.',
    minLoan: 10000,
    maxLoan: 50000,
    loanWindow: '₹10,000 / ₹20,000 / ₹50,000 tranches',
    rate: 7,
    tenureYears: 1,
    moratoriumMonths: 0,
    subsidy: '7% interest subsidy · digital cashback up to ₹1,200/year',
    location: 'Urban India',
    lastVerified: '2026-04-30',
    match: 40,
    process: ['Apply via the PM SVANidhi portal or ULB', 'Vendor certificate verification', 'Disbursement in graded tranches'],
    criteria: [
      { label: 'Occupation', user: 'Boutique (fixed shop)', required: 'Street vending activity', met: false },
    ],
    why: [
      { title: 'A mismatch worth knowing', desc: 'SVANidhi serves street vendors, not fixed-shop businesses — shown here so you can see why it ranks low for you.' },
    ],
    notPreferred: {
      name: 'PM Vishwakarma',
      reason: 'Your boutique is a fixed-shop trade; Vishwakarma matches both your trade and your loan size far better.',
    },
    documents: [
      { name: 'Aadhaar Card', purpose: 'Identity verification.' },
      { name: 'Vending Certificate / Letter of Recommendation', purpose: 'Issued by the Urban Local Body.' },
      { name: 'Bank Account Details', purpose: 'For disbursement and cashback.' },
    ],
  },
  {
    id: 'day-nrlm',
    name: 'DAY-NRLM — SHG Bank Linkage',
    ministry: 'Ministry of Rural Development',
    tag: 'Rural Women Collectives',
    tagline: 'Low-cost credit to rural women through Self-Help Groups, with interest subvention.',
    minLoan: 0,
    maxLoan: 300000,
    loanWindow: 'As per SHG grading · typically up to ₹3 lakh',
    rate: 7,
    tenureYears: 4,
    moratoriumMonths: 6,
    subsidy: 'Interest subvention bringing effective rate near 4% in 250 districts',
    location: 'Rural India',
    lastVerified: '2026-03-22',
    match: 48,
    process: ['Join or form a Self-Help Group', 'SHG grading after 6 months of savings', 'Bank linkage and repeat loan cycles'],
    criteria: [
      { label: 'Group membership', user: 'Not part of an SHG', required: 'Active SHG member', met: false },
      { label: 'Location', user: 'Pune (urban)', required: 'Rural area', met: false },
    ],
    why: [
      { title: 'Collective strength, wrong setting', desc: 'NRLM is powerful for rural women in SHGs. Your urban, individual profile points to Vishwakarma or Mudra instead.' },
    ],
    notPreferred: {
      name: 'PM Vishwakarma',
      reason: 'NRLM requires SHG membership in a rural area. As an urban individual artisan, Vishwakarma is the direct route.',
    },
    documents: [
      { name: 'Aadhaar Card', purpose: 'Identity verification.' },
      { name: 'SHG Membership Record', purpose: 'Confirms active group membership and savings history.' },
      { name: 'Bank Account Details', purpose: 'SHG-linked account for disbursement.' },
    ],
  },
];

export function eligibilityFor(scheme, requirement, verified) {
  const rows = scheme.criteria.map((c) => {
    if (c.user === 'Verified via Udyam' && !verified.udyam) {
      return { ...c, user: 'Not yet verified', met: null };
    }
    return { ...c };
  });
  const loanOk = requirement.loanAmount <= scheme.maxLoan && requirement.loanAmount >= (scheme.minLoan || 0);
  rows.push({
    label: 'Loan amount',
    user: inr(requirement.loanAmount),
    required: scheme.loanWindow,
    met: loanOk,
  });
  const anyFalse = rows.some((r) => r.met === false);
  const anyNull = rows.some((r) => r.met === null);
  const status = anyFalse ? 'notmet' : anyNull ? 'verify' : 'likely';
  return { status, rows };
}

export const PARTNERS = [
  {
    id: 'sbi-shivajinagar',
    name: 'State Bank of India — Shivajinagar',
    type: 'Bank',
    distance: '2.1 km',
    area: 'Shivajinagar, Pune',
    schemes: ['mudra-kishor', 'pmegp', 'standup-india'],
    capacity: 'Active lending window',
    x: 30, y: 40,
    recommended: true,
    reasons: ['Closest bank processing PM Mudra applications', 'Supports all 3 of your shortlisted schemes', 'Active lending capacity reported this quarter'],
  },
  {
    id: 'mavim-pune',
    name: 'MAVIM — Women’s SCA, Pune',
    type: 'SCA',
    distance: '3.2 km',
    area: 'Deccan Gymkhana, Pune',
    schemes: ['pm-vishwakarma', 'day-nrlm'],
    capacity: 'Accepting artisan registrations',
    x: 48, y: 60,
    recommended: true,
    reasons: ['Registered SCA for PM Vishwakarma facilitation', 'Specialised support for women artisans', 'Assists with trade verification paperwork'],
  },
  {
    id: 'bom-deccan',
    name: 'Bank of Maharashtra — Deccan',
    type: 'Bank',
    distance: '3.8 km',
    area: 'Deccan Gymkhana, Pune',
    schemes: ['mudra-kishor', 'pm-vishwakarma', 'pmegp'],
    capacity: 'Active lending window',
    x: 58, y: 34,
    recommended: false,
    reasons: ['Participating bank for Mudra and Vishwakarma'],
  },
  {
    id: 'tata-capital',
    name: 'Tata Capital — NBFC, FC Road',
    type: 'NBFC',
    distance: '2.9 km',
    area: 'FC Road, Pune',
    schemes: ['mudra-kishor'],
    capacity: 'Limited scheme desk hours',
    x: 38, y: 22,
    recommended: false,
    reasons: ['NBFC channel for Mudra-category loans'],
  },
  {
    id: 'annapurna-mfi',
    name: 'Annapurna Finance — Kothrud',
    type: 'MFI',
    distance: '5.6 km',
    area: 'Kothrud, Pune',
    schemes: ['mudra-kishor', 'day-nrlm'],
    capacity: 'Active lending window',
    x: 70, y: 72,
    recommended: false,
    reasons: ['Microfinance channel, smaller ticket sizes'],
  },
];

export const MENTORS = [
  { id: 'm1', name: 'Suresh Patil', domain: 'Garment Manufacturing', expertise: 'Unit setup · machine selection · tailoring clusters', experience: '18 years · ran a 40-machine unit in Ichalkaranji', avatar: IMG.avatar(12) },
  { id: 'm2', name: 'Meenakshi Iyer', domain: 'Boutique Branding & Retail', expertise: 'Pricing · festive collections · customer retention', experience: '12 years · founded two boutique labels in Pune', avatar: IMG.avatar(47) },
  { id: 'm3', name: 'Anil Kulkarni', domain: 'MSME Finance', expertise: 'Loan documentation · project reports · bank liaison', experience: '22 years · retired bank manager, MSME desk', avatar: IMG.avatar(59) },
  { id: 'm4', name: 'Farida Sheikh', domain: 'Women Entrepreneurship', expertise: 'SHG leadership · scheme navigation · confidence building', experience: '15 years · mentored 300+ women-led units', avatar: IMG.avatar(45) },
];

export const ADPLIST = [
  { id: 'a1', name: 'Rahul Menon', category: 'Business Strategy', detail: 'Scaling micro-retail into D2C · ex-consumer goods lead', location: 'Bengaluru · English/Hindi', avatar: IMG.avatar(33) },
  { id: 'a2', name: 'Sofia D’Souza', category: 'Digital Marketing', detail: 'Instagram & WhatsApp selling for small businesses', location: 'Mumbai · English/Marathi', avatar: IMG.avatar(44) },
  { id: 'a3', name: 'Vikram Shah', category: 'Technology Adoption', detail: 'Digital payments, billing and inventory for micro-units', location: 'Ahmedabad · English/Hindi/Gujarati', avatar: IMG.avatar(15) },
];

export const STORIES = [
  {
    id: 's1',
    seller: 'Lata Waghmare',
    business: 'Kirana & Provisions Store',
    location: 'Solapur, Maharashtra',
    scheme: 'PM Mudra — Kishor',
    image: IMG.businesswoman,
    quote: 'The loan bought me a cold storage unit. My spoilage dropped to almost zero in one summer.',
    journey: 'Lata ran a 200 sq ft kirana shop for nine years. With a ₹3 lakh Mudra loan she added cold storage and doubled her dairy and produce range.',
    challenges: 'The first application was returned twice for a missing bank statement page. A mentor helped her prepare a complete file the third time.',
    outcomes: 'Monthly revenue grew from ₹85,000 to ₹1.6 lakh in 14 months. She now supplies two neighbouring stalls.',
  },
  {
    id: 's2',
    seller: 'Ramesh Yadav',
    business: 'Street Food Cart',
    location: 'Mumbai, Maharashtra',
    scheme: 'PM SVANidhi',
    image: IMG.vendorStreet,
    quote: '₹20,000 does not sound big — until it is the difference between renting a cart and owning one.',
    journey: 'Ramesh used the second SVANidhi tranche to own his cart and switch to digital payments for the cashback.',
    challenges: 'Getting the vending certificate took three visits to the ward office. Freshness indicators warned him the rules had just changed.',
    outcomes: 'Owns his cart outright, saves ₹4,500/month in rent, and repaid the loan 4 months early.',
  },
  {
    id: 's3',
    seller: 'Shabana Khan',
    business: 'Zardozi Embroidery Unit',
    location: 'Malegaon, Maharashtra',
    scheme: 'PM Vishwakarma',
    image: IMG.painter,
    quote: 'The 5% loan meant my earnings went into threads and frames, not interest.',
    journey: 'Shabana expanded from solo work to a 6-woman embroidery unit with a ₹2 lakh Vishwakarma loan and toolkit support.',
    challenges: 'Trade verification was unfamiliar — the local artisan committee visit made her nervous. A domain mentor sat through it with her.',
    outcomes: 'Unit now fulfils boutique orders from Nashik and Surat. Two apprentices are in training.',
  },
  {
    id: 's4',
    seller: 'Joseph D’Souza',
    business: 'Dairy & Agro Supplies',
    location: 'Nashik, Maharashtra',
    scheme: 'PMEGP',
    image: IMG.booksVendor,
    quote: 'The subsidy felt too good to be true. Reading “why this scheme” line by line convinced me it was real.',
    journey: 'Joseph set up a small agro-supply unit with a PMEGP project of ₹12 lakh and received the 25% rural subsidy.',
    challenges: 'The project report needed three revisions. The document checklist told him exactly what was missing each time.',
    outcomes: 'Unit broke even in 19 months and now employs four people from his village.',
  },
];

export const VOICE_SCRIPTS = {
  en: {
    name: 'English',
    transcript: 'I want to expand my tailoring shop and need a loan of two and a half lakh rupees.',
    hint: 'Try: “I want to start a small business — which scheme can help me?”',
  },
  hi: {
    name: 'हिन्दी',
    transcript: 'मुझे अपनी सिलाई की दुकान बढ़ाने के लिए ढाई लाख रुपये का कर्ज़ चाहिए।',
    hint: 'बोलिए: “मुझे छोटा व्यवसाय शुरू करना है, कौन सी योजना मिलेगी?”',
  },
  mr: {
    name: 'मराठी',
    transcript: 'मला माझ्या शिंप्याच्या दुकानासाठी अडीच लाख रुपयांचे कर्ज हवे आहे.',
    hint: 'बोला: “मला छोटा व्यवसाय सुरू करायचा आहे, कोणती योजना मिळेल?”',
  },
};
