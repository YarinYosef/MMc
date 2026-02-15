'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function breadthColor(val: number): string {
  if (val > 65) return '#22C55E';
  if (val > 50) return '#86EFAC';
  if (val > 35) return '#F59E0B';
  return '#EF4444';
}

export function BreadthParticipation({ state, expanded }: Props) {
  const d = state.details;
  const status = d.status as string;
  const color = status === 'Confirming' ? '#22C55E' : '#EF4444';

  const aboveSMA20 = Number(d.aboveSMA20);
  const aboveSMA50 = Number(d.aboveSMA50);
  const aboveSMA200 = Number(d.aboveSMA200);
  const newHighs = Number(d.newHighs);
  const newLows = Number(d.newLows);
  const adRatio = Number(d.advanceDecline);
  const weighting = d.weightingCheck as string;

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">Breadth</span>
        <span className="text-[11px] font-bold" style={{ color }}>{status}</span>
        {/* Mini breadth bars */}
        <div className="flex items-end gap-px">
          {[aboveSMA20, aboveSMA50, aboveSMA200].map((val, i) => (
            <div
              key={i}
              className="w-1 rounded-t transition-all duration-500"
              style={{
                height: `${Math.max(val / 100 * 12, 2)}px`,
                backgroundColor: breadthColor(val),
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const smaRows = [
    { label: '% Above 20 SMA', value: aboveSMA20, period: 'Short-term' },
    { label: '% Above 50 SMA', value: aboveSMA50, period: 'Intermediate' },
    { label: '% Above 200 SMA', value: aboveSMA200, period: 'Long-term' },
  ];

  return (
    <div className="p-3 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#999999]">Breadth & Participation</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
          {status}
        </span>
      </div>

      {/* SMA breadth bars */}
      <div className="space-y-2 mb-3">
        {smaRows.map(({ label, value, period }) => {
          const c = breadthColor(value);
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#999999]">{label}</span>
                  <span className="text-[9px] text-[#777777]">({period})</span>
                </div>
                <span className="text-[11px] font-mono font-bold" style={{ color: c }}>{value}%</span>
              </div>
              <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
                {/* 50% threshold line */}
                <div className="absolute left-1/2 top-0 w-px h-full bg-white/[0.08]" />
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${value}%`, backgroundColor: c }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Market internals */}
      <div className="border-t border-white/[0.08] pt-2">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#777777]">New Highs</span>
            <span className="text-[11px] font-mono text-green-400">{newHighs}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#777777]">New Lows</span>
            <span className="text-[11px] font-mono text-red-400">{newLows}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#777777]">A/D Ratio</span>
            <span className="text-[11px] font-mono" style={{ color: adRatio > 1 ? '#22C55E' : '#EF4444' }}>
              {adRatio.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#777777]">Weighting</span>
            <span className="text-[11px] font-bold" style={{
              color: weighting === 'Healthy' ? '#22C55E' : weighting === 'Unhealthy' ? '#EF4444' : '#F59E0B'
            }}>
              {weighting}
            </span>
          </div>
        </div>

        {/* H/L ratio bar */}
        <div className="mt-1.5">
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden flex">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${newHighs + newLows > 0 ? (newHighs / (newHighs + newLows)) * 100 : 50}%`,
                backgroundColor: '#22C55E80',
              }}
            />
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${newHighs + newLows > 0 ? (newLows / (newHighs + newLows)) * 100 : 50}%`,
                backgroundColor: '#EF444480',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
