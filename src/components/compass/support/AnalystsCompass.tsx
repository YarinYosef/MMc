'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function speedColor(speed: string): string {
  if (speed === 'Fast') return '#22C55E';
  if (speed === 'Moderate') return '#F59E0B';
  return '#9CA3AF';
}

export function AnalystsCompass({ state, expanded }: Props) {
  const d = state.details;
  const direction = d.revisionDirection as string;
  const speed = d.revisionSpeed as string;
  const coverage = Number(d.coverage);
  const dispersion = Number(d.dispersion);

  const dirColor = direction === 'Up' ? '#22C55E' : direction === 'Down' ? '#EF4444' : '#9CA3AF';
  const spdColor = speedColor(speed);

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">Analysts</span>
        {/* Direction arrow SVG */}
        <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0">
          <path
            d={direction === 'Up' ? 'M5 8 L5 2 M3 4 L5 2 L7 4' : direction === 'Down' ? 'M5 2 L5 8 M3 6 L5 8 L7 6' : 'M2 5 L8 5'}
            stroke={dirColor}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[11px] font-bold" style={{ color: dirColor }}>{direction}</span>
        <span className="text-[10px]" style={{ color: spdColor }}>{speed}</span>
      </div>
    );
  }

  return (
    <div className="p-3 w-56">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#999999]">Analyst Revisions</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: dirColor, backgroundColor: `${dirColor}15` }}>
          {direction}
        </span>
      </div>

      {/* Direction + Speed visual */}
      <div className="bg-white/[0.03] rounded px-3 py-2 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d={direction === 'Up' ? 'M10 16 L10 4 M6 8 L10 4 L14 8' : direction === 'Down' ? 'M10 4 L10 16 M6 12 L10 16 L14 12' : 'M4 10 L16 10'}
              stroke={dirColor}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <div>
            <div className="text-[11px] text-[#777777]">Revision Direction</div>
            <div className="text-sm font-bold" style={{ color: dirColor }}>{direction}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-[#777777]">Speed</div>
          <div className="text-sm font-bold" style={{ color: spdColor }}>{speed}</div>
        </div>
      </div>

      {/* Coverage & Dispersion */}
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span className="text-[#999999]">Coverage</span>
            <span className="font-mono text-[#999999]">{coverage} analysts</span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(coverage / 50 * 100, 100)}%`,
                backgroundColor: coverage > 20 ? '#22C55E' : coverage > 10 ? '#F59E0B' : '#EF4444',
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span className="text-[#999999]">Dispersion</span>
            <span className="font-mono" style={{
              color: dispersion > 50 ? '#EF4444' : dispersion > 30 ? '#F59E0B' : '#22C55E'
            }}>
              {dispersion}%
            </span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${dispersion}%`,
                backgroundColor: dispersion > 50 ? '#EF4444' : dispersion > 30 ? '#F59E0B' : '#22C55E',
              }}
            />
          </div>
          <div className="flex justify-between text-[7px] text-[#777777] mt-0.5">
            <span>Consensus</span>
            <span>Dispersed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
