'use client';

import { useMemo, useState } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { generateOptionsAggregate } from '@/data/generators/financialGenerator';
import { formatCurrency, cn } from '@/lib/utils';
import { CHART_COLORS } from '@/data/constants/colors';

type OptionsTimeframe = 'day' | 'week' | 'month';

export function OptionsSection({ symbol, expanded }: { symbol: string; expanded?: boolean }) {
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
                ? 'bg-[#AB9FF2] text-white'
                : 'text-[#777777] hover:text-[#999999] hover:bg-white/[0.06]'
            )}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Put/Call Ratio */}
      <div
        className={!expanded ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
        onClick={expanded ? undefined : () => setExpandedChart({ section: 'options', chartId: 'putcall' })}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[#999999]">Put/Call Ratio</span>
          <span className={cn(
            'text-[12px] font-mono font-bold',
            data.putCallRatio > 1 ? 'text-[#FF7243]' : 'text-[#2EC08B]'
          )}>
            {data.putCallRatio.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[#999999]">Avg P/C Ratio</span>
          <span className="text-[10px] font-mono text-[#999999]">
            {data.avgPutCallRatio.toFixed(2)}
          </span>
        </div>

        {/* Volume Split Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-[10px] mb-0.5">
            <span className="text-[#2EC08B]">Calls {callPercent.toFixed(1)}%</span>
            <span className="text-[#999999]">Volume Split</span>
            <span className="text-[#FF7243]">{putPercent.toFixed(1)}% Puts</span>
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
          <div className="flex items-center justify-between text-[10px] mb-0.5">
            <span className="text-[#2EC08B]">Calls {callOIPercent.toFixed(1)}%</span>
            <span className="text-[#999999]">Open Interest</span>
            <span className="text-[#FF7243]">{putOIPercent.toFixed(1)}% Puts</span>
          </div>
          <div className="h-3 flex rounded overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${callOIPercent}%`, backgroundColor: '#2EC08B80' }}
            />
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${putOIPercent}%`, backgroundColor: '#FF724380' }}
            />
          </div>
        </div>
      </div>

      {/* Volume Numbers */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/[0.03] rounded p-2">
          <div className="text-[10px] text-[#999999]">Call Volume</div>
          <div className="text-[11px] font-mono text-[#2EC08B]">
            {formatCurrency(data.callVolume).replace('$', '')}
          </div>
          <div className="text-[10px] text-[#999999] mt-0.5">
            Amount: {formatCurrency(data.callAmount)}
          </div>
        </div>
        <div className="bg-white/[0.03] rounded p-2">
          <div className="text-[10px] text-[#999999]">Put Volume</div>
          <div className="text-[11px] font-mono text-[#FF7243]">
            {formatCurrency(data.putVolume).replace('$', '')}
          </div>
          <div className="text-[10px] text-[#999999] mt-0.5">
            Amount: {formatCurrency(data.putAmount)}
          </div>
        </div>
      </div>

      {/* OI Numbers */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/[0.03] rounded p-2">
          <div className="text-[10px] text-[#999999]">Call OI</div>
          <div className="text-[11px] font-mono text-[#2EC08B]">
            {formatCurrency(data.callOI).replace('$', '')}
          </div>
        </div>
        <div className="bg-white/[0.03] rounded p-2">
          <div className="text-[10px] text-[#999999]">Put OI</div>
          <div className="text-[11px] font-mono text-[#FF7243]">
            {formatCurrency(data.putOI).replace('$', '')}
          </div>
        </div>
      </div>
    </div>
  );
}
