import { type OrderBook, type OrderBookEntry, type OptionsData, type InsiderTrade } from '@/data/types/market';

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function generateOrderBook(midPrice: number, levels: number = 20): OrderBook {
  const spread = midPrice * (0.0001 + Math.random() * 0.001);
  const bidBase = midPrice - spread / 2;
  const askBase = midPrice + spread / 2;

  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 0; i < levels; i++) {
    const bidPrice = Math.round((bidBase - i * spread * 0.5) * 100) / 100;
    const bidSize = Math.floor(Math.abs(gaussianRandom()) * 5000 + 100);
    bidTotal += bidSize;
    bids.push({ price: bidPrice, size: bidSize, total: bidTotal });

    const askPrice = Math.round((askBase + i * spread * 0.5) * 100) / 100;
    const askSize = Math.floor(Math.abs(gaussianRandom()) * 5000 + 100);
    askTotal += askSize;
    asks.push({ price: askPrice, size: askSize, total: askTotal });
  }

  return {
    bids,
    asks,
    spread: Math.round(spread * 100) / 100,
    spreadPercent: Math.round((spread / midPrice) * 10000) / 100,
  };
}

export function generateOptionsChain(symbol: string, stockPrice: number, count: number = 10): OptionsData[] {
  const options: OptionsData[] = [];
  const strikeStep = Math.round(stockPrice * 0.025);
  const baseStrike = Math.round(stockPrice / strikeStep) * strikeStep;

  const expiries = ['2025-06-20', '2025-07-18', '2025-08-15'];

  for (const expiry of expiries) {
    for (let i = -count / 2; i <= count / 2; i++) {
      const strike = baseStrike + i * strikeStep;
      const moneyness = (stockPrice - strike) / stockPrice;

      for (const type of ['call', 'put'] as const) {
        const iv = 0.2 + Math.abs(moneyness) * 0.5 + Math.random() * 0.1;
        const intrinsic =
          type === 'call'
            ? Math.max(stockPrice - strike, 0)
            : Math.max(strike - stockPrice, 0);
        const timeValue = stockPrice * iv * 0.1 * (1 + Math.random() * 0.5);
        const premium = intrinsic + timeValue;

        const delta =
          type === 'call'
            ? 0.5 + moneyness * 2
            : -(0.5 - moneyness * 2);

        options.push({
          symbol,
          expiry,
          strike,
          type,
          bid: Math.round((premium * 0.98) * 100) / 100,
          ask: Math.round((premium * 1.02) * 100) / 100,
          last: Math.round(premium * 100) / 100,
          volume: Math.floor(Math.random() * 10000),
          openInterest: Math.floor(Math.random() * 50000),
          iv: Math.round(iv * 10000) / 100,
          delta: Math.round(Math.max(-1, Math.min(1, delta)) * 1000) / 1000,
          gamma: Math.round(Math.abs(gaussianRandom()) * 0.05 * 1000) / 1000,
          theta: -Math.round(Math.abs(gaussianRandom()) * premium * 0.02 * 100) / 100,
          vega: Math.round(Math.abs(gaussianRandom()) * 0.3 * 100) / 100,
        });
      }
    }
  }

  return options;
}

const INSIDER_NAMES = [
  'John Smith', 'Sarah Johnson', 'Michael Chen', 'Lisa Wang',
  'Robert Davis', 'Jennifer Lee', 'David Wilson', 'Emily Brown',
];

const INSIDER_TITLES = [
  'CEO', 'CFO', 'CTO', 'COO', 'VP Engineering', 'Director', 'Board Member', 'SVP Sales',
];

export function generateInsiderTrades(symbol: string, stockPrice: number, count: number = 8): InsiderTrade[] {
  return Array.from({ length: count }, (_, i) => {
    const type = Math.random() > 0.4 ? 'buy' : 'sell';
    const shares = Math.floor(Math.random() * 50000) + 1000;
    const price = stockPrice * (0.9 + Math.random() * 0.2);

    return {
      date: new Date(Date.now() - i * 86400000 * (3 + Math.floor(Math.random() * 7))).toISOString().split('T')[0],
      insider: INSIDER_NAMES[Math.floor(Math.random() * INSIDER_NAMES.length)],
      title: INSIDER_TITLES[Math.floor(Math.random() * INSIDER_TITLES.length)],
      type,
      shares,
      price: Math.round(price * 100) / 100,
      value: Math.round(shares * price),
    };
  });
}
