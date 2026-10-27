/**
 * Single source of truth for company facts shown on the site.
 * VERIFY WITH CLIENT before launch: items marked `verify`.
 */
export const company = {
  name: 'Shisai Steel Industries',
  shortName: 'Shisai',
  tagline: 'Hygienic stainless steel fittings, engineered to specification.',
  foundedYear: 2009,
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
    mapsUrl: 'https://www.google.co.in/maps/dir//19.42259000,72.85411000',
    embedUrl:
      'https://www.google.com/maps?q=19.42259,72.85411&hl=en&z=15&output=embed',
  },
  phone: { display: '+91 99922 52256', e164: '+919992252256' },
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

export const machinery = [
  'CNC Machine',
  'Power Press',
  'Hydraulic Press',
  'Lathe',
  'Welding Unit',
  'Polishing Machine',
  'Laser Marking',
  'Bandsaw',
] as const;

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
