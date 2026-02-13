import { cn, formatNumber, formatCurrency, formatPercent, clamp, lerp } from '@/lib/utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters out falsy values', () => {
    expect(cn('a', undefined, 'b', null, false, 'c')).toBe('a b c');
  });

  it('returns empty string for no args', () => {
    expect(cn()).toBe('');
  });
});

describe('formatNumber', () => {
  it('formats with default 2 decimal places', () => {
    const result = formatNumber(1234.567);
    expect(result).toContain('1');
    expect(result).toContain('234');
  });

  it('formats with custom decimal places', () => {
    const result = formatNumber(1234.5, 0);
    expect(result).not.toContain('.');
  });
});

describe('formatCurrency', () => {
  it('formats trillions', () => {
    expect(formatCurrency(3_100_000_000_000)).toBe('$3.1T');
  });

  it('formats billions', () => {
    expect(formatCurrency(500_000_000_000)).toBe('$500.0B');
  });

  it('formats millions', () => {
    expect(formatCurrency(500_000_000)).toBe('$500.0M');
  });

  it('formats thousands', () => {
    expect(formatCurrency(5_000)).toBe('$5.0K');
  });

  it('formats small values', () => {
    expect(formatCurrency(99.5)).toBe('$99.50');
  });

  it('formats negative trillions', () => {
    expect(formatCurrency(-3_100_000_000_000)).toBe('$-3.1T');
  });
});

describe('formatPercent', () => {
  it('formats positive with + sign', () => {
    expect(formatPercent(5.25)).toBe('+5.25%');
  });

  it('formats negative without + sign', () => {
    expect(formatPercent(-3.14)).toBe('-3.14%');
  });

  it('formats zero with + sign', () => {
    expect(formatPercent(0)).toBe('+0.00%');
  });
});

describe('clamp', () => {
  it('clamps below min', () => {
    expect(clamp(-5, 0, 100)).toBe(0);
  });

  it('clamps above max', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it('passes through values in range', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });
});

describe('lerp', () => {
  it('returns start when t=0', () => {
    expect(lerp(0, 100, 0)).toBe(0);
  });

  it('returns end when t=1', () => {
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it('returns midpoint when t=0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
  });
});
