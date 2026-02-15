'use client';

import { type CompassState } from '@/data/types/compass';
import { useOnionStore } from '@/stores/useOnionStore';

interface Props {
  state: CompassState;
  expanded: boolean;
}

export function GammaCompass({ state, expanded }: Props) {
  const d = state.details;
  const isPositive = d.isPositive === 'Positive';
  const color = isPositive ? '#22C55E' : '#EF4444';
  const gex = Number(d.gex);
  const selectedSegment = useOnionStore((s) => s.selectedSegment);
  const onionLabel = selectedSegment || 'Current Asset';

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">GEX</span>
        <span className="text-[11px] font-bold" style={{ color }}>
          {isPositive ? '+' : ''}{gex.toLocaleString()}
        </span>
      </div>
    );
  }

  const indices = [
    { label: 'SPX', value: Number(d.spxGex), isOnion: false },
    { label: 'QQQ', value: Number(d.qqqGex), isOnion: false },
    { label: 'IWM', value: Number(d.iwmGex), isOnion: false },
    { label: onionLabel, value: Number(d.onionAssetGex), isOnion: true },
  ];

  const maxAbsGex = Math.max(...indices.map(i => Math.abs(i.value)), 1);

  return (
    <div className="p-3 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#999999]">Gamma Exposure</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
          {d.isPositive}
        </span>
      </div>

      {/* Net GEX display */}
      <div className="bg-white/[0.03] rounded px-3 py-2 mb-3 flex items-center justify-between">
        <span className="text-[10px] text-[#777777]">Net Gamma</span>
        <span className="text-lg font-mono font-bold" style={{ color }}>
          {isPositive ? '+' : ''}{gex.toLocaleString()}
        </span>
      </div>

      {/* Index breakdown with bidirectional bars */}
      <div className="space-y-2">
        {indices.map(({ label, value, isOnion }) => {
          const c = value > 0 ? '#22C55E' : '#EF4444';
          const barWidth = (Math.abs(value) / maxAbsGex) * 50;
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-[11px] ${isOnion ? 'text-[#AB9FF2] font-semibold' : 'text-[#999999]'}`}>
                  {label}
                </span>
                <span className="text-[11px] font-mono font-bold" style={{ color: c }}>
                  {value > 0 ? '+' : ''}{value.toLocaleString()}
                </span>
              </div>
              {/* Bidirectional bar from center */}
              <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="absolute left-1/2 top-0 w-px h-full bg-white/[0.06]" />
                <div
                  className="absolute h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: c,
                    left: value >= 0 ? '50%' : `${50 - barWidth}%`,
                    opacity: isOnion ? 1 : 0.7,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Flip level */}
      <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#777777]">Flip Level</span>
          <span className="font-mono text-[#999999]">{Number(d.flipLevel).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#777777]">Regime</span>
          <span className="font-mono" style={{ color }}>
            {isPositive ? 'Dealer Long' : 'Dealer Short'}
          </span>
        </div>
      </div>
    </div>
  );
}
