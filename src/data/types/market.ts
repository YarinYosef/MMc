export interface Ticker {
  symbol: string;
  name: string;
  sector: string;
  subSector: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  high52w: number;
  low52w: number;
  beta: number;
  pe: number;
  eps: number;
  dividend: number;
  dividendYield: number;
}

export interface PricePoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
}

export interface OptionsData {
  symbol: string;
  expiry: string;
  strike: number;
  type: 'call' | 'put';
  bid: number;
  ask: number;
  last: number;
  volume: number;
  openInterest: number;
  iv: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface InsiderTrade {
  date: string;
  insider: string;
  title: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  value: number;
}

export interface FinancialStatement {
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  netIncome: number;
  eps: number;
  ebitda: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD';

export type AssetClass = 'equity' | 'bond' | 'commodity' | 'crypto' | 'forex';
