/**
 * Single source of truth for company facts shown on the site.
 * VERIFY WITH CLIENT before launch: items marked `verify`.
 */
export const company = {
  name: 'Shisai Steel Industries',
  shortName: 'Shisai',
  tagline: 'Hygienic stainless steel fittings. Connecting you to quality.',
  /** Brochure: "Since 2001". */
  foundedYear: 2001,
  gst: '27DBFPP0939E1ZM',
  ceo: 'Mr. Raju Purohit',
  address: {
    lines: [
      'Unit No. 13, Singh Industrial Estate',
      'Nr. Kalimata Mandir, Kherpada, Waliv',
      'Vasai East, Palghar, Maharashtra 401208',
      'India',
    ],
    short: 'Vasai East, Palghar, Maharashtra',
    /** Second works, from the brochure catalogue pages. */
    alsoAt: 'Unit 28, 29 & 30, Alfa Industrial Estate, Kherpada, Waliv, Vasai East 401208',
    mapsUrl: 'https://www.google.co.in/maps/dir//19.42259000,72.85411000',
    embedUrl:
      'https://www.google.com/maps?q=19.42259,72.85411&hl=en&z=15&output=embed',
  },
  phone: { display: '+91 99922 52256', e164: '+919992252256' },
  phoneAlt: { display: '+91 90827 80156', e164: '+919082780156' },
  whatsapp: '919992252256',
  emails: ['triclover.india@gmail.com', 'shisaisteel@gmail.com'],
  hours: [
    { days: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
    { days: 'Saturday', time: '9:00 AM – 2:00 PM' },
    { days: 'Sunday', time: 'Closed' },
  ],
} as const;

export const yearsInBusiness = (): number =>
  new Date().getFullYear() - company.foundedYear;

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: readonly Stat[] = [
  { value: yearsInBusiness(), suffix: '+', label: 'Years manufacturing' },
  { value: 6, suffix: '', label: 'Product families' },
  { value: 40, suffix: '+', label: 'Fitting variants' },
  { value: 3, suffix: '', label: 'Stainless grades' },
];

/** Grades, finishes, sizes come from the existing catalogue. */
export const capabilities = {
  grades: ['SS304', 'SS316', 'SS316L'],
  finishes: ['Matt', 'Mirror', 'Glossy', 'Polished'],
  sizeRange: '½" – 20"',
  /** verify: dimensional standards followed on request */
  standards: ['DIN 32676', 'DIN 11850', 'ISO 2037', 'ASME BPE', 'SMS 1145'],
} as const;

export interface Industry {
  id: string;
  name: string;
  note: string;
  spec: string;
}

export const industries: readonly Industry[] = [
  {
    id: 'pharma',
    name: 'Pharmaceutical',
    note: 'CIP / SIP process lines, WFI loops, clean utilities',
    spec: 'SS316L · Mirror',
  },
  {
    id: 'food',
    name: 'Food & Beverage',
    note: 'Process piping for sauces, juices, brewing and bottling',
    spec: 'SS304 / 316 · Matt',
  },
  {
    id: 'dairy',
    name: 'Dairy',
    note: 'Milk reception, pasteurisation and packaging lines',
    spec: 'SS304 · Polished',
  },
  {
    id: 'biotech',
    name: 'Biotechnology',
    note: 'Fermentation, media prep and downstream skids',
    spec: 'SS316L · Mirror',
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics & Personal Care',
    note: 'Cream, lotion and emulsion transfer lines',
    spec: 'SS316 · Mirror',
  },
  {
    id: 'water',
    name: 'Water Treatment',
    note: 'RO, DM and purified water distribution',
    spec: 'SS304 · Matt',
  },
];

export interface Machine {
  name: string;
  /** What it does on the floor. */
  purpose: string;
  /** What that buys the customer. */
  benefit: string;
}

/** Plant list and wording from the brochure's machinery page. */
export const machinery: readonly Machine[] = [
  {
    name: 'CNC Machine',
    purpose: 'High-precision cutting and shaping of stainless components.',
    benefit: 'Dimensional accuracy, repeatable on every batch.',
  },
  {
    name: 'Power Press',
    purpose: 'Cutting, bending and forming of ferrules and clamp halves.',
    benefit: 'High-volume output with consistent geometry.',
  },
  {
    name: 'Hydraulic Press',
    purpose: 'Moulding and forming under controlled pressure.',
    benefit: 'Uniform wall thickness on complex shapes.',
  },
  {
    name: 'Lathe',
    purpose: 'Turning and facing of cylindrical parts.',
    benefit: 'Smooth, true sealing faces.',
  },
  {
    name: 'Welding Unit',
    purpose: 'Joining tube and ferrule into tees, bends and spools.',
    benefit: 'Strong, leak-proof joints fit for pharma lines.',
  },
  {
    name: 'Polishing Machine',
    purpose: 'Internal and external surface finishing.',
    benefit: 'Mirror or matt finish to specification.',
  },
  {
    name: 'Laser Marking',
    purpose: 'Permanent engraving of grade, size and heat number.',
    benefit: 'Traceability that survives CIP and SIP.',
  },
  {
    name: 'Bandsaw',
    purpose: 'Cutting raw tube and bar to length.',
    benefit: 'Clean, square starts for every part.',
  },
  {
    name: 'Hand Press',
    purpose: 'Manual pressing and shaping in small runs.',
    benefit: 'Custom orders and short batches without tooling delay.',
  },
];

/** Registered brands shown in the brochure. */
export const brands = ['Tri Clover®', 'Tri Clamp®', 'Znox®'] as const;

export interface Assessment {
  label: string;
  detail: string;
}

/**
 * Badges printed on the brochure cover. verify: ISO 9001 and GMP
 * certificates are not on file here; add the PDFs to `certificates`
 * once the client supplies them.
 */
export const assessments: readonly Assessment[] = [
  { label: 'MSME ZED', detail: 'Bronze' },
  { label: 'ISO 9001', detail: 'Certified' },
  { label: 'GMP', detail: 'Certified' },
];

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  description: string;
  file: string;
}

export const certificates: readonly Certificate[] = [
  {
    id: 'udyam',
    title: 'Udyam Registration',
    issuer: 'Ministry of MSME, Govt. of India',
    description:
      'Official MSME registration validating our business credentials and compliance.',
    file: '/certificates/AAA Print _ Udyam Registration Certificate (1) (2).pdf',
  },
  {
    id: 'company',
    title: 'Company Registration',
    issuer: 'Shisai Steel Industries',
    description:
      'Registration documentation establishing our legal entity and operational authority.',
    file: '/certificates/SHISAI STEEL INDUSTRIES (5) (2).pdf',
  },
  {
    id: 'zed',
    title: 'ZED Certification',
    issuer: 'Zero Defect Zero Effect, MSME',
    description:
      'Quality manufacturing with minimal environmental impact, assessed under the ZED scheme.',
    file: '/certificates/Zed certificate (3) (2).pdf',
  },
  {
    id: 'trade',
    title: 'Trade License',
    issuer: 'Znox Trademart',
    description: 'Authorised trade license validating our commercial operations.',
    file: '/certificates/znox trademart (2).pdf',
  },
  {
    id: 'trademark',
    title: 'Tri Clover® Trademark',
    issuer: 'Trade Marks Registry, India',
    description:
      'Registered trademark for our Tri Clover brand of clamps and fittings.',
    file: '/certificates/tri clover trademark certificate (3).pdf',
  },
];

export const whatsappLink = (message?: string): string => {
  const base = `https://wa.me/${company.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
