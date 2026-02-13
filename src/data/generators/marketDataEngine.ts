import { type Ticker, type PricePoint, type MarketIndex } from '@/data/types/market';
import { TICKER_UNIVERSE, type TickerDef } from '@/data/constants/tickers';

// Random walk parameters
const DRIFT = 0.0001; // slight upward bias
const VOLATILITY = 0.015; // daily volatility ~1.5%
const MEAN_REVERSION = 0.05; // mean reversion strength

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function generateBasePrice(marketCap: number): number {
  // Rough price estimation from market cap
  if (marketCap > 2000) return 150 + Math.random() * 300;
  if (marketCap > 500) return 100 + Math.random() * 200;
  if (marketCap > 100) return 50 + Math.random() * 150;
  return 20 + Math.random() * 80;
}

function initializeTicker(def: TickerDef): Ticker {
  const price = generateBasePrice(def.marketCap);
  const change = (Math.random() - 0.48) * price * 0.03;
  const previousClose = price - change;

  return {
    symbol: def.symbol,
    name: def.name,
    sector: def.sector,
    subSector: def.subSector,
    price,
    previousClose,
    change,
    changePercent: (change / previousClose) * 100,
    volume: Math.floor(Math.random() * 50_000_000) + 1_000_000,
    avgVolume: Math.floor(Math.random() * 30_000_000) + 5_000_000,
    marketCap: def.marketCap * 1_000_000_000,
    high52w: price * (1 + Math.random() * 0.3),
    low52w: price * (1 - Math.random() * 0.3),
    beta: 0.5 + Math.random() * 1.5,
    pe: 10 + Math.random() * 40,
    eps: price / (10 + Math.random() * 40),
    dividend: Math.random() > 0.4 ? Math.random() * 5 : 0,
    dividendYield: Math.random() > 0.4 ? Math.random() * 3 : 0,
  };
}

export function updateTickerPrice(ticker: Ticker): Ticker {
  const shock = gaussianRandom() * VOLATILITY;
  const drift = DRIFT;
  const meanRev = MEAN_REVERSION * (ticker.previousClose - ticker.price) / ticker.price;
  const returnRate = drift + shock + meanRev;

  const newPrice = Math.max(ticker.price * (1 + returnRate), 0.01);
  const change = newPrice - ticker.previousClose;
  const volumeChange = 1 + (Math.random() - 0.5) * 0.1;

  return {
    ...ticker,
    price: Math.round(newPrice * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round((change / ticker.previousClose) * 10000) / 100,
    volume: Math.floor(ticker.volume * volumeChange),
  };
}

export function generatePriceHistory(ticker: Ticker, points: number, intervalMs: number): PricePoint[] {
  const history: PricePoint[] = [];
  let price = ticker.price * (1 - Math.random() * 0.1);
  const now = Date.now();

  for (let i = points; i > 0; i--) {
    const timestamp = now - i * intervalMs;
    const open = price;
    const change = gaussianRandom() * VOLATILITY * price;
    const close = Math.max(open + change, 0.01);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = Math.floor(Math.random() * 10_000_000) + 500_000;

    history.push({
      timestamp,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });
    price = close;
  }

  return history;
}

class MarketDataEngine {
  private tickers: Map<string, Ticker> = new Map();
  private indices: MarketIndex[] = [];
  private listeners: Set<(tickers: Map<string, Ticker>) => void> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private updateInterval = 1500; // 1.5 seconds

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Initialize all tickers
    for (const def of TICKER_UNIVERSE) {
      this.tickers.set(def.symbol, initializeTicker(def));
    }

    // Initialize market indices
    this.indices = [
      { symbol: 'SPY', name: 'S&P 500', value: 5200 + Math.random() * 200, change: 0, changePercent: 0 },
      { symbol: 'QQQ', name: 'Nasdaq 100', value: 18000 + Math.random() * 500, change: 0, changePercent: 0 },
      { symbol: 'DIA', name: 'Dow Jones', value: 39000 + Math.random() * 1000, change: 0, changePercent: 0 },
      { symbol: 'IWM', name: 'Russell 2000', value: 2000 + Math.random() * 100, change: 0, changePercent: 0 },
      { symbol: 'VIX', name: 'VIX', value: 13 + Math.random() * 10, change: 0, changePercent: 0 },
    ];
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.tick(), this.updateInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick() {
    // Update a random subset of tickers each tick (more realistic)
    const symbols = Array.from(this.tickers.keys());
    const updateCount = Math.max(5, Math.floor(symbols.length * 0.3));
    const toUpdate = symbols.sort(() => Math.random() - 0.5).slice(0, updateCount);

    for (const symbol of toUpdate) {
      const ticker = this.tickers.get(symbol);
      if (ticker) {
        this.tickers.set(symbol, updateTickerPrice(ticker));
      }
    }

    // Update indices
    this.indices = this.indices.map((idx) => {
      const shock = gaussianRandom() * 0.002;
      const newValue = idx.value * (1 + shock);
      const change = newValue - idx.value;
      return {
        ...idx,
        value: Math.round(newValue * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round((change / idx.value) * 10000) / 100,
      };
    });

    this.notifyListeners();
  }

  subscribe(listener: (tickers: Map<string, Ticker>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(new Map(this.tickers));
    }
  }

  getTicker(symbol: string): Ticker | undefined {
    return this.tickers.get(symbol);
  }

  getAllTickers(): Map<string, Ticker> {
    return new Map(this.tickers);
  }

  getIndices(): MarketIndex[] {
    return [...this.indices];
  }

  setUpdateInterval(ms: number) {
    this.updateInterval = Math.max(500, Math.min(5000, ms));
    if (this.intervalId) {
      this.stop();
      this.start();
    }
  }
}

// Singleton instance
export const marketEngine = new MarketDataEngine();
