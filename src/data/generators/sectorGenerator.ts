import { SECTOR_HIERARCHY } from '@/data/constants/sectors';

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export interface SectorPerformance {
  name: string;
  etf: string;
  change: number;
  changePercent: number;
  volume: number;
  relativeStrength: number; // vs SPY
}

export interface SubSectorPerformance {
  name: string;
  sector: string;
  change: number;
  changePercent: number;
}

export function generateSectorPerformance(): SectorPerformance[] {
  return SECTOR_HIERARCHY.map((sector) => {
    const changePercent = gaussianRandom() * 1.5;
    return {
      name: sector.name,
      etf: sector.etf,
      change: Math.round(changePercent * 52 * 100) / 100, // rough price change
      changePercent: Math.round(changePercent * 100) / 100,
      volume: Math.floor(Math.random() * 100_000_000) + 10_000_000,
      relativeStrength: Math.round((changePercent + (Math.random() - 0.5)) * 100) / 100,
    };
  });
}

export function generateSubSectorPerformance(sectorName: string): SubSectorPerformance[] {
  const sector = SECTOR_HIERARCHY.find((s) => s.name === sectorName);
  if (!sector) return [];

  return sector.subSectors.map((sub) => ({
    name: sub.name,
    sector: sectorName,
    change: Math.round(gaussianRandom() * 2 * 100) / 100,
    changePercent: Math.round(gaussianRandom() * 2 * 100) / 100,
  }));
}

export function generateSectorRotationData() {
  return SECTOR_HIERARCHY.map((sector) => ({
    name: sector.name,
    color: sector.color,
    momentum: Math.round(gaussianRandom() * 30),
    relativeStrength: Math.round(gaussianRandom() * 20),
    flowScore: Math.round((Math.random() - 0.5) * 100),
  }));
}
