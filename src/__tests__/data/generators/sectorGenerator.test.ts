import {
  generateSectorPerformance,
  generateSubSectorPerformance,
  generateSectorRotationData,
} from '@/data/generators/sectorGenerator';
import { SECTOR_HIERARCHY } from '@/data/constants/sectors';

describe('generateSectorPerformance', () => {
  it('returns data for all sectors', () => {
    const data = generateSectorPerformance();
    expect(data).toHaveLength(SECTOR_HIERARCHY.length);
  });

  it('each entry has required fields', () => {
    const data = generateSectorPerformance();
    for (const entry of data) {
      expect(typeof entry.name).toBe('string');
      expect(typeof entry.etf).toBe('string');
      expect(typeof entry.change).toBe('number');
      expect(typeof entry.changePercent).toBe('number');
      expect(typeof entry.volume).toBe('number');
      expect(entry.volume).toBeGreaterThan(0);
      expect(typeof entry.relativeStrength).toBe('number');
    }
  });
});

describe('generateSubSectorPerformance', () => {
  it('returns sub-sectors for a valid sector', () => {
    const data = generateSubSectorPerformance('Technology');
    expect(data.length).toBeGreaterThan(0);
    for (const entry of data) {
      expect(entry.sector).toBe('Technology');
      expect(typeof entry.name).toBe('string');
      expect(typeof entry.change).toBe('number');
    }
  });

  it('returns empty array for unknown sector', () => {
    const data = generateSubSectorPerformance('NonExistent');
    expect(data).toHaveLength(0);
  });
});

describe('generateSectorRotationData', () => {
  it('returns rotation data for all sectors', () => {
    const data = generateSectorRotationData();
    expect(data).toHaveLength(SECTOR_HIERARCHY.length);
  });

  it('each entry has momentum, relative strength, and flow score', () => {
    const data = generateSectorRotationData();
    for (const entry of data) {
      expect(typeof entry.momentum).toBe('number');
      expect(typeof entry.relativeStrength).toBe('number');
      expect(typeof entry.flowScore).toBe('number');
      expect(typeof entry.color).toBe('string');
    }
  });
});
