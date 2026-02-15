'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function riskColor(label: string): string {
  if (label === 'Crowded') return '#EF4444';
  if (label === 'Stretched') return '#F59E0B';
  return '#22C55E';
}

function gaugeColor(val: number): string {
  if (val > 70) return '#EF4444';
  if (val > 50) return '#F59E0B';
  if (val > 30) return '#86EFAC';
  return '#22C55E';
}

export function FuturesPositioning({ state, expanded }: Props) {
  const d = state.details;
  const riskLabel = d.riskLabel as string;
  const crowding = Number(d.crowding);
  const stretching = Number(d.stretching);
  const netSpec = Number(d.netSpeculative);
  const comHedging = Number(d.commercialHedging);

  const color = riskColor(riskLabel);

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">Futures</span>
        <span className="text-[11px] font-bold" style={{ color }}>{riskLabel}</span>
        {/* Mini dual gauge */}
        <div className="flex items-center gap-0.5">
          <div className="w-4 h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${crowding}%`, backgroundColor: gaugeColor(crowding) }} />
          </div>
          <div className="w-4 h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${stretching}%`, backgroundColor: gaugeColor(stretching) }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#999999]">Futures Positioning</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
          {riskLabel}
        </span>
      </div>

      {/* Crowding gauge */}
      <div className="space-y-3 mb-3">
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span className="text-[#999999]">Crowding</span>
            <span className="font-mono font-bold" style={{ color: gaugeColor(crowding) }}>{crowding}%</span>
          </div>
          <div className="relative h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
            {/* Threshold markers */}
            <div className="absolute top-0 h-full w-px bg-white/[0.08]" style={{ left: '50%' }} />
            <div className="absolute top-0 h-full w-px bg-white/[0.08]" style={{ left: '70%' }} />
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${crowding}%`, backgroundColor: gaugeColor(crowding) }}
            />
          </div>
          <div className="flex justify-between text-[7px] text-[#777777] mt-0.5">
            <span>Light</span>
            <span>Moderate</span>
            <span>Crowded</span>
          </div>
        </div>

        {/* Stretching gauge */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span className="text-[#999999]">Stretching</span>
            <span className="font-mono font-bold" style={{ color: gaugeColor(stretching) }}>{stretching}%</span>
          </div>
          <div className="relative h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="absolute top-0 h-full w-px bg-white/[0.08]" style={{ left: '50%' }} />
            <div className="absolute top-0 h-full w-px bg-white/[0.08]" style={{ left: '70%' }} />
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${stretching}%`, backgroundColor: gaugeColor(stretching) }}
            />
          </div>
          <div className="flex justify-between text-[7px] text-[#777777] mt-0.5">
            <span>Neutral</span>
            <span>Extended</span>
            <span>Stretched</span>
          </div>
        </div>
      </div>

      {/* Positioning data */}
      <div className="border-t border-white/[0.08] pt-2 space-y-1.5">
        <div className="flex justify-between text-[11px]">
          <span className="text-[#777777]">Net Speculative</span>
          <span className="font-mono font-bold" style={{ color: netSpec > 0 ? '#22C55E' : '#EF4444' }}>
            {netSpec > 0 ? '+' : ''}{netSpec.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-[#777777]">Commercial Hedging</span>
          <span className="font-mono font-bold" style={{ color: comHedging > 0 ? '#22C55E' : '#EF4444' }}>
            {comHedging > 0 ? '+' : ''}{comHedging.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
