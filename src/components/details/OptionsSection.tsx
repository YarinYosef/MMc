'use client';

import { useMemo, useState } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { generateOptionsAggregate } from '@/data/generators/financialGenerator';
import { formatCurrency, cn } from '@/lib/utils';
import { CHART_COLORS } from '@/data/constants/colors';

type OptionsTimeframe = 'day' | 'week' | 'month';

export function OptionsSection({ symbol }: { symbol: string }) {
  const setExpandedChart = useDetailsStore((s) => s.setExpandedChart);
  const [timeframe, setTimeframe] = useState<OptionsTimeframe>('day');

  const data = useMemo(
    () => generateOptionsAggregate(symbol),
    [symbol]
  );

  const totalVolume = data.callVolume + data.putVolume;
  const callPercent = (data.callVolume / totalVolume) * 100;
  const putPercent = (data.putVolume / totalVolume) * 100;

  const totalOI = data.callOI + data.putOI;
  const callOIPercent = (data.callOI / totalOI) * 100;
  const putOIPercent = (data.putOI / totalOI) * 100;

  return (
    <div className="space-y-3">
      {/* Timeframe */}
      <div className="flex items-center gap-1">
        {(['day', 'week', 'month'] as OptionsTimeframe[]).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={cn(
              'px-2 py-0.5 text-[9px] rounded capitalize transition-colors',
              timeframe === tf
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            )}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Put/Call Ratio */}
      <div
        className="cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setExpandedChart({ section: 'options', chartId: 'putcall' })}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-400">Put/Call Ratio</span>
          <span className={cn(
            'text-[12px] font-mono font-bold',
            data.putCallRatio > 1 ? 'text-red-400' : 'text-green-400'
          )}>
            {data.putCallRatio.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-slate-500">Avg P/C Ratio</span>
          <span className="text-[10px] font-mono text-slate-400">
            {data.avgPutCallRatio.toFixed(2)}
          </span>
        </div>

        {/* Volume Split Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-[9px] mb-0.5">
            <span className="text-green-400">Calls {callPercent.toFixed(1)}%</span>
            <span className="text-slate-500">Volume Split</span>
            <span className="text-red-400">{putPercent.toFixed(1)}% Puts</span>
          </div>
          <div className="h-3 flex rounded overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${callPercent}%`, backgroundColor: CHART_COLORS.positive }}
            />
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${putPercent}%`, backgroundColor: CHART_COLORS.negative }}
            />
          </div>
        </div>

        {/* OI Split Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-[9px] mb-0.5">
            <span className="text-green-400">Calls {callOIPercent.toFixed(1)}%</span>
            <span className="text-slate-500">Open Interest</span>
            <span className="text-red-400">{putOIPercent.toFixed(1)}% Puts</span>
          </div>
          <div className="h-3 flex rounded overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${callOIPercent}%`, backgroundColor: '#22C55E80' }}
            />
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${putOIPercent}%`, backgroundColor: '#EF444480' }}
            />
          </div>
        </div>
      </div>

      {/* Volume Numbers */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-[9px] text-slate-500">Call Volume</div>
          <div className="text-[11px] font-mono text-green-400">
            {formatCurrency(data.callVolume).replace('$', '')}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">
            Amount: {formatCurrency(data.callAmount)}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-[9px] text-slate-500">Put Volume</div>
          <div className="text-[11px] font-mono text-red-400">
            {formatCurrency(data.putVolume).replace('$', '')}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">
            Amount: {formatCurrency(data.putAmount)}
          </div>
        </div>
      </div>

      {/* OI Numbers */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-[9px] text-slate-500">Call OI</div>
          <div className="text-[11px] font-mono text-green-400">
            {formatCurrency(data.callOI).replace('$', '')}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-[9px] text-slate-500">Put OI</div>
          <div className="text-[11px] font-mono text-red-400">
            {formatCurrency(data.putOI).replace('$', '')}
          </div>
        </div>
      </div>
    </div>
  );
}
