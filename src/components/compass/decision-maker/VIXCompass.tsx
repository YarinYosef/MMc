'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function stressColor(score: number): string {
  if (score < 25) return '#22C55E';
  if (score < 50) return '#F59E0B';
  if (score < 75) return '#F97316';
  return '#EF4444';
}

function stressLabel(score: number): string {
  if (score < 25) return 'Calm';
  if (score < 50) return 'Normal';
  if (score < 75) return 'Elevated';
  return 'Extreme';
}

function SemiGauge({ value, max, label, color, size = 24 }: { value: number; max: number; label: string; color: string; size?: number }) {
  const ratio = Math.min(Math.max(value / max, 0), 1);
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = Math.PI;
  const endAngle = Math.PI + Math.PI * ratio;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);

  const largeArc = ratio > 0.5 ? 1 : 0;

  return (
    <svg width={size} height={size / 2 + 2} className="shrink-0">
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="2.5"
      />
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <text x={cx} y={cy - 1} textAnchor="middle" fontSize="6" fill="#999999" fontFamily="monospace">
        {label}
      </text>
    </svg>
  );
}

export function VIXCompass({ state, expanded }: Props) {
  const d = state.details;
  const spotVix = Number(d.spotVix);
  const skew = Number(d.skew);
  const vvix = Number(d.vvix);
  const combinedStress = Number(d.combinedStress);
  const color = stressColor(combinedStress);
  const vix9d = Number(d.vix9d);
  const vix3m = Number(d.vix3m);

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">VIX</span>
        <div className="flex flex-row items-center gap-0.5" style={{ lineHeight: 0 }}>
          <SemiGauge value={spotVix} max={50} label="VIX" color={stressColor((spotVix / 50) * 100)} size={22} />
          <SemiGauge value={Math.max(skew - 100, 0)} max={70} label="SKW" color={stressColor(Math.max((skew - 100) / 70, 0) * 100)} size={22} />
          <SemiGauge value={Math.max(vvix - 60, 0)} max={80} label="VV" color={stressColor(Math.max((vvix - 60) / 80, 0) * 100)} size={22} />
        </div>
        <span className="text-[11px] font-mono font-bold" style={{ color }}>
          {combinedStress}
        </span>
      </div>
    );
  }

  return (
    <div className="p-3 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#999999]">VIX Compass</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#777777]">Combined Stress</span>
          <StressGauge value={combinedStress} />
        </div>
      </div>

      {/* Stress label */}
      <div className="flex items-center justify-center mb-3">
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{ color, backgroundColor: `${color}15` }}
        >
          {stressLabel(combinedStress)} ({combinedStress}/100)
        </span>
      </div>

      {/* Three dimension rows */}
      <div className="space-y-3 mb-3">
        <DimensionRow
          label="Volatility Regime (VIX)"
          value={spotVix}
          status={d.volRegime as string}
          momentum={Number(d.vixMomentum)}
          min={9}
          max={50}
          thresholds={[15, 20, 30]}
          thresholdLabels={['Low', 'Norm', 'High', 'Ext']}
        />
        <DimensionRow
          label="Tail Risk Bid (SKEW)"
          value={skew}
          status={d.tailBid as string}
          momentum={Number(d.skewMomentum)}
          min={100}
          max={170}
          thresholds={[115, 130, 145]}
          thresholdLabels={['Low', 'Norm', 'High', 'Ext']}
        />
        <DimensionRow
          label="Systematic Pressure (VVIX)"
          value={vvix}
          status={d.systematicPressure as string}
          momentum={Number(d.vvixMomentum)}
          min={60}
          max={140}
          thresholds={[80, 95, 110]}
          thresholdLabels={['Low', 'Norm', 'High', 'Ext']}
        />
      </div>

      {/* Term structure */}
      <div className="border-t border-white/[0.08] pt-2">
        <div className="text-[10px] text-[#777777] uppercase tracking-wider mb-1.5 font-semibold">Term Structure</div>
        <div className="flex items-end justify-between px-2">
          {/* 9D bar */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-[11px] font-mono text-[#999999]">{vix9d.toFixed(1)}</div>
            <div
              className="w-6 rounded-t transition-all duration-500"
              style={{
                height: `${Math.max((vix9d / 50) * 40, 4)}px`,
                backgroundColor: stressColor((vix9d / 50) * 100),
              }}
            />
            <div className="text-[9px] text-[#777777]">9D</div>
          </div>
          {/* Spot bar */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-[11px] font-mono font-bold text-white">{spotVix.toFixed(1)}</div>
            <div
              className="w-8 rounded-t transition-all duration-500 border border-black"
              style={{
                height: `${Math.max((spotVix / 50) * 40, 4)}px`,
                backgroundColor: stressColor((spotVix / 50) * 100),
              }}
            />
            <div className="text-[9px] text-[#999999] font-semibold">Spot</div>
          </div>
          {/* 3M bar */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-[11px] font-mono text-[#999999]">{vix3m.toFixed(1)}</div>
            <div
              className="w-6 rounded-t transition-all duration-500"
              style={{
                height: `${Math.max((vix3m / 50) * 40, 4)}px`,
                backgroundColor: stressColor((vix3m / 50) * 100),
              }}
            />
            <div className="text-[9px] text-[#777777]">3M</div>
          </div>
        </div>
        <div className="text-center mt-1.5">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              color: d.termStructure === 'Contango' ? '#22C55E' : '#EF4444',
              backgroundColor: d.termStructure === 'Contango' ? '#22C55E15' : '#EF444415',
            }}
          >
            {d.termStructure}
          </span>
        </div>
      </div>
    </div>
  );
}

function StressGauge({ value }: { value: number }) {
  const color = stressColor(value);
  const w = 40;
  const h = 6;
  return (
    <div className="flex items-center gap-1">
      <div className="relative overflow-hidden rounded-full" style={{ width: w, height: h }}>
        <div className="absolute inset-0 bg-white/[0.06]" />
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-mono font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

function DimensionRow({
  label, value, status, momentum, min, max, thresholds, thresholdLabels,
}: {
  label: string; value: number; status: string; momentum: number; min: number; max: number;
  thresholds: number[]; thresholdLabels: string[];
}) {
  const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const c = stressColor(ratio * 100);
  const statusColor = status === 'Low' ? '#22C55E' : status === 'Normal' ? '#F59E0B' : status === 'Elevated' ? '#F97316' : '#EF4444';
  const momColor = momentum > 0 ? '#EF4444' : '#22C55E';

  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[11px] text-[#999999]">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-1 py-0.5 rounded" style={{ color: statusColor, backgroundColor: `${statusColor}15` }}>
            {status}
          </span>
          <span className="text-[11px] font-mono font-bold text-white">{value.toFixed(1)}</span>
        </div>
      </div>
      {/* Progress bar with threshold markers */}
      <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden mb-0.5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${ratio * 100}%`, backgroundColor: c }}
        />
        {/* Threshold lines */}
        {thresholds.map((t, i) => {
          const pos = ((t - min) / (max - min)) * 100;
          return (
            <div
              key={i}
              className="absolute top-0 h-full w-px bg-white/[0.08]"
              style={{ left: `${pos}%` }}
            />
          );
        })}
      </div>
      {/* Threshold labels + momentum */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {thresholdLabels.map((tl, i) => (
            <span key={i} className="text-[7px] text-[#777777]">{tl}</span>
          ))}
        </div>
        <span className="text-[9px]" style={{ color: momColor }}>
          Mom: {momentum > 0 ? '+' : ''}{momentum.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
