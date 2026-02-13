import { updateTickerPrice, generatePriceHistory } from '@/data/generators/marketDataEngine';
import type { Ticker } from '@/data/types/market';

const mockTicker: Ticker = {
  symbol: 'MSFT',
  name: 'Microsoft Corp',
  sector: 'Technology',
  subSector: 'Software',
  price: 400,
  previousClose: 398,
  change: 2,
  changePercent: 0.5,
  volume: 25_000_000,
  avgVolume: 20_000_000,
  marketCap: 3_100_000_000_000,
  high52w: 450,
  low52w: 300,
  beta: 1.1,
  pe: 35,
  eps: 11.43,
  dividend: 2.72,
  dividendYield: 0.68,
};

describe('updateTickerPrice', () => {
  it('returns a new ticker with updated price', () => {
    const updated = updateTickerPrice(mockTicker);
    expect(updated).not.toBe(mockTicker);
    expect(updated.symbol).toBe('MSFT');
    expect(typeof updated.price).toBe('number');
    expect(updated.price).toBeGreaterThan(0);
  });

  it('preserves previousClose', () => {
    const updated = updateTickerPrice(mockTicker);
    expect(updated.previousClose).toBe(mockTicker.previousClose);
  });

  it('updates change and changePercent consistently', () => {
    const updated = updateTickerPrice(mockTicker);
    const expectedChange = updated.price - updated.previousClose;
    expect(updated.change).toBeCloseTo(expectedChange, 1);
  });

  it('produces valid volume', () => {
    const updated = updateTickerPrice(mockTicker);
    expect(updated.volume).toBeGreaterThan(0);
    expect(Number.isInteger(updated.volume)).toBe(true);
  });

  it('price never goes below 0.01', () => {
    const cheapTicker = { ...mockTicker, price: 0.02, previousClose: 0.02 };
    // Run many iterations to test boundary
    for (let i = 0; i < 100; i++) {
      const updated = updateTickerPrice(cheapTicker);
      expect(updated.price).toBeGreaterThanOrEqual(0.01);
    }
  });
});

describe('generatePriceHistory', () => {
  it('generates the requested number of data points', () => {
    const history = generatePriceHistory(mockTicker, 50, 60000);
    expect(history).toHaveLength(50);
  });

  it('each point has required OHLCV fields', () => {
    const history = generatePriceHistory(mockTicker, 10, 60000);
    for (const point of history) {
      expect(point).toHaveProperty('timestamp');
      expect(point).toHaveProperty('open');
      expect(point).toHaveProperty('high');
      expect(point).toHaveProperty('low');
      expect(point).toHaveProperty('close');
      expect(point).toHaveProperty('volume');
      expect(point.high).toBeGreaterThanOrEqual(point.low);
      expect(point.volume).toBeGreaterThan(0);
    }
  });

  it('timestamps are in ascending order', () => {
    const history = generatePriceHistory(mockTicker, 20, 60000);
    for (let i = 1; i < history.length; i++) {
      expect(history[i].timestamp).toBeGreaterThan(history[i - 1].timestamp);
    }
  });

  it('all prices are positive', () => {
    const history = generatePriceHistory(mockTicker, 100, 60000);
    for (const point of history) {
      expect(point.open).toBeGreaterThan(0);
      expect(point.high).toBeGreaterThan(0);
      expect(point.low).toBeGreaterThan(0);
      expect(point.close).toBeGreaterThan(0);
    }
  });
});
