'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

export function StructureSR({ state, expanded }: Props) {
  const d = state.details;
  const status = d.status as string;
  const support = Number(d.nearestSupport);
  const resistance = Number(d.nearestResistance);
  const distSupport = Number(d.distanceToSupport);
  const distResistance = Number(d.distanceToResistance);

  const color = status === 'Balanced' ? '#22C55E' : status === 'Imbalanced' ? '#F59E0B' : '#EF4444';

  // Compute approximate current price from support/resistance distances
  const midPoint = (support + resistance) / 2;
  const range = resistance - support;
  const pricePosition = range > 0 ? ((midPoint - support) / range) * 100 : 50;

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[10px] font-semibold text-slate-400">S/R</span>
        <span className="text-[10px] font-bold" style={{ color }}>{status}</span>
        <span className="text-[9px] font-mono text-slate-500">
          {distSupport.toFixed(1)}% / {distResistance.toFixed(1)}%
        </span>
      </div>
    );
  }

  return (
    <div className="p-3 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-300">Structure S/R</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
          {status}
        </span>
      </div>

      {/* Visual price position between S/R */}
      <div className="bg-slate-800/30 rounded p-2 mb-3">
        <div className="flex justify-between text-[9px] mb-1">
          <span className="text-green-400 font-mono">${support.toFixed(2)}</span>
          <span className="text-[8px] text-slate-500">Price Position</span>
          <span className="text-red-400 font-mono">${resistance.toFixed(2)}</span>
        </div>

        {/* S/R range bar with price marker */}
        <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden mb-1">
          {/* Green zone near support */}
          <div
            className="absolute left-0 top-0 h-full rounded-l-full"
            style={{ width: '30%', background: 'linear-gradient(to right, #22C55E30, transparent)' }}
          />
          {/* Red zone near resistance */}
          <div
            className="absolute right-0 top-0 h-full rounded-r-full"
            style={{ width: '30%', background: 'linear-gradient(to left, #EF444430, transparent)' }}
          />
          {/* Price position marker */}
          <div
            className="absolute top-0 h-full w-1 rounded-full transition-all duration-500"
            style={{
              left: `${Math.min(Math.max(pricePosition, 5), 95)}%`,
              backgroundColor: '#3B82F6',
              boxShadow: '0 0 4px #3B82F680',
            }}
          />
        </div>

        <div className="flex justify-between text-[7px] text-slate-600">
          <span>Support</span>
          <span>Resistance</span>
        </div>
      </div>

      {/* Distance metrics */}
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] text-green-400">Distance to Support</span>
            <span className="text-[10px] font-mono text-green-400">{distSupport.toFixed(2)}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(distSupport * 10, 100)}%`, backgroundColor: '#22C55E' }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] text-red-400">Distance to Resistance</span>
            <span className="text-[10px] font-mono text-red-400">{distResistance.toFixed(2)}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(distResistance * 10, 100)}%`, backgroundColor: '#EF4444' }}
            />
          </div>
        </div>
      </div>

      {/* Range info */}
      <div className="mt-2 pt-2 border-t border-slate-700/50 text-[9px] text-slate-500 flex justify-between">
        <span>Range: <span className="font-mono text-slate-400">${range.toFixed(2)}</span></span>
        <span>Confidence: <span className="font-mono text-slate-400">{state.confidence}%</span></span>
      </div>
    </div>
  );
}
