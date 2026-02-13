import {
  generateOrderBook,
  generateOptionsChain,
  generateInsiderTrades,
} from '@/data/generators/orderBookGenerator';

describe('generateOrderBook', () => {
  it('generates valid order book with bids and asks', () => {
    const book = generateOrderBook(400);
    expect(book.bids.length).toBeGreaterThan(0);
    expect(book.asks.length).toBeGreaterThan(0);
    expect(book.spread).toBeGreaterThan(0);
    expect(book.spreadPercent).toBeGreaterThan(0);
  });

  it('bids are in descending price order', () => {
    const book = generateOrderBook(400);
    for (let i = 1; i < book.bids.length; i++) {
      expect(book.bids[i - 1].price).toBeGreaterThan(book.bids[i].price);
    }
  });

  it('asks are in ascending price order', () => {
    const book = generateOrderBook(400);
    for (let i = 1; i < book.asks.length; i++) {
      expect(book.asks[i].price).toBeGreaterThan(book.asks[i - 1].price);
    }
  });

  it('cumulative totals are increasing', () => {
    const book = generateOrderBook(400);
    for (let i = 1; i < book.bids.length; i++) {
      expect(book.bids[i].total).toBeGreaterThan(book.bids[i - 1].total);
    }
    for (let i = 1; i < book.asks.length; i++) {
      expect(book.asks[i].total).toBeGreaterThan(book.asks[i - 1].total);
    }
  });

  it('best bid is below best ask', () => {
    const book = generateOrderBook(400);
    expect(book.bids[0].price).toBeLessThan(book.asks[0].price);
  });

  it('respects the levels parameter', () => {
    const book = generateOrderBook(400, 10);
    expect(book.bids).toHaveLength(10);
    expect(book.asks).toHaveLength(10);
  });
});

describe('generateOptionsChain', () => {
  it('generates options with correct types', () => {
    const chain = generateOptionsChain('MSFT', 400, 6);
    expect(chain.length).toBeGreaterThan(0);
    for (const opt of chain) {
      expect(opt.symbol).toBe('MSFT');
      expect(['call', 'put']).toContain(opt.type);
      expect(opt.strike).toBeGreaterThan(0);
      expect(opt.bid).toBeGreaterThanOrEqual(0);
      expect(opt.ask).toBeGreaterThanOrEqual(opt.bid);
      expect(typeof opt.iv).toBe('number');
      expect(typeof opt.delta).toBe('number');
      expect(opt.delta).toBeGreaterThanOrEqual(-1);
      expect(opt.delta).toBeLessThanOrEqual(1);
    }
  });

  it('has both calls and puts', () => {
    const chain = generateOptionsChain('MSFT', 400, 4);
    const calls = chain.filter((o) => o.type === 'call');
    const puts = chain.filter((o) => o.type === 'put');
    expect(calls.length).toBeGreaterThan(0);
    expect(puts.length).toBeGreaterThan(0);
  });
});

describe('generateInsiderTrades', () => {
  it('generates the requested number of trades', () => {
    const trades = generateInsiderTrades('MSFT', 400, 5);
    expect(trades).toHaveLength(5);
  });

  it('each trade has required fields', () => {
    const trades = generateInsiderTrades('MSFT', 400);
    for (const trade of trades) {
      expect(typeof trade.date).toBe('string');
      expect(typeof trade.insider).toBe('string');
      expect(typeof trade.title).toBe('string');
      expect(['buy', 'sell']).toContain(trade.type);
      expect(trade.shares).toBeGreaterThan(0);
      expect(trade.price).toBeGreaterThan(0);
      expect(trade.value).toBeGreaterThan(0);
    }
  });
});
