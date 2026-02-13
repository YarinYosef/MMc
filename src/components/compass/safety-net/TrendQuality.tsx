'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function qualityColor(q: number): string {
  if (q > 75) return '#22C55E';
  if (q > 55) return '#86EFAC';
  if (q > 40) return '#F59E0B';
  if (q > 25) return '#FCA5A5';
  return '#EF4444';
}

function qualityLabel(q: number): string {
  if (q > 75) return 'Strong';
  if (q > 55) return 'Good';
  if (q > 40) return 'Fair';
  if (q > 25) return 'Weak';
  return 'Poor';
}

export function TrendQuality({ state, expanded }: Props) {
  const d = state.details;
  const quality = Number(d.quality);
  const color = qualityColor(quality);
  const trendLine = d.trendLine as string;
  const maAlignment = d.maAlignment as string;

  const trendColor = trendLine === 'Up' ? '#22C55E' : trendLine === 'Down' ? '#EF4444' : '#9CA3AF';
  const maColor = maAlignment === 'Bullish' ? '#22C55E' : maAlignment === 'Bearish' ? '#EF4444' : '#F59E0B';

  if (!expanded) {
    return (
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="text-[10px] font-semibold text-slate-400">Trend</span>
        <div className="w-8 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${quality}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-[10px] font-mono font-bold" style={{ color }}>{quality}%</span>
        {/* Trend direction arrow */}
        <svg width="8" height="8" viewBox="0 0 8 8" className="shrink-0">
          <path
            d={trendLine === 'Up' ? 'M4 7 L4 1 M2 3 L4 1 L6 3' : trendLine === 'Down' ? 'M4 1 L4 7 M2 5 L4 7 L6 5' : 'M1 4 L7 4'}
            stroke={trendColor}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="p-3 w-56">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-300">Trend Quality</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
          {qualityLabel(quality)}
        </span>
      </div>

      {/* Quality gauge */}
      <div className="bg-slate-800/30 rounded px-3 py-2 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${quality}%`,
                  background: quality > 60
                    ? 'linear-gradient(to right, #F59E0B, #22C55E)'
                    : quality > 35
                    ? 'linear-gradient(to right, #EF4444, #F59E0B)'
                    : '#EF4444',
                }}
              />
            </div>
            {/* Scale markers */}
            <div className="flex justify-between text-[7px] text-slate-600 mt-0.5">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
          <span className="text-xl font-mono font-bold" style={{ color }}>{quality}%</span>
        </div>
      </div>

      {/* Trend metrics */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500">Trend Direction</span>
          <div className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path
                d={trendLine === 'Up' ? 'M5 8 L5 2 M3 4 L5 2 L7 4' : trendLine === 'Down' ? 'M5 2 L5 8 M3 6 L5 8 L7 6' : 'M2 5 L8 5'}
                stroke={trendColor}
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[10px] font-bold" style={{ color: trendColor }}>{trendLine}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500">MA Alignment</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: maColor, backgroundColor: `${maColor}15` }}>
            {maAlignment}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-2 pt-2 border-t border-slate-700/50 text-[9px] text-slate-500">
        Confidence: <span className="font-mono text-slate-400">{state.confidence}%</span>
      </div>
    </div>
  );
}
