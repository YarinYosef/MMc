'use client';

import { type CompassState } from '@/data/types/compass';
import { useOnionStore } from '@/stores/useOnionStore';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function levelColor(level: string): string {
  if (level === 'Low') return '#2EC08B';
  if (level === 'Moderate') return '#F59E0B';
  return '#FF7243';
}

export function ShortInterest({ state, expanded }: Props) {
  const d = state.details;
  const level = d.level as string;
  const color = levelColor(level);
  const selectedSegment = useOnionStore((s) => s.selectedSegment);
  const onionLabel = selectedSegment || 'Current Asset';
  const siRatio = Number(d.siRatio);
  const dtc = Number(d.daysTocover);
  const ctb = Number(d.costToBorrow);
  const util = Number(d.utilization);
  const onionSI = Number(d.onionAssetSI);

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">SI</span>
        <span className="text-[11px] font-bold" style={{ color }}>{level}</span>
        <span className="text-[10px] font-mono text-[#777777]">{siRatio.toFixed(1)}%</span>
      </div>
    );
  }

  return (
    <div className="p-3 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#999999]">Short Interest</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
          {level}
        </span>
      </div>

      {/* Market-wide SI metrics */}
      <div className="space-y-2 mb-3">
        <MetricRow label="SI Ratio" value={`${siRatio.toFixed(2)}%`} barValue={siRatio / 30 * 100} barColor={siRatio > 15 ? '#FF7243' : siRatio > 5 ? '#F59E0B' : '#2EC08B'} />
        <MetricRow label="Days to Cover" value={dtc.toFixed(1)} barValue={dtc / 15 * 100} barColor={dtc > 8 ? '#FF7243' : dtc > 3 ? '#F59E0B' : '#2EC08B'} />
        <MetricRow label="Cost to Borrow" value={`${ctb.toFixed(2)}%`} barValue={ctb / 50 * 100} barColor={ctb > 20 ? '#FF7243' : ctb > 5 ? '#F59E0B' : '#2EC08B'} />
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span className="text-[#777777]">Utilization</span>
            <span className="font-mono text-[#999999]">{util}%</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${util}%`,
                background: util > 70
                  ? 'linear-gradient(to right, #F59E0B, #FF7243)'
                  : util > 40
                  ? 'linear-gradient(to right, #2EC08B, #F59E0B)'
                  : '#2EC08B',
              }}
            />
          </div>
        </div>
      </div>

      {/* Onion asset specific */}
      <div className="pt-2 border-t border-white/[0.08]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-[#AB9FF2] font-semibold">{onionLabel} SI</span>
          <span className="text-[11px] font-mono font-bold" style={{
            color: onionSI > 15 ? '#FF7243' : onionSI > 5 ? '#F59E0B' : '#2EC08B'
          }}>
            {onionSI.toFixed(2)}%
          </span>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(onionSI * 3, 100)}%`,
              backgroundColor: onionSI > 15 ? '#FF7243' : onionSI > 5 ? '#F59E0B' : '#2EC08B',
            }}
          />
        </div>
        <div className="flex justify-between text-[7px] text-[#777777] mt-0.5">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, barValue, barColor }: { label: string; value: string; barValue: number; barColor: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-0.5">
        <span className="text-[#777777]">{label}</span>
        <span className="font-mono text-[#999999]">{value}</span>
      </div>
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(barValue, 100)}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
