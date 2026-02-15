export interface SectorDef {
  name: string;
  etf: string;
  color: string;
  subSectors: SubSectorDef[];
}

export interface SubSectorDef {
  name: string;
  etf?: string;
  industries: string[];
}

export const SECTOR_HIERARCHY: SectorDef[] = [
  {
    name: 'Technology',
    etf: 'XLK',
    color: '#AB9FF2',
    subSectors: [
      { name: 'Software', etf: 'IGV', industries: ['Application Software', 'Systems Software', 'Enterprise SaaS', 'Cybersecurity Software', 'Developer Tools'] },
      { name: 'Semiconductors', etf: 'SMH', industries: ['GPU & AI Processors', 'Broadline Semiconductors', 'Memory Chips', 'Semiconductor Equipment', 'Analog & Mixed Signal'] },
      { name: 'Hardware', industries: ['Consumer Electronics', 'Computer Hardware', 'Networking Equipment', 'Storage Devices', 'Peripheral Devices'] },
      { name: 'Internet', industries: ['Interactive Media', 'Internet Services', 'Search & Advertising', 'Social Platforms', 'E-Commerce Tech'] },
      { name: 'Cloud & AI', industries: ['Cloud Infrastructure', 'AI Platforms', 'Data Analytics', 'Machine Learning Ops', 'Edge Computing'] },
    ],
  },
  {
    name: 'Healthcare',
    etf: 'XLV',
    color: '#10B981',
    subSectors: [
      { name: 'Pharma', etf: 'XBI', industries: ['Major Pharmaceuticals', 'Specialty Pharmaceuticals', 'Generic Drugs', 'Vaccine Development', 'Oncology Therapeutics'] },
      { name: 'Insurance', industries: ['Managed Healthcare', 'Health Plan Providers', 'Dental & Vision Plans', 'Medicare Advantage', 'Pharmacy Benefit Mgmt'] },
      { name: 'Biotech', etf: 'IBB', industries: ['Biotechnology', 'Genomics', 'Cell & Gene Therapy', 'Antibody Therapeutics', 'RNA Therapeutics'] },
      { name: 'Medical Devices', industries: ['Medical Equipment', 'Diagnostics', 'Surgical Robotics', 'Implantable Devices', 'Wearable Health Tech'] },
      { name: 'Health IT', industries: ['Health Tech Platforms', 'Telemedicine', 'Clinical Data Systems', 'Health AI Analytics', 'Digital Therapeutics'] },
    ],
  },
  {
    name: 'Financials',
    etf: 'XLF',
    color: '#F59E0B',
    subSectors: [
      { name: 'Banks', etf: 'KBE', industries: ['Diversified Banks', 'Regional Banks', 'Digital Banking', 'Commercial Lending', 'Mortgage Banking'] },
      { name: 'Payments', industries: ['Payment Processing', 'Financial Technology', 'Digital Wallets', 'Cross-Border Payments', 'Buy Now Pay Later'] },
      { name: 'Investment Banking', industries: ['Capital Markets', 'Advisory Services', 'Brokerage Services', 'Trading Platforms', 'Securities Exchanges'] },
      { name: 'Insurance', industries: ['Life Insurance', 'Property Insurance', 'Reinsurance', 'InsurTech', 'Specialty Insurance'] },
      { name: 'Asset Management', industries: ['Wealth Management', 'Fund Management', 'Private Equity', 'Hedge Funds', 'Robo-Advisory'] },
    ],
  },
  {
    name: 'Consumer',
    etf: 'XLY',
    color: '#EF4444',
    subSectors: [
      { name: 'E-Commerce', industries: ['Internet Retail', 'Marketplace Platforms', 'Direct-to-Consumer', 'Subscription Commerce', 'Social Commerce'] },
      { name: 'Retail', industries: ['General Merchandise', 'Home Improvement', 'Specialty Retail', 'Warehouse Clubs', 'Dollar Stores'] },
      { name: 'Auto', industries: ['Electric Vehicles', 'Auto Manufacturers', 'Auto Parts & Services', 'Autonomous Driving', 'EV Charging'] },
      { name: 'Apparel', industries: ['Footwear & Accessories', 'Luxury Goods', 'Athletic Wear', 'Fast Fashion', 'Outdoor & Recreation'] },
      { name: 'Food & Beverage', industries: ['Beverages', 'Packaged Foods', 'Restaurants & QSR', 'Organic & Natural', 'Snacks & Confections'] },
    ],
  },
  {
    name: 'Energy',
    etf: 'XLE',
    color: '#8B5CF6',
    subSectors: [
      { name: 'Oil & Gas', industries: ['Integrated Oil & Gas', 'Exploration & Production', 'Refining & Marketing', 'Oil Sands', 'Natural Gas Producers'] },
      { name: 'Renewables', industries: ['Solar Energy', 'Wind Energy', 'Hydrogen & Fuel Cells', 'Energy Storage', 'Geothermal Energy'] },
      { name: 'Services', industries: ['Oil & Gas Equipment', 'Drilling Services', 'Well Services', 'Seismic & Survey', 'Offshore Engineering'] },
      { name: 'Pipelines', industries: ['Oil & Gas Midstream', 'LNG Transport', 'Gas Gathering', 'Pipeline Construction', 'Terminal Operations'] },
      { name: 'Nuclear', industries: ['Nuclear Power', 'Uranium Mining', 'Nuclear Services', 'Small Modular Reactors', 'Nuclear Fuel Processing'] },
    ],
  },
];

export const ASSET_CLASSES = [
  { name: 'Equities', etf: 'SPY', color: '#AB9FF2' },
  { name: 'Bonds', etf: 'TLT', color: '#10B981' },
  { name: 'Commodities', etf: 'DBC', color: '#F59E0B' },
  { name: 'Crypto', etf: 'BITO', color: '#8B5CF6' },
  { name: 'Forex (DXY)', etf: 'UUP', color: '#EF4444' },
] as const;

export const FACTOR_STYLES = [
  { name: 'Value', etf: 'VTV' },
  { name: 'Growth', etf: 'VUG' },
  { name: 'Momentum', etf: 'MTUM' },
  { name: 'Quality', etf: 'QUAL' },
  { name: 'Low Volatility', etf: 'USMV' },
  { name: 'Small Cap', etf: 'IWM' },
  { name: 'Dividend', etf: 'VYM' },
] as const;

export const SECTORS = [
  'Technology',
  'Healthcare',
  'Financials',
  'Consumer',
  'Energy',
] as const;

export type SectorName = (typeof SECTORS)[number];
