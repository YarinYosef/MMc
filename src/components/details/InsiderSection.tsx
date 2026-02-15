'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { generateInsiderTrades } from '@/data/generators/orderBookGenerator';
import { generatePriceHistory } from '@/data/generators/marketDataEngine';
import { formatCurrency, cn } from '@/lib/utils';
import { formatVolume } from '@/data/generators/tickerGenerator';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea,
} from 'recharts';

type InsiderTimeframe = '3mo' | '6mo' | '1yr';

const TIMEFRAME_CONFIG: Record<InsiderTimeframe, { days: number; label: string }> = {
  '3mo': { days: 90, label: '3M' },
  '6mo': { days: 180, label: '6M' },
  '1yr': { days: 365, label: '1Y' },
};

export function InsiderSection({ symbol, expanded }: { symbol: string; expanded?: boolean }) {
  const ticker = useMarketStore((s) => s.tickers.get(symbol));
  const setExpandedChart = useDetailsStore((s) => s.setExpandedChart);
  const [timeframe, setTimeframe] = useState<InsiderTimeframe>('6mo');
  const [highlightedIdx, setHighlightedIdx] = useState<number | null>(null);

  // Zoom state (only used in expanded mode)
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [zoomDomain, setZoomDomain] = useState<{ left: number; right: number } | null>(null);
  const isDragging = useRef(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Table ref for auto-scroll
  const tableRef = useRef<HTMLDivElement>(null);

  // Stable timestamp - does not change on re-renders
  const [stableNow] = useState(() => Date.now());

  const tickerPrice = ticker?.price;

  const trades = useMemo(() => {
    if (tickerPrice == null) return [];
    return generateInsiderTrades(symbol, tickerPrice, 12);
  }, [symbol, tickerPrice]);

  const priceData = useMemo(() => {
    if (!ticker) return [];
    const config = TIMEFRAME_CONFIG[timeframe];
    const points = Math.floor(config.days / 1.4); // trading days
    return generatePriceHistory(ticker, points, 86400000);
  }, [ticker, timeframe]);

  const chartData = useMemo(() => {
    const cutoff = stableNow - TIMEFRAME_CONFIG[timeframe].days * 86400000;

    // Build price line data with volume
    const data = priceData.map((p) => ({
      date: new Date(p.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: p.timestamp,
      price: p.close,
      volume: p.volume,
      buySignal: undefined as number | undefined,
      sellSignal: undefined as number | undefined,
    }));

    // Overlay insider trades
    trades.forEach((trade) => {
      const tradeTime = new Date(trade.date).getTime();
      if (tradeTime < cutoff) return;

      // Find closest data point
      let closest = 0;
      let minDiff = Infinity;
      data.forEach((d, i) => {
        const diff = Math.abs(d.timestamp - tradeTime);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      });

      if (data[closest]) {
        if (trade.type === 'buy') {
          data[closest].buySignal = data[closest].price;
        } else {
          data[closest].sellSignal = data[closest].price;
        }
      }
    });

    return data;
  }, [priceData, trades, timeframe, stableNow]);

  // Trade summary
  const filteredTrades = useMemo(() => {
    const cutoff = stableNow - TIMEFRAME_CONFIG[timeframe].days * 86400000;
    return trades.filter((t) => new Date(t.date).getTime() >= cutoff);
  }, [trades, timeframe, stableNow]);

  const totalBuys = filteredTrades.filter((t) => t.type === 'buy').reduce((s, t) => s + t.value, 0);
  const totalSells = filteredTrades.filter((t) => t.type === 'sell').reduce((s, t) => s + t.value, 0);
  const buyCount = filteredTrades.filter((t) => t.type === 'buy').length;
  const sellCount = filteredTrades.filter((t) => t.type === 'sell').length;

  // Wrapper that resets zoom when timeframe changes
  const handleTimeframeChange = useCallback((tf: InsiderTimeframe) => {
    setTimeframe(tf);
    setZoomDomain(null);
  }, []);

  // Auto-scroll table to highlighted row
  useEffect(() => {
    if (highlightedIdx == null || !tableRef.current) return;
    const row = tableRef.current.querySelector(`[data-row-idx="${highlightedIdx}"]`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [highlightedIdx]);

  // Zoom handlers (expanded mode only)
  const handleMouseDown = useCallback((e: { activeLabel?: string | number }) => {
    if (!expanded || e?.activeLabel == null) return;
    isDragging.current = true;
    setRefAreaLeft(String(e.activeLabel));
    setRefAreaRight(null);
  }, [expanded]);

  const handleMouseMove = useCallback((e: { activeLabel?: string | number }) => {
    if (!expanded || !isDragging.current || e?.activeLabel == null) return;
    setRefAreaRight(String(e.activeLabel));
  }, [expanded]);

  const handleMouseUp = useCallback(() => {
    if (!expanded || !isDragging.current) return;
    isDragging.current = false;

    if (refAreaLeft && refAreaRight && refAreaLeft !== refAreaRight) {
      const leftIdx = chartData.findIndex((d) => d.date === refAreaLeft);
      const rightIdx = chartData.findIndex((d) => d.date === refAreaRight);
      if (leftIdx !== -1 && rightIdx !== -1) {
        const left = Math.min(leftIdx, rightIdx);
        const right = Math.max(leftIdx, rightIdx);
        setZoomDomain({ left, right });
      }
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
  }, [expanded, refAreaLeft, refAreaRight, chartData]);

  // Smooth mouse wheel zoom — small incremental steps
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!expanded) return;
    e.preventDefault();
    const dataLen = chartData.length;
    if (dataLen === 0) return;

    const currentLeft = zoomDomain?.left ?? 0;
    const currentRight = zoomDomain?.right ?? dataLen - 1;
    const range = currentRight - currentLeft;
    const center = (currentLeft + currentRight) / 2;

    // Smooth zoom: small 5% increments per scroll tick
    const delta = Math.sign(e.deltaY) * Math.max(1, Math.round(range * 0.05));
    const newRange = Math.max(10, Math.min(dataLen - 1, range + delta));
    const newLeft = Math.max(0, Math.round(center - newRange / 2));
    const newRight = Math.min(dataLen - 1, newLeft + newRange);

    if (newLeft === 0 && newRight === dataLen - 1) {
      setZoomDomain(null);
    } else {
      setZoomDomain({ left: newLeft, right: newRight });
    }
  }, [expanded, chartData.length, zoomDomain]);

  const resetZoom = useCallback(() => {
    setZoomDomain(null);
  }, []);

  // Visible chart data (sliced by zoom)
  const visibleChartData = useMemo(() => {
    if (!zoomDomain) return chartData;
    return chartData.slice(zoomDomain.left, zoomDomain.right + 1);
  }, [chartData, zoomDomain]);

  // Custom dot render functions (SUB-TASK C)
  const renderBuyDot = useCallback((props: { cx?: number; cy?: number; payload?: Record<string, unknown> }) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null || !payload || payload.buySignal == null) return <circle r={0} />;
    const radius = expanded ? 5 : 3;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#22C55E"
        stroke="#22C55E"
        strokeWidth={2}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          const idx = filteredTrades.findIndex((t) => {
            const tradeDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return tradeDate === payload.date && t.type === 'buy';
          });
          if (idx !== -1) setHighlightedIdx(idx);
        }}
      />
    );
  }, [expanded, filteredTrades]);

  const renderSellDot = useCallback((props: { cx?: number; cy?: number; payload?: Record<string, unknown> }) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null || !payload || payload.sellSignal == null) return <circle r={0} />;
    const radius = expanded ? 5 : 3;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#EF4444"
        stroke="#EF4444"
        strokeWidth={2}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          const idx = filteredTrades.findIndex((t) => {
            const tradeDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return tradeDate === payload.date && t.type === 'sell';
          });
          if (idx !== -1) setHighlightedIdx(idx);
        }}
      />
    );
  }, [expanded, filteredTrades]);

  if (!ticker) return null;

  if (!expanded) {
    // === COMPACT VIEW (details panel) ===
    return (
      <div className="space-y-2">
        {/* Timeframe */}
        <div className="flex items-center gap-1">
          {(Object.keys(TIMEFRAME_CONFIG) as InsiderTimeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={cn(
                'px-2 py-0.5 text-[9px] rounded transition-colors',
                timeframe === tf
                  ? 'bg-[#AB9FF2] text-white'
                  : 'text-[#777777] hover:text-[#999999] hover:bg-white/[0.06]'
              )}
            >
              {TIMEFRAME_CONFIG[tf].label}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/[0.03] rounded p-1.5">
            <div className="text-[10px] text-[#999999]">Buys ({buyCount})</div>
            <div className="text-[11px] font-mono text-green-400">{formatCurrency(totalBuys)}</div>
          </div>
          <div className="bg-white/[0.03] rounded p-1.5">
            <div className="text-[10px] text-[#999999]">Sells ({sellCount})</div>
            <div className="text-[11px] font-mono text-red-400">{formatCurrency(totalSells)}</div>
          </div>
        </div>

        {/* Compact chart */}
        <div
          className="h-44 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
          onClick={() => setExpandedChart({ section: 'insider', chartId: 'insider' })}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#999999' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="price" orientation="right" tick={{ fontSize: 10, fill: '#999999' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <YAxis yAxisId="volume" orientation="left" tick={{ fontSize: 10, fill: '#999999' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 9 }}
                formatter={((value: number, name: string) => {
                  if (name === 'volume') return [formatVolume(value), 'Volume'];
                  if (name === 'price') return [`$${value.toFixed(2)}`, 'Price'];
                  if (name === 'buySignal') return [`$${value.toFixed(2)}`, 'Buy'];
                  if (name === 'sellSignal') return [`$${value.toFixed(2)}`, 'Sell'];
                  return [value, name];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }) as any}
              />
              <Bar yAxisId="volume" dataKey="volume" fill="rgba(100,116,139,0.2)" barSize={8} />
              <Line yAxisId="price" dataKey="price" stroke="#AB9FF2" strokeWidth={1.5} dot={false} />
              <Line yAxisId="price" dataKey="buySignal" stroke="none" dot={renderBuyDot} connectNulls={false} isAnimationActive={false} />
              <Line yAxisId="price" dataKey="sellSignal" stroke="none" dot={renderSellDot} connectNulls={false} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Compact table */}
        <div ref={tableRef} className="max-h-48 min-h-0 overflow-y-auto border-t border-white/[0.08]">
          <table className="w-full text-[10px]">
            <thead className="sticky top-0 bg-[#131313]/90">
              <tr className="text-[#999999] border-b border-black">
                <th className="text-left py-1 px-1.5 font-medium">Date</th>
                <th className="text-left py-1 px-1.5 font-medium">Insider</th>
                <th className="text-left py-1 px-1.5 font-medium">Title</th>
                <th className="text-center py-1 px-1.5 font-medium">Type</th>
                <th className="text-right py-1 px-1.5 font-medium">Shares</th>
                <th className="text-right py-1 px-1.5 font-medium">Price</th>
                <th className="text-right py-1 px-1.5 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade, i) => (
                <tr
                  key={i}
                  data-row-idx={i}
                  className={`border-b border-white/[0.05] cursor-pointer ${
                    highlightedIdx === i ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                  }`}
                  onClick={() => setHighlightedIdx(highlightedIdx === i ? null : i)}
                >
                  <td className="py-1 px-1.5 text-[#999999]">{trade.date}</td>
                  <td className="py-1 px-1.5 text-white">{trade.insider}</td>
                  <td className="py-1 px-1.5 text-[#999999]">{trade.title}</td>
                  <td className="py-1 px-1.5 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-1 px-1.5 text-right text-[#999999]">{trade.shares.toLocaleString()}</td>
                  <td className="py-1 px-1.5 text-right text-[#999999]">${trade.price.toFixed(2)}</td>
                  <td className="py-1 px-1.5 text-right text-white font-medium">{formatCurrency(trade.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // === EXPANDED VIEW (modal) — wide horizontal layout ===
  return (
    <div className="h-full flex flex-col">
      {/* Top bar: timeframe + summary + zoom controls */}
      <div className="flex items-center gap-3 px-2 py-2 shrink-0">
        <div className="flex items-center gap-1">
          {(Object.keys(TIMEFRAME_CONFIG) as InsiderTimeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={cn(
                'px-3 py-1 text-xs rounded transition-colors',
                timeframe === tf
                  ? 'bg-[#AB9FF2] text-white'
                  : 'text-[#777777] hover:text-[#999999] hover:bg-white/[0.06]'
              )}
            >
              {TIMEFRAME_CONFIG[tf].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-green-400 font-mono">Buys ({buyCount}): {formatCurrency(totalBuys)}</span>
          <span className="text-red-400 font-mono">Sells ({sellCount}): {formatCurrency(totalSells)}</span>
        </div>
        {zoomDomain && (
          <button
            onClick={resetZoom}
            className="ml-auto px-3 py-1 text-xs rounded bg-white/[0.06] text-[#999999] hover:bg-white/10 transition-colors"
          >
            Reset Zoom
          </button>
        )}
      </div>

      {/* Main content: chart (wide) + table (side panel) */}
      <div className="flex-1 flex min-h-0 gap-2 px-2 pb-2">
        {/* Chart — takes ~70% width, full remaining height */}
        <div
          ref={chartContainerRef}
          className="flex-[7] min-w-0 overflow-hidden"
          onWheel={handleWheel}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={visibleChartData}
              margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="price" orientation="right" tick={{ fontSize: 11, fill: '#999999' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <YAxis yAxisId="volume" orientation="left" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
                formatter={((value: number, name: string) => {
                  if (name === 'volume') return [formatVolume(value), 'Volume'];
                  if (name === 'price') return [`$${value.toFixed(2)}`, 'Price'];
                  if (name === 'buySignal') return [`$${value.toFixed(2)}`, 'Buy'];
                  if (name === 'sellSignal') return [`$${value.toFixed(2)}`, 'Sell'];
                  return [value, name];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }) as any}
              />
              <Bar yAxisId="volume" dataKey="volume" fill="rgba(100,116,139,0.2)" barSize={12} />
              <Line yAxisId="price" dataKey="price" stroke="#AB9FF2" strokeWidth={2} dot={false} />
              <Line yAxisId="price" dataKey="buySignal" stroke="none" dot={renderBuyDot} connectNulls={false} isAnimationActive={false} />
              <Line yAxisId="price" dataKey="sellSignal" stroke="none" dot={renderSellDot} connectNulls={false} isAnimationActive={false} />
              {refAreaLeft && refAreaRight && (
                <ReferenceArea yAxisId="price" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="#AB9FF2" fillOpacity={0.25} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Table — takes ~30% width, scrollable */}
        <div ref={tableRef} className="flex-[3] min-w-0 overflow-y-auto border-l border-white/[0.08] pl-2">
          <table className="w-full text-[10px]">
            <thead className="sticky top-0 bg-[#131313]">
              <tr className="text-[#999999] border-b border-black">
                <th className="text-left py-1.5 px-2 font-medium">Date</th>
                <th className="text-left py-1.5 px-2 font-medium">Insider</th>
                <th className="text-left py-1.5 px-2 font-medium">Title</th>
                <th className="text-center py-1.5 px-2 font-medium">Type</th>
                <th className="text-right py-1.5 px-2 font-medium">Shares</th>
                <th className="text-right py-1.5 px-2 font-medium">Price</th>
                <th className="text-right py-1.5 px-2 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade, i) => (
                <tr
                  key={i}
                  data-row-idx={i}
                  className={`border-b border-white/[0.05] cursor-pointer ${
                    highlightedIdx === i ? 'bg-[#AB9FF2]/20 ring-1 ring-[#AB9FF2]/40' : 'hover:bg-white/[0.03]'
                  }`}
                  onClick={() => setHighlightedIdx(highlightedIdx === i ? null : i)}
                >
                  <td className="py-1.5 px-2 text-[#999999]">{trade.date}</td>
                  <td className="py-1.5 px-2 text-white">{trade.insider}</td>
                  <td className="py-1.5 px-2 text-[#999999]">{trade.title}</td>
                  <td className="py-1.5 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-right text-[#999999]">{trade.shares.toLocaleString()}</td>
                  <td className="py-1.5 px-2 text-right text-[#999999]">${trade.price.toFixed(2)}</td>
                  <td className="py-1.5 px-2 text-right text-white font-medium">{formatCurrency(trade.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
