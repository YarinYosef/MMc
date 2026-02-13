import {
  generateFinancials,
  generateBalanceSheet,
  generateSankeyData,
  generateVolumeData,
  generateOptionsAggregate,
} from '@/data/generators/financialGenerator';

describe('generateFinancials', () => {
  it('generates annual statements with correct count', () => {
    const stmts = generateFinancials('MSFT', 'annual', 5);
    expect(stmts).toHaveLength(5);
  });

  it('generates quarterly statements (4x years)', () => {
    const stmts = generateFinancials('MSFT', 'quarterly', 3);
    expect(stmts).toHaveLength(12);
  });

  it('generates TTM as single statement', () => {
    const stmts = generateFinancials('MSFT', 'ttm');
    expect(stmts).toHaveLength(1);
    expect(stmts[0].period).toBe('TTM');
  });

  it('produces valid financial fields', () => {
    const stmts = generateFinancials('AAPL', 'annual', 1);
    const s = stmts[0];
    expect(s.revenue).toBeGreaterThan(0);
    expect(s.costOfRevenue).toBeGreaterThan(0);
    expect(s.grossProfit).toBeGreaterThan(0);
    expect(s.operatingExpenses).toBeGreaterThan(0);
    expect(typeof s.operatingIncome).toBe('number');
    expect(typeof s.netIncome).toBe('number');
    expect(typeof s.eps).toBe('number');
    expect(typeof s.ebitda).toBe('number');
  });

  it('grossProfit = revenue - costOfRevenue', () => {
    const stmts = generateFinancials('MSFT', 'annual', 1);
    const s = stmts[0];
    expect(s.grossProfit).toBe(s.revenue - s.costOfRevenue);
  });

  it('produces deterministic results for same symbol', () => {
    const a = generateFinancials('MSFT', 'annual', 3);
    const b = generateFinancials('MSFT', 'annual', 3);
    expect(a.map((s) => s.revenue)).toEqual(b.map((s) => s.revenue));
  });

  it('produces different results for different symbols', () => {
    const a = generateFinancials('MSFT', 'annual', 1);
    const b = generateFinancials('GOOG', 'annual', 1);
    expect(a[0].revenue).not.toBe(b[0].revenue);
  });
});

describe('generateBalanceSheet', () => {
  it('generates correct number of periods', () => {
    const bs = generateBalanceSheet('MSFT', 'annual', 4);
    expect(bs).toHaveLength(4);
  });

  it('generates quarterly data', () => {
    const bs = generateBalanceSheet('MSFT', 'quarterly', 2);
    expect(bs).toHaveLength(8);
  });

  it('generates TTM as single period', () => {
    const bs = generateBalanceSheet('MSFT', 'ttm');
    expect(bs).toHaveLength(1);
    expect(bs[0].period).toBe('TTM');
  });

  it('produces positive balance sheet values', () => {
    const bs = generateBalanceSheet('AAPL', 'annual', 1);
    const b = bs[0];
    expect(b.cash).toBeGreaterThan(0);
    expect(b.totalDebt).toBeGreaterThan(0);
    expect(b.totalAssets).toBeGreaterThan(0);
    expect(b.totalLiabilities).toBeGreaterThan(0);
  });
});

describe('generateSankeyData', () => {
  it('produces nodes and links from a financial statement', () => {
    const stmts = generateFinancials('MSFT', 'annual', 1);
    const sankey = generateSankeyData(stmts[0]);
    expect(sankey.nodes.length).toBeGreaterThan(0);
    expect(sankey.links.length).toBeGreaterThan(0);
  });

  it('has revenue as a node', () => {
    const stmts = generateFinancials('MSFT', 'annual', 1);
    const sankey = generateSankeyData(stmts[0]);
    expect(sankey.nodes.find((n) => n.id === 'revenue')).toBeDefined();
  });

  it('has net-income as a node', () => {
    const stmts = generateFinancials('MSFT', 'annual', 1);
    const sankey = generateSankeyData(stmts[0]);
    expect(sankey.nodes.find((n) => n.id === 'net-income')).toBeDefined();
  });

  it('all links have positive values', () => {
    const stmts = generateFinancials('MSFT', 'annual', 1);
    const sankey = generateSankeyData(stmts[0]);
    sankey.links.forEach((link) => {
      expect(link.value).toBeGreaterThan(0);
    });
  });
});

describe('generateVolumeData', () => {
  it('produces volume breakdown', () => {
    const vol = generateVolumeData('MSFT', 25_000_000, 20_000_000);
    expect(vol.regularVolume).toBe(25_000_000);
    expect(vol.avgVolume30d).toBe(20_000_000);
    expect(vol.preMarketVolume).toBeGreaterThan(0);
    expect(vol.preMarketVolume).toBeLessThan(vol.regularVolume);
  });
});

describe('generateOptionsAggregate', () => {
  it('produces valid options aggregate data', () => {
    const opts = generateOptionsAggregate('MSFT');
    expect(opts.callVolume).toBeGreaterThan(0);
    expect(opts.putVolume).toBeGreaterThan(0);
    expect(opts.callOI).toBeGreaterThan(0);
    expect(opts.putOI).toBeGreaterThan(0);
    expect(opts.putCallRatio).toBeGreaterThan(0);
    expect(opts.avgPutCallRatio).toBeGreaterThan(0);
    expect(opts.callAmount).toBeGreaterThan(0);
    expect(opts.putAmount).toBeGreaterThan(0);
  });

  it('putCallRatio matches put/call volume ratio', () => {
    const opts = generateOptionsAggregate('AAPL');
    const expected = Math.round((opts.putVolume / opts.callVolume) * 100) / 100;
    expect(opts.putCallRatio).toBe(expected);
  });

  it('is deterministic for same symbol', () => {
    const a = generateOptionsAggregate('MSFT');
    const b = generateOptionsAggregate('MSFT');
    expect(a.callVolume).toBe(b.callVolume);
    expect(a.putVolume).toBe(b.putVolume);
  });
});
