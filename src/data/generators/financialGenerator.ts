import { type FinancialStatement } from '@/data/types/market';

// Seeded random for deterministic data per symbol
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function hashSymbol(symbol: string): number {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash << 5) - hash + symbol.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateFinancials(
  symbol: string,
  mode: 'annual' | 'quarterly' | 'ttm',
  years: number = 5
): FinancialStatement[] {
  const rand = seededRandom(hashSymbol(symbol));
  const statements: FinancialStatement[] = [];

  const baseRevenue = (rand() * 200 + 20) * 1_000_000_000; // 20B-220B
  const growthRate = 0.05 + rand() * 0.15; // 5%-20% annual growth
  const grossMargin = 0.3 + rand() * 0.4; // 30%-70%
  const opexRatio = 0.1 + rand() * 0.2; // 10%-30% of revenue
  const taxRate = 0.15 + rand() * 0.1; // 15%-25%

  const periods = mode === 'quarterly' ? years * 4 : mode === 'ttm' ? 1 : years;
  const currentYear = new Date().getFullYear();

  for (let i = periods - 1; i >= 0; i--) {
    const periodGrowth = Math.pow(1 + growthRate, periods - 1 - i);
    const noise = 0.9 + rand() * 0.2;
    const revenue = baseRevenue * periodGrowth * noise;
    const costOfRevenue = revenue * (1 - grossMargin) * (0.9 + rand() * 0.2);
    const grossProfit = revenue - costOfRevenue;
    const operatingExpenses = revenue * opexRatio * (0.9 + rand() * 0.2);
    const operatingIncome = grossProfit - operatingExpenses;
    const taxes = Math.max(operatingIncome * taxRate, 0);
    const otherIncome = revenue * (rand() * 0.02 - 0.01);
    const netIncome = operatingIncome + otherIncome - taxes;
    const sharesOutstanding = (rand() * 5 + 1) * 1_000_000_000;

    let period: string;
    if (mode === 'quarterly') {
      const q = (i % 4) + 1;
      const y = currentYear - Math.floor(i / 4);
      period = `Q${q} ${y}`;
    } else if (mode === 'ttm') {
      period = 'TTM';
    } else {
      period = `${currentYear - i}`;
    }

    statements.push({
      period,
      revenue: Math.round(revenue),
      costOfRevenue: Math.round(costOfRevenue),
      grossProfit: Math.round(grossProfit),
      operatingExpenses: Math.round(operatingExpenses),
      operatingIncome: Math.round(operatingIncome),
      netIncome: Math.round(netIncome),
      eps: Math.round((netIncome / sharesOutstanding) * 100) / 100,
      ebitda: Math.round(operatingIncome * 1.15),
    });
  }

  return statements;
}

export interface BalanceSheetData {
  period: string;
  cash: number;
  totalDebt: number;
  totalAssets: number;
  totalLiabilities: number;
}

export function generateBalanceSheet(
  symbol: string,
  mode: 'annual' | 'quarterly' | 'ttm',
  years: number = 5
): BalanceSheetData[] {
  const rand = seededRandom(hashSymbol(symbol) + 1000);
  const results: BalanceSheetData[] = [];

  const baseCash = (rand() * 80 + 10) * 1_000_000_000;
  const baseDebt = (rand() * 60 + 5) * 1_000_000_000;
  const currentYear = new Date().getFullYear();
  const periods = mode === 'quarterly' ? years * 4 : mode === 'ttm' ? 1 : years;

  for (let i = periods - 1; i >= 0; i--) {
    const growth = Math.pow(1.05, periods - 1 - i);
    const cash = baseCash * growth * (0.8 + rand() * 0.4);
    const debt = baseDebt * growth * (0.7 + rand() * 0.6);

    let period: string;
    if (mode === 'quarterly') {
      const q = (i % 4) + 1;
      const y = currentYear - Math.floor(i / 4);
      period = `Q${q} ${y}`;
    } else if (mode === 'ttm') {
      period = 'TTM';
    } else {
      period = `${currentYear - i}`;
    }

    results.push({
      period,
      cash: Math.round(cash),
      totalDebt: Math.round(debt),
      totalAssets: Math.round(cash * 3 + debt * 0.5),
      totalLiabilities: Math.round(debt * 1.5),
    });
  }

  return results;
}

export interface SankeyData {
  nodes: { id: string; label: string; value: number; color: string }[];
  links: { source: string; target: string; value: number; color: string }[];
}

export function generateSankeyData(statement: FinancialStatement): SankeyData {
  const rev = statement.revenue;
  const gp = statement.grossProfit;
  const cogs = statement.costOfRevenue;
  const opex = statement.operatingExpenses;
  const oi = statement.operatingIncome;
  const ni = statement.netIncome;
  const taxes = Math.max(oi - ni, 0) * 0.7;
  const otherExpenses = Math.max(oi - ni - taxes, 0);

  return {
    nodes: [
      { id: 'revenue', label: 'Revenue', value: rev, color: '#AB9FF2' },
      { id: 'cogs', label: 'Cost of Revenue', value: cogs, color: '#FF7243' },
      { id: 'gross-profit', label: 'Gross Profit', value: gp, color: '#2EC08B' },
      { id: 'opex', label: 'Operating Expenses', value: opex, color: '#F59E0B' },
      { id: 'operating-income', label: 'Operating Income', value: oi, color: '#10B981' },
      { id: 'tax', label: 'Tax', value: taxes, color: '#FF7243' },
      { id: 'other-expenses', label: 'Other Expenses', value: otherExpenses, color: '#F97316' },
      { id: 'net-income', label: 'Net Income', value: ni, color: '#2EC08B' },
    ],
    links: [
      { source: 'revenue', target: 'cogs', value: cogs, color: '#FF724380' },
      { source: 'revenue', target: 'gross-profit', value: gp, color: '#2EC08B80' },
      { source: 'gross-profit', target: 'opex', value: opex, color: '#F59E0B80' },
      { source: 'gross-profit', target: 'operating-income', value: Math.max(oi, 0), color: '#10B98180' },
      { source: 'operating-income', target: 'tax', value: taxes, color: '#FF724380' },
      { source: 'operating-income', target: 'other-expenses', value: otherExpenses, color: '#F9731680' },
      { source: 'operating-income', target: 'net-income', value: Math.max(ni, 0), color: '#2EC08B80' },
    ].filter((l) => l.value > 0),
  };
}

export interface VolumeData {
  preMarketVolume: number;
  regularVolume: number;
  avgVolume30d: number;
}

export function generateVolumeData(symbol: string, currentVolume: number, avgVolume: number): VolumeData {
  const rand = seededRandom(hashSymbol(symbol) + Date.now() % 10000);
  return {
    preMarketVolume: Math.floor(currentVolume * (0.05 + rand() * 0.15)),
    regularVolume: currentVolume,
    avgVolume30d: avgVolume,
  };
}

export interface OptionsAggregate {
  putVolume: number;
  callVolume: number;
  putOI: number;
  callOI: number;
  putCallRatio: number;
  avgPutCallRatio: number;
  putAmount: number;
  callAmount: number;
}

export function generateOptionsAggregate(symbol: string): OptionsAggregate {
  const rand = seededRandom(hashSymbol(symbol) + 2000);
  const callVolume = Math.floor(rand() * 500000 + 50000);
  const putVolume = Math.floor(callVolume * (0.4 + rand() * 1.2));
  const callOI = Math.floor(rand() * 2000000 + 200000);
  const putOI = Math.floor(callOI * (0.5 + rand() * 1.0));
  const avgPrice = rand() * 10 + 2;

  return {
    putVolume,
    callVolume,
    putOI,
    callOI,
    putCallRatio: Math.round((putVolume / callVolume) * 100) / 100,
    avgPutCallRatio: Math.round((0.7 + rand() * 0.6) * 100) / 100,
    putAmount: Math.round(putVolume * avgPrice * 100),
    callAmount: Math.round(callVolume * avgPrice * 100),
  };
}
