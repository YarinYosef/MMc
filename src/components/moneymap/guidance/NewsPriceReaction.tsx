'use client';

import { useMemo } from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { generatePriceHistory } from '@/data/generators/marketDataEngine';

interface NewsEvent {
  index: number;
  sentiment: number; // -100 to 100
  headline: string;
}

const MOCK_HEADLINES = [
  'Earnings beat expectations',
  'Analyst upgrade to Buy',
  'New product launch announced',
  'Revenue misses estimate',
  'CEO sells shares',
  'Partnership deal signed',
  'Regulatory concerns raised',
  'Share buyback authorized',
];

export function NewsPriceReaction() {
  const selectedSymbol = useDetailsStore((s) => s.selectedSymbol);
  const getTicker = useMarketStore((s) => s.getTicker);

  const ticker = selectedSymbol ? getTicker(selectedSymbol) : null;

  const { chartData } = useMemo(() => {
    if (!ticker) return { chartData: [], newsEvents: [] };

    const history = generatePriceHistory(ticker, 40, 86400000);

    // Generate deterministic news events based on ticker symbol
    const events: NewsEvent[] = [];
    let seed = 0;
    for (let c = 0; c < ticker.symbol.length; c++) seed = ((seed << 5) - seed + ticker.symbol.charCodeAt(c)) | 0;
    for (let i = 0; i < 5; i++) {
      seed = (seed * 16807 + 1) >>> 0;
      const idx = 5 + (seed % 30);
      seed = (seed * 16807 + 1) >>> 0;
      const sentiment = ((seed % 101) - 50);
      seed = (seed * 16807 + 1) >>> 0;
      events.push({
        index: idx,
        sentiment,
        headline: MOCK_HEADLINES[seed % MOCK_HEADLINES.length],
      });
    }

    const chart = history.map((p, i) => {
      const matchingEvent = events.find((e) => e.index === i);
      return {
        date: new Date(p.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: p.close,
        sentiment: matchingEvent ? matchingEvent.sentiment : undefined,
        headline: matchingEvent?.headline,
      };
    });

    return { chartData: chart, newsEvents: events };
  }, [ticker]);

  if (!selectedSymbol || !ticker) {
    return (
      <div className="h-full flex items-center justify-center text-[#999999] text-xs">
        Select a ticker to view news-price reaction
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] text-[#999999] px-2 pb-1">
        Price action vs narrative confirmation - {selectedSymbol}
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: 5 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#999999' }} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="price"
              orientation="right"
              tick={{ fontSize: 10, fill: '#999999' }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <YAxis
              yAxisId="sentiment"
              orientation="left"
              tick={{ fontSize: 10, fill: '#999999' }}
              axisLine={false}
              tickLine={false}
              domain={[-100, 100]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 9 }}
              formatter={((value: number, name: string) => {
                if (name === 'price') return [`$${value.toFixed(2)}`, 'Price'];
                if (name === 'sentiment') return [value, 'Sentiment'];
                return [value, name];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              }) as any}
              labelFormatter={(label, payload) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const item = payload?.find((p: any) => p.payload?.headline);
                if (item?.payload?.headline) return `${label} - ${item.payload.headline}`;
                return label;
              }}
            />
            <ReferenceLine yAxisId="sentiment" y={0} stroke="#475569" strokeDasharray="3 3" />
            <Line
              yAxisId="price"
              dataKey="price"
              stroke="#AB9FF2"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              yAxisId="sentiment"
              dataKey="sentiment"
              stroke="none"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              dot={(props: any) => {
                const { cx, cy, value } = props;
                if (value === undefined || value === null) return <circle key={props.key} r={0} />;
                return (
                  <circle
                    key={props.key}
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill={value >= 0 ? '#22C55E' : '#EF4444'}
                    stroke={value >= 0 ? '#86EFAC' : '#FCA5A5'}
                    strokeWidth={2}
                    opacity={0.9}
                  />
                );
              }}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 px-2 py-1 border-t border-white/[0.08]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-[#AB9FF2]" />
          <span className="text-[10px] text-[#999999]">Price</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-[#999999]">Positive News</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] text-[#999999]">Negative News</span>
        </div>
      </div>
    </div>
  );
}
