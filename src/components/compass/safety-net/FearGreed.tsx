'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function indexColor(index: number): string {
  if (index < 25) return '#FF7243';
  if (index < 40) return '#FCA5A5';
  if (index < 60) return '#F59E0B';
  if (index < 75) return '#86EFAC';
  return '#2EC08B';
}

function indexLabel(index: number): string {
  if (index < 20) return 'Extreme Fear';
  if (index < 40) return 'Fear';
  if (index < 60) return 'Neutral';
  if (index < 80) return 'Greed';
  return 'Extreme Greed';
}

export function FearGreed({ state, expanded }: Props) {
  const d = state.details;
  const index = Number(d.index);
  const label = indexLabel(index);
  const color = indexColor(index);
  const previous = Number(d.previous);
  const weekAgo = Number(d.weekAgo);

  const change = index - previous;

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">F&G</span>
        <span className="text-[11px] font-mono font-bold" style={{ color }}>{index}</span>
        <span className="text-[10px]" style={{ color }}>{label}</span>
      </div>
    );
  }

  return (
    <div className="p-3 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#999999]">Fear & Greed Index</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
          {label}
        </span>
      </div>

      {/* Large index display */}
      <div className="flex items-center justify-center mb-3">
        <div className="relative">
          {/* Semicircle gauge */}
          <svg width="140" height="80" viewBox="0 0 140 80">
            {/* Background arc */}
            <path
              d="M 10 70 A 60 60 0 0 1 130 70"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Gradient arc segments */}
            <path d="M 10 70 A 60 60 0 0 1 34 26" fill="none" stroke="#FF7243" strokeWidth="10" strokeLinecap="round" />
            <path d="M 34 26 A 60 60 0 0 1 70 10" fill="none" stroke="#F59E0B" strokeWidth="10" />
            <path d="M 70 10 A 60 60 0 0 1 106 26" fill="none" stroke="#86EFAC" strokeWidth="10" />
            <path d="M 106 26 A 60 60 0 0 1 130 70" fill="none" stroke="#2EC08B" strokeWidth="10" strokeLinecap="round" />
            {/* Needle */}
            {(() => {
              const angle = Math.PI - (index / 100) * Math.PI;
              const nx = 70 + 45 * Math.cos(angle);
              const ny = 70 - 45 * Math.sin(angle);
              return (
                <>
                  <line x1="70" y1="70" x2={nx} y2={ny} stroke={color} strokeWidth="2" strokeLinecap="round" />
                  <circle cx="70" cy="70" r="4" fill={color} />
                </>
              );
            })()}
          </svg>
          {/* Value display */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
            <span className="text-2xl font-mono font-bold" style={{ color }}>{index}</span>
          </div>
        </div>
      </div>

      {/* Historical comparison */}
      <div className="border-t border-white/[0.08] pt-2">
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div className="text-center">
            <div className="text-[9px] text-[#777777]">Now</div>
            <div className="font-mono font-bold" style={{ color }}>{index}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-[#777777]">Previous</div>
            <div className="font-mono" style={{ color: indexColor(previous) }}>{previous}</div>
            <div className="text-[9px] font-mono" style={{ color: change > 0 ? '#2EC08B' : change < 0 ? '#FF7243' : '#9CA3AF' }}>
              {change > 0 ? '+' : ''}{change}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-[#777777]">Week Ago</div>
            <div className="font-mono" style={{ color: indexColor(weekAgo) }}>{weekAgo}</div>
            <div className="text-[9px] font-mono" style={{ color: index - weekAgo > 0 ? '#2EC08B' : index - weekAgo < 0 ? '#FF7243' : '#9CA3AF' }}>
              {index - weekAgo > 0 ? '+' : ''}{index - weekAgo}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
