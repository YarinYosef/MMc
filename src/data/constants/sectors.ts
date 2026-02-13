export interface SectorDef {
  name: string;
  etf: string;
  color: string;
  subSectors: SubSectorDef[];
}

export interface SubSectorDef {
  name: string;
  etf?: string;
}

export const SECTOR_HIERARCHY: SectorDef[] = [
  {
    name: 'Technology',
    etf: 'XLK',
    color: '#3B82F6',
    subSectors: [
      { name: 'Software', etf: 'IGV' },
      { name: 'Semiconductors', etf: 'SMH' },
      { name: 'Hardware' },
      { name: 'Internet' },
    ],
  },
  {
    name: 'Healthcare',
    etf: 'XLV',
    color: '#10B981',
    subSectors: [
      { name: 'Pharma', etf: 'XBI' },
      { name: 'Insurance' },
      { name: 'Biotech', etf: 'IBB' },
      { name: 'Medical Devices' },
    ],
  },
  {
    name: 'Financials',
    etf: 'XLF',
    color: '#F59E0B',
    subSectors: [
      { name: 'Banks', etf: 'KBE' },
      { name: 'Payments' },
      { name: 'Investment Banking' },
      { name: 'Insurance' },
    ],
  },
  {
    name: 'Consumer',
    etf: 'XLY',
    color: '#EF4444',
    subSectors: [
      { name: 'E-Commerce' },
      { name: 'Retail' },
      { name: 'Auto' },
      { name: 'Apparel' },
    ],
  },
  {
    name: 'Energy',
    etf: 'XLE',
    color: '#8B5CF6',
    subSectors: [
      { name: 'Oil & Gas' },
      { name: 'Renewables' },
      { name: 'Services' },
    ],
  },
  {
    name: 'Industrials',
    etf: 'XLI',
    color: '#6366F1',
    subSectors: [
      { name: 'Aerospace' },
      { name: 'Machinery' },
      { name: 'Defense' },
      { name: 'Transportation' },
    ],
  },
  {
    name: 'Communications',
    etf: 'XLC',
    color: '#EC4899',
    subSectors: [
      { name: 'Streaming' },
      { name: 'Entertainment' },
      { name: 'Telecom' },
      { name: 'Advertising' },
    ],
  },
  {
    name: 'Utilities',
    etf: 'XLU',
    color: '#14B8A6',
    subSectors: [
      { name: 'Electric' },
      { name: 'Gas' },
      { name: 'Water' },
    ],
  },
  {
    name: 'Real Estate',
    etf: 'XLRE',
    color: '#F97316',
    subSectors: [
      { name: 'REITs' },
      { name: 'Commercial' },
      { name: 'Residential' },
    ],
  },
];

export const ASSET_CLASSES = [
  { name: 'Equities', etf: 'SPY', color: '#3B82F6' },
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
