'use client';

import { useMemo } from 'react';
import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 16;
  const w = 50;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.2" />
      {/* Latest point dot */}
      <circle
        cx={(data.length - 1) * step}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r="1.5"
        fill={color}
      />
    </svg>
  );
}

export function MicrosoftProxy({ state, expanded }: Props) {
  const d = state.details;
  const price = Number(d.msftPrice);
  const ath = Number(d.ath);
  const athDist = Number(d.athDistance);
  const breakout = d.breakoutStatus as string;
  const gapDir = d.gapDirection as string;
  const indexComp = Number(d.indexComparison);
  const liqBehavior = d.liquidityBehavior as string;

  const priceData = useMemo(() => {
    const raw = String(d.priceHistory || '');
    return raw ? raw.split(',').map(Number).filter(n => !isNaN(n)) : [];
  }, [d.priceHistory]);

  const breakoutColor = breakout === 'Breakout' ? '#2EC08B' : breakout === 'Near ATH' ? '#86EFAC' : breakout === 'Pullback' ? '#F59E0B' : '#FF7243';
  const gapColor = gapDir === 'green' ? '#2EC08B' : '#FF7243';

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">MSFT</span>
        <MiniSparkline data={priceData} color={gapColor} />
        <span className="text-[11px] font-mono text-[#999999]">{athDist.toFixed(1)}%</span>
        <span className="text-[10px] font-bold px-1 rounded" style={{ color: breakoutColor, backgroundColor: `${breakoutColor}15` }}>
          {breakout}
        </span>
      </div>
    );
  }

  // Compute price range stats from history
  const priceMin = priceData.length > 0 ? Math.min(...priceData) : price - 10;
  const priceMax = priceData.length > 0 ? Math.max(...priceData) : price + 10;
  const priceChange = priceData.length > 1 ? price - priceData[0] : 0;
  const priceChangePct = priceData.length > 1 ? (priceChange / priceData[0]) * 100 : 0;

  return (
    <div className="p-3 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#999999]">Microsoft Proxy</span>
          <span className="text-[9px] text-[#777777]">MEGA-CAP HEALTH</span>
        </div>
        <span
          className="text-[11px] font-bold px-1.5 py-0.5 rounded"
          style={{ color: breakoutColor, backgroundColor: `${breakoutColor}15` }}
        >
          {breakout}
        </span>
      </div>

      {/* Price display with change */}
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-xl font-mono font-bold text-white">${price.toFixed(2)}</span>
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono" style={{ color: gapColor }}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
          </span>
          <span className="text-[11px] font-mono px-1 rounded" style={{ color: gapColor, backgroundColor: `${gapColor}15` }}>
            {priceChangePct >= 0 ? '+' : ''}{priceChangePct.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* ATH distance bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] mb-0.5">
          <span className="text-[#777777]">Distance from ATH (${ath})</span>
          <span style={{ color: gapColor }}>{athDist.toFixed(2)}%</span>
        </div>
        <div className="relative h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(100 - athDist * 3, 5)}%`,
              background: athDist < 5
                ? 'linear-gradient(to right, #2EC08B, #86EFAC)'
                : athDist < 15
                ? 'linear-gradient(to right, #F59E0B, #FBBF24)'
                : 'linear-gradient(to right, #FF7243, #FCA5A5)',
            }}
          />
          {/* ATH marker */}
          <div className="absolute right-0 top-0 h-full w-0.5 bg-[#777777]" />
        </div>
        <div className="flex justify-between text-[7px] text-[#777777] mt-0.5">
          <span>Current</span>
          <span>ATH</span>
        </div>
      </div>

      {/* Price chart */}
      {priceData.length > 2 && (
        <div className="mb-3 bg-white/[0.03] rounded p-2">
          <div className="text-[9px] text-[#777777] mb-1">30-Period Price Action</div>
          <PriceChart data={priceData} color={gapColor} />
          <div className="flex justify-between text-[7px] text-[#777777] mt-1">
            <span>L: ${priceMin.toFixed(2)}</span>
            <span>H: ${priceMax.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Bottom metrics */}
      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="bg-white/[0.03] rounded px-2 py-1">
          <div className="text-[9px] text-[#777777]">vs Index</div>
          <div className="font-mono font-bold" style={{ color: indexComp > 0 ? '#2EC08B' : '#FF7243' }}>
            {indexComp > 0 ? '+' : ''}{indexComp.toFixed(2)}%
          </div>
        </div>
        <div className="bg-white/[0.03] rounded px-2 py-1">
          <div className="text-[9px] text-[#777777]">Liquidity</div>
          <div className="font-bold" style={{
            color: liqBehavior === 'Strong' ? '#2EC08B' : liqBehavior === 'Moderate' ? '#F59E0B' : '#FF7243'
          }}>
            {liqBehavior}
          </div>
        </div>
        <div className="bg-white/[0.03] rounded px-2 py-1">
          <div className="text-[9px] text-[#777777]">Confidence</div>
          <div className="font-mono text-[#999999]">{state.confidence}%</div>
        </div>
      </div>
    </div>
  );
}

function PriceChart({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 60;
  const w = 260;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`);
  const linePoints = points.join(' ');
  const areaPoints = `0,${h} ${linePoints} ${(data.length - 1) * step},${h}`;

  // Moving average (5-period)
  const ma: { x: number; y: number }[] = [];
  for (let i = 4; i < data.length; i++) {
    const avg = (data[i] + data[i - 1] + data[i - 2] + data[i - 3] + data[i - 4]) / 5;
    ma.push({ x: i * step, y: h - ((avg - min) / range) * h });
  }
  const maLine = ma.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={w} height={h} className="w-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {/* Grid lines */}
      <line x1="0" y1={h * 0.25} x2={w} y2={h * 0.25} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,3" />
      <line x1="0" y1={h * 0.5} x2={w} y2={h * 0.5} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,3" />
      <line x1="0" y1={h * 0.75} x2={w} y2={h * 0.75} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,3" />
      {/* Area fill */}
      <polygon points={areaPoints} fill={`${color}10`} />
      {/* MA line */}
      {maLine && <polyline points={maLine} fill="none" stroke="#F59E0B60" strokeWidth="1" />}
      {/* Price line */}
      <polyline points={linePoints} fill="none" stroke={color} strokeWidth="1.5" />
      {/* Latest point */}
      <circle
        cx={(data.length - 1) * step}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r="2.5"
        fill={color}
        stroke="#131313"
        strokeWidth="1"
      />
    </svg>
  );
}
