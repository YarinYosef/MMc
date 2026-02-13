'use client';

import { useMemo } from 'react';
import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function rvolColor(rv: number): string {
  if (rv > 2.0) return '#22C55E';
  if (rv > 1.5) return '#86EFAC';
  if (rv > 0.8) return '#F59E0B';
  return '#EF4444';
}

export function VolumeCompass({ state, expanded }: Props) {
  const d = state.details;
  const rVol = Number(d.relativeVolume);
  const exp = Number(d.expansion);
  const ft = d.followThrough as string;
  const distDays = Number(d.distributionDays);
  const accumDays = Number(d.accumulationDays);

  const rVolCol = rvolColor(rVol);
  const ftColor = ft === 'High' ? '#22C55E' : ft === 'Moderate' ? '#F59E0B' : '#EF4444';
  const expColor = exp > 0 ? '#22C55E' : '#EF4444';

  const priceData = useMemo(() => {
    const raw = String(d.priceHistory || '');
    return raw ? raw.split(',').map(Number).filter(n => !isNaN(n)) : [];
  }, [d.priceHistory]);

  const volumeData = useMemo(() => {
    const raw = String(d.volumeHistory || '');
    return raw ? raw.split(',').map(Number).filter(n => !isNaN(n)) : [];
  }, [d.volumeHistory]);

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[10px] font-semibold text-slate-400">Vol</span>
        {/* Mini RVOL bar */}
        <div className="w-6 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(rVol / 3 * 100, 100)}%`, backgroundColor: rVolCol }}
          />
        </div>
        <span className="text-[10px] font-mono font-bold" style={{ color: rVolCol }}>
          {rVol.toFixed(1)}x
        </span>
        <span className="text-[9px] font-mono" style={{ color: expColor }}>
          {exp > 0 ? '+' : ''}{exp.toFixed(0)}%
        </span>
        <span className="text-[9px] font-bold" style={{ color: ftColor }}>{ft}</span>
      </div>
    );
  }

  return (
    <div className="p-3 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-300">Volume Compass</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: ftColor, backgroundColor: `${ftColor}15` }}>
          {ft} Follow-Through
        </span>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center bg-slate-800/50 rounded py-2">
          <div className="text-[8px] text-slate-500 uppercase tracking-wider">RVOL</div>
          <div className="text-lg font-mono font-bold" style={{ color: rVolCol }}>{rVol.toFixed(2)}x</div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mx-2 mt-1">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(rVol / 3 * 100, 100)}%`, backgroundColor: rVolCol }}
            />
          </div>
        </div>
        <div className="text-center bg-slate-800/50 rounded py-2">
          <div className="text-[8px] text-slate-500 uppercase tracking-wider">Expansion</div>
          <div className="text-lg font-mono font-bold" style={{ color: expColor }}>
            {exp > 0 ? '+' : ''}{exp.toFixed(1)}%
          </div>
          {/* Up/down arrow */}
          <svg width="20" height="10" viewBox="0 0 20 10" className="mx-auto mt-1">
            <path
              d={exp > 0 ? 'M10 8 L10 2 M7 4 L10 2 L13 4' : 'M10 2 L10 8 M7 6 L10 8 L13 6'}
              stroke={expColor}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="text-center bg-slate-800/50 rounded py-2">
          <div className="text-[8px] text-slate-500 uppercase tracking-wider">Follow-Thru</div>
          <div className="text-lg font-bold" style={{ color: ftColor }}>{ft}</div>
          <div className="flex justify-center gap-0.5 mt-1">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ft === 'High' ? (i <= 3 ? '#22C55E' : '#334155') :
                    ft === 'Moderate' ? (i <= 2 ? '#F59E0B' : '#334155') :
                    (i <= 1 ? '#EF4444' : '#334155'),
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Combined price + volume chart */}
      {priceData.length > 2 && volumeData.length > 2 && (
        <div className="bg-slate-800/30 rounded p-2 mb-3">
          <div className="text-[8px] text-slate-500 mb-1">Price & Volume</div>
          <CombinedChart priceData={priceData} volumeData={volumeData} />
        </div>
      )}

      {/* Distribution/Accumulation stats */}
      <div className="border-t border-slate-700/50 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/60" />
              <span className="text-[9px] text-slate-500">Distribution</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-red-400">{distDays}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
              <span className="text-[9px] text-slate-500">Accumulation</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-green-400">{accumDays}</span>
          </div>
        </div>
        {/* D/A ratio bar */}
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5 flex">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${distDays + accumDays > 0 ? (distDays / (distDays + accumDays)) * 100 : 50}%`,
              backgroundColor: '#EF444480',
            }}
          />
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${distDays + accumDays > 0 ? (accumDays / (distDays + accumDays)) * 100 : 50}%`,
              backgroundColor: '#22C55E80',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CombinedChart({ priceData, volumeData }: { priceData: number[]; volumeData: number[] }) {
  const w = 260;
  const priceH = 45;
  const volH = 22;
  const gap = 4;
  const totalH = priceH + volH + gap;

  const pMin = Math.min(...priceData);
  const pMax = Math.max(...priceData);
  const pRange = pMax - pMin || 1;
  const vMax = Math.max(...volumeData) || 1;
  const vAvg = volumeData.reduce((a, b) => a + b, 0) / volumeData.length;

  const pStep = w / (priceData.length - 1);
  const vStep = w / volumeData.length;

  const pPoints = priceData.map((v, i) => `${i * pStep},${priceH - ((v - pMin) / pRange) * priceH}`).join(' ');
  const areaPoints = `0,${priceH} ${pPoints} ${(priceData.length - 1) * pStep},${priceH}`;

  return (
    <svg width={w} height={totalH} className="w-full" viewBox={`0 0 ${w} ${totalH}`} preserveAspectRatio="none">
      {/* Grid lines */}
      <line x1="0" y1={priceH * 0.33} x2={w} y2={priceH * 0.33} stroke="#334155" strokeWidth="0.3" strokeDasharray="2,4" />
      <line x1="0" y1={priceH * 0.66} x2={w} y2={priceH * 0.66} stroke="#334155" strokeWidth="0.3" strokeDasharray="2,4" />
      {/* Price area */}
      <polygon points={areaPoints} fill="#3B82F615" />
      {/* Price line */}
      <polyline points={pPoints} fill="none" stroke="#3B82F6" strokeWidth="1.5" />
      {/* Latest price dot */}
      <circle
        cx={(priceData.length - 1) * pStep}
        cy={priceH - ((priceData[priceData.length - 1] - pMin) / pRange) * priceH}
        r="2"
        fill="#3B82F6"
        stroke="#0F172A"
        strokeWidth="1"
      />
      {/* Volume bars */}
      {volumeData.map((v, i) => {
        const h = (v / vMax) * volH;
        const y = priceH + gap + volH - h;
        const isAboveAvg = v > vAvg;
        return (
          <rect
            key={i}
            x={i * vStep + 1}
            y={y}
            width={Math.max(vStep - 2, 1)}
            height={h}
            fill={isAboveAvg ? '#22C55E50' : '#64748B30'}
            rx="0.5"
          />
        );
      })}
      {/* Average volume line */}
      <line
        x1="0"
        y1={priceH + gap + volH - (vAvg / vMax) * volH}
        x2={w}
        y2={priceH + gap + volH - (vAvg / vMax) * volH}
        stroke="#F59E0B40"
        strokeWidth="0.5"
        strokeDasharray="2,2"
      />
    </svg>
  );
}
