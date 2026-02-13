import {
  getTickersBySection,
  getTickersBySubSector,
  searchTickers,
  getTickerInfo,
  formatPrice,
  formatChange,
  formatVolume,
  formatMarketCap,
} from '@/data/generators/tickerGenerator';

describe('getTickersBySection', () => {
  it('returns tickers for Technology sector', () => {
    const tickers = getTickersBySection('Technology');
    expect(tickers.length).toBeGreaterThan(0);
    expect(tickers).toContain('MSFT');
    expect(tickers).toContain('AAPL');
    expect(tickers).toContain('NVDA');
  });

  it('returns empty array for unknown sector', () => {
    const tickers = getTickersBySection('NonExistent');
    expect(tickers).toHaveLength(0);
  });
});

describe('getTickersBySubSector', () => {
  it('returns tickers for Semiconductors sub-sector', () => {
    const tickers = getTickersBySubSector('Semiconductors');
    expect(tickers).toContain('NVDA');
    expect(tickers).toContain('AMD');
  });
});

describe('searchTickers', () => {
  it('finds tickers by symbol', () => {
    const results = searchTickers('MSFT');
    expect(results).toContain('MSFT');
  });

  it('finds tickers by name (case-insensitive)', () => {
    const results = searchTickers('microsoft');
    expect(results).toContain('MSFT');
  });

  it('finds tickers by sector', () => {
    const results = searchTickers('Technology');
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns empty for no match', () => {
    const results = searchTickers('zzzzzzz');
    expect(results).toHaveLength(0);
  });
});

describe('getTickerInfo', () => {
  it('returns info for valid ticker', () => {
    const info = getTickerInfo('MSFT');
    expect(info).toBeDefined();
    expect(info!.symbol).toBe('MSFT');
    expect(info!.name).toBe('Microsoft Corp');
  });

  it('returns undefined for unknown ticker', () => {
    const info = getTickerInfo('ZZZZZ');
    expect(info).toBeUndefined();
  });
});

describe('formatPrice', () => {
  it('formats to 2 decimal places', () => {
    expect(formatPrice(123.456)).toBe('123.46');
    expect(formatPrice(100)).toBe('100.00');
  });
});

describe('formatChange', () => {
  it('formats positive change with + sign', () => {
    const result = formatChange(2.5, 1.25);
    expect(result).toContain('+');
    expect(result).toContain('2.50');
    expect(result).toContain('1.25%');
  });

  it('formats negative change', () => {
    const result = formatChange(-1.5, -0.75);
    expect(result).toContain('-1.50');
    expect(result).toContain('-0.75%');
  });
});

describe('formatVolume', () => {
  it('formats billions', () => {
    expect(formatVolume(2_500_000_000)).toBe('2.5B');
  });

  it('formats millions', () => {
    expect(formatVolume(25_000_000)).toBe('25.0M');
  });

  it('formats thousands', () => {
    expect(formatVolume(25_000)).toBe('25.0K');
  });

  it('formats small numbers as-is', () => {
    expect(formatVolume(500)).toBe('500');
  });
});

describe('formatMarketCap', () => {
  it('formats trillions', () => {
    expect(formatMarketCap(3_100_000_000_000)).toBe('$3.1T');
  });

  it('formats billions', () => {
    expect(formatMarketCap(500_000_000_000)).toBe('$500.0B');
  });

  it('formats millions', () => {
    expect(formatMarketCap(500_000_000)).toBe('$500.0M');
  });
});
