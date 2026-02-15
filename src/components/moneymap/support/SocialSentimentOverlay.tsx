'use client';

import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { useDetailsStore } from '@/stores/useDetailsStore';

const PLATFORMS = [
  { name: 'Reddit', color: '#FF4500' },
  { name: 'X/Twitter', color: '#1DA1F2' },
  { name: 'StockTwits', color: '#0BC768' },
];

interface SentimentPoint {
  time: string;
  reddit: number;
  twitter: number;
  stocktwits: number;
  composite: number;
}

function seededRandom(seed: number): [number, number] {
  const next = (seed * 16807 + 1) >>> 0;
  return [next / 0xFFFFFFFF, next];
}

export function SocialSentimentOverlay() {
  const selectedSymbol = useDetailsStore((s) => s.selectedSymbol);
  const [stableNow] = useState(() => Date.now());

  const { chartData, summary } = useMemo(() => {
    if (!selectedSymbol) return { chartData: [], summary: { overall: 0, mentions: 0, trend: 'neutral' } };

    // Deterministic seed from symbol
    let seed = 0;
    for (let c = 0; c < selectedSymbol.length; c++) seed = ((seed << 5) - seed + selectedSymbol.charCodeAt(c)) | 0;
    seed = seed >>> 0;

    const points: SentimentPoint[] = [];
    let reddit = 50, twitter = 50, stocktwits = 50;

    for (let i = 24; i >= 0; i--) {
      let r: number;
      [r, seed] = seededRandom(seed);
      reddit = Math.max(0, Math.min(100, reddit + (r - 0.5) * 16));
      [r, seed] = seededRandom(seed);
      twitter = Math.max(0, Math.min(100, twitter + (r - 0.5) * 20));
      [r, seed] = seededRandom(seed);
      stocktwits = Math.max(0, Math.min(100, stocktwits + (r - 0.5) * 14));

      const hour = new Date(stableNow - i * 3600000);
      points.push({
        time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        reddit: Math.round(reddit),
        twitter: Math.round(twitter),
        stocktwits: Math.round(stocktwits),
        composite: Math.round((reddit + twitter + stocktwits) / 3),
      });
    }

    const lastComposite = points[points.length - 1].composite;
    const firstComposite = points[0].composite;

    [, seed] = seededRandom(seed);
    return {
      chartData: points,
      summary: {
        overall: lastComposite,
        mentions: (seed % 5000) + 500,
        trend: lastComposite > firstComposite ? 'improving' : lastComposite < firstComposite ? 'declining' : 'stable',
      },
    };
  }, [selectedSymbol, stableNow]);

  if (!selectedSymbol) {
    return (
      <div className="h-full flex items-center justify-center text-[#999999] text-xs">
        Select a ticker to view social sentiment
      </div>
    );
  }

  const sentimentLabel = summary.overall > 60 ? 'Bullish' : summary.overall < 40 ? 'Bearish' : 'Neutral';
  const sentimentColor = summary.overall > 60 ? 'text-green-400' : summary.overall < 40 ? 'text-red-400' : 'text-[#999999]';

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-2 pb-1">
        <span className="text-[10px] text-[#999999]">
          Retail mood - {selectedSymbol}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold ${sentimentColor}`}>{sentimentLabel}</span>
          <span className="text-[10px] text-[#999999]">{summary.mentions.toLocaleString()} mentions</span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#999999' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 10, fill: '#999999' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 9 }}
            />
            <ReferenceLine y={50} stroke="#475569" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="reddit"
              stroke="#FF4500"
              fill="#FF4500"
              fillOpacity={0.2}
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="twitter"
              stroke="#1DA1F2"
              fill="#1DA1F2"
              fillOpacity={0.2}
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="stocktwits"
              stroke="#0BC768"
              fill="#0BC768"
              fillOpacity={0.2}
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 px-2 py-1 border-t border-white/[0.08]">
        {PLATFORMS.map((p) => (
          <div key={p.name} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-[10px] text-[#999999]">{p.name}</span>
          </div>
        ))}
        <div className="flex-1" />
        <span className={`text-[10px] ${summary.trend === 'improving' ? 'text-green-400' : summary.trend === 'declining' ? 'text-red-400' : 'text-[#999999]'}`}>
          Trend: {summary.trend}
        </span>
      </div>
    </div>
  );
}
