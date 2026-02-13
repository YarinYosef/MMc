export interface TickerDef {
  symbol: string;
  name: string;
  sector: string;
  subSector: string;
  marketCap: number; // billions
}

export const TICKER_UNIVERSE: TickerDef[] = [
  // Technology
  { symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Technology', subSector: 'Software', marketCap: 3100 },
  { symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology', subSector: 'Hardware', marketCap: 2900 },
  { symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'Technology', subSector: 'Semiconductors', marketCap: 2800 },
  { symbol: 'GOOGL', name: 'Alphabet Inc', sector: 'Technology', subSector: 'Internet', marketCap: 2100 },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Technology', subSector: 'Internet', marketCap: 1500 },
  { symbol: 'AVGO', name: 'Broadcom Inc', sector: 'Technology', subSector: 'Semiconductors', marketCap: 800 },
  { symbol: 'CRM', name: 'Salesforce Inc', sector: 'Technology', subSector: 'Software', marketCap: 280 },
  { symbol: 'AMD', name: 'AMD Inc', sector: 'Technology', subSector: 'Semiconductors', marketCap: 250 },
  { symbol: 'ADBE', name: 'Adobe Inc', sector: 'Technology', subSector: 'Software', marketCap: 230 },
  { symbol: 'INTC', name: 'Intel Corp', sector: 'Technology', subSector: 'Semiconductors', marketCap: 120 },

  // Healthcare
  { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', subSector: 'Insurance', marketCap: 480 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', subSector: 'Pharma', marketCap: 380 },
  { symbol: 'LLY', name: 'Eli Lilly', sector: 'Healthcare', subSector: 'Pharma', marketCap: 750 },
  { symbol: 'PFE', name: 'Pfizer Inc', sector: 'Healthcare', subSector: 'Pharma', marketCap: 160 },
  { symbol: 'ABBV', name: 'AbbVie Inc', sector: 'Healthcare', subSector: 'Pharma', marketCap: 310 },

  // Financials
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financials', subSector: 'Banks', marketCap: 600 },
  { symbol: 'V', name: 'Visa Inc', sector: 'Financials', subSector: 'Payments', marketCap: 550 },
  { symbol: 'MA', name: 'Mastercard Inc', sector: 'Financials', subSector: 'Payments', marketCap: 420 },
  { symbol: 'BAC', name: 'Bank of America', sector: 'Financials', subSector: 'Banks', marketCap: 310 },
  { symbol: 'GS', name: 'Goldman Sachs', sector: 'Financials', subSector: 'Investment Banking', marketCap: 160 },

  // Consumer
  { symbol: 'AMZN', name: 'Amazon.com', sector: 'Consumer', subSector: 'E-Commerce', marketCap: 2000 },
  { symbol: 'TSLA', name: 'Tesla Inc', sector: 'Consumer', subSector: 'Auto', marketCap: 800 },
  { symbol: 'WMT', name: 'Walmart Inc', sector: 'Consumer', subSector: 'Retail', marketCap: 520 },
  { symbol: 'HD', name: 'Home Depot', sector: 'Consumer', subSector: 'Retail', marketCap: 360 },
  { symbol: 'NKE', name: 'Nike Inc', sector: 'Consumer', subSector: 'Apparel', marketCap: 130 },

  // Energy
  { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy', subSector: 'Oil & Gas', marketCap: 460 },
  { symbol: 'CVX', name: 'Chevron Corp', sector: 'Energy', subSector: 'Oil & Gas', marketCap: 290 },
  { symbol: 'COP', name: 'ConocoPhillips', sector: 'Energy', subSector: 'Oil & Gas', marketCap: 130 },

  // Industrials
  { symbol: 'CAT', name: 'Caterpillar Inc', sector: 'Industrials', subSector: 'Machinery', marketCap: 180 },
  { symbol: 'BA', name: 'Boeing Co', sector: 'Industrials', subSector: 'Aerospace', marketCap: 130 },
  { symbol: 'GE', name: 'GE Aerospace', sector: 'Industrials', subSector: 'Aerospace', marketCap: 200 },

  // Communications
  { symbol: 'NFLX', name: 'Netflix Inc', sector: 'Communications', subSector: 'Streaming', marketCap: 350 },
  { symbol: 'DIS', name: 'Walt Disney', sector: 'Communications', subSector: 'Entertainment', marketCap: 200 },
  { symbol: 'CMCSA', name: 'Comcast Corp', sector: 'Communications', subSector: 'Telecom', marketCap: 160 },

  // Utilities & Real Estate
  { symbol: 'NEE', name: 'NextEra Energy', sector: 'Utilities', subSector: 'Electric', marketCap: 160 },
  { symbol: 'AMT', name: 'American Tower', sector: 'Real Estate', subSector: 'REITs', marketCap: 90 },
];

export const SECTORS = [
  'Technology',
  'Healthcare',
  'Financials',
  'Consumer',
  'Energy',
  'Industrials',
  'Communications',
  'Utilities',
  'Real Estate',
] as const;

export type SectorName = (typeof SECTORS)[number];
