'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { generatePriceHistory } from '@/data/generators/marketDataEngine';
import { formatCurrency, cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea,
} from 'recharts';
import { CHART_COLORS } from '@/data/constants/colors';

type PricePeriod = '6mo' | '1yr' | '5yr' | '10yr';

const PERIOD_CONFIG: Record<PricePeriod, { points: number; interval: number; label: string }> = {
  '6mo': { points: 130, interval: 86400000, label: '6M' },
  '1yr': { points: 252, interval: 86400000, label: '1Y' },
  '5yr': { points: 260, interval: 86400000 * 5, label: '5Y' },
  '10yr': { points: 520, interval: 86400000 * 5, label: '10Y' },
};

interface MetricProps {
  label: string;
  value: string;
  color?: string;
}

function Metric({ label, value, color }: MetricProps) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <span className="text-[10px] text-[#999999]">{label}</span>
      <span className={cn('text-[10px] font-mono', color || 'text-white')}>{value}</span>
    </div>
  );
}

export function FundamentalsSection({ symbol, expanded }: { symbol: string; expanded?: boolean }) {
  const ticker = useMarketStore((s) => s.tickers.get(symbol));
  const setExpandedChart = useDetailsStore((s) => s.setExpandedChart);
  const [period, setPeriod] = useState<PricePeriod>('1yr');

  // Zoom state (expanded mode only)
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [zoomDomain, setZoomDomain] = useState<{ left: number; right: number } | null>(null);
  const isDragging = useRef(false);

  const tickerSymbol = ticker?.symbol;
  const tickerPe = ticker?.pe;

  const priceData = useMemo(() => {
    if (!ticker) return [];
    const config = PERIOD_CONFIG[period];
    const history = generatePriceHistory(ticker, config.points, config.interval);
    return history.map((p) => ({
      date: new Date(p.timestamp).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      price: p.close,
    }));
  }, [ticker, period]);

  const forwardPE = useMemo(() => {
    if (!tickerSymbol || tickerPe == null) return 0;
    let hash = 0;
    for (let i = 0; i < tickerSymbol.length; i++) {
      hash = ((hash << 5) - hash + tickerSymbol.charCodeAt(i)) | 0;
    }
    const jitter = 0.85 + (((hash >>> 0) % 1500) / 10000);
    return tickerPe * jitter;
  }, [tickerPe, tickerSymbol]);

  // Reset zoom on period change
  const handlePeriodChange = useCallback((p: PricePeriod) => {
    setPeriod(p);
    setZoomDomain(null);
  }, []);

  // Visible data (sliced by zoom)
  const visibleData = useMemo(() => {
    if (!zoomDomain) return priceData;
    return priceData.slice(zoomDomain.left, zoomDomain.right + 1);
  }, [priceData, zoomDomain]);

  // Drag-to-zoom handlers
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
      const leftIdx = priceData.findIndex((d) => d.date === refAreaLeft);
      const rightIdx = priceData.findIndex((d) => d.date === refAreaRight);
      if (leftIdx !== -1 && rightIdx !== -1) {
        const left = Math.min(leftIdx, rightIdx);
        const right = Math.max(leftIdx, rightIdx);
        setZoomDomain({ left, right });
      }
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
  }, [expanded, refAreaLeft, refAreaRight, priceData]);

  // Smooth mouse wheel zoom — small 5% increments
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!expanded) return;
    e.preventDefault();
    const dataLen = priceData.length;
    if (dataLen === 0) return;

    const currentLeft = zoomDomain?.left ?? 0;
    const currentRight = zoomDomain?.right ?? dataLen - 1;
    const range = currentRight - currentLeft;
    const center = (currentLeft + currentRight) / 2;

    const delta = Math.sign(e.deltaY) * Math.max(1, Math.round(range * 0.05));
    const newRange = Math.max(10, Math.min(dataLen - 1, range + delta));
    const newLeft = Math.max(0, Math.round(center - newRange / 2));
    const newRight = Math.min(dataLen - 1, newLeft + newRange);

    if (newLeft === 0 && newRight === dataLen - 1) {
      setZoomDomain(null);
    } else {
      setZoomDomain({ left: newLeft, right: newRight });
    }
  }, [expanded, priceData.length, zoomDomain]);

  const resetZoom = useCallback(() => {
    setZoomDomain(null);
  }, []);

  if (!ticker) return null;

  if (!expanded) {
    // === COMPACT VIEW ===
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-0">
          <Metric label="Market Cap" value={formatCurrency(ticker.marketCap)} />
          <Metric label="Volume" value={formatCurrency(ticker.volume).replace('$', '')} />
          <Metric label="P/E" value={ticker.pe.toFixed(1)} />
          <Metric label="Avg Vol" value={formatCurrency(ticker.avgVolume).replace('$', '')} />
          <Metric label="Fwd P/E" value={forwardPE.toFixed(1)} />
          <Metric label="EPS" value={`$${ticker.eps.toFixed(2)}`} />
          <Metric label="52W High" value={`$${ticker.high52w.toFixed(2)}`} />
          <Metric label="52W Low" value={`$${ticker.low52w.toFixed(2)}`} />
          <Metric label="Beta" value={ticker.beta.toFixed(2)} />
          <Metric
            label="Daily Chg"
            value={`${ticker.change >= 0 ? '+' : ''}${ticker.change.toFixed(2)} (${ticker.changePercent >= 0 ? '+' : ''}${ticker.changePercent.toFixed(2)}%)`}
            color={ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}
          />
        </div>

        <div className="flex items-center gap-1">
          {(Object.keys(PERIOD_CONFIG) as PricePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-2 py-0.5 text-[9px] rounded transition-colors',
                period === p
                  ? 'bg-[#AB9FF2] text-white'
                  : 'text-[#777777] hover:text-[#999999] hover:bg-white/[0.06]'
              )}
            >
              {PERIOD_CONFIG[p].label}
            </button>
          ))}
        </div>

        <div
          className="h-40 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setExpandedChart({ section: 'fundamentals', chartId: 'price' })}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: CHART_COLORS.textMuted }} interval="preserveStartEnd" tickLine={false} axisLine={{ stroke: CHART_COLORS.border }} />
              <YAxis tick={{ fontSize: 10, fill: CHART_COLORS.textMuted }} tickFormatter={(v: number) => `$${v.toFixed(0)}`} width={45} tickLine={false} axisLine={{ stroke: CHART_COLORS.border }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: CHART_COLORS.surface, border: `1px solid ${CHART_COLORS.border}`, borderRadius: '4px', fontSize: '10px', color: CHART_COLORS.text }}
                formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'Price']}
              />
              <Line type="monotone" dataKey="price" stroke={CHART_COLORS.accent} strokeWidth={1.5} dot={false} animationDuration={300} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // === EXPANDED VIEW (modal) — wide layout with zoom/pan ===
  return (
    <div className="h-full flex flex-col">
      {/* Top bar: period selector + metrics + zoom controls */}
      <div className="flex items-center gap-3 px-2 py-2 shrink-0 flex-wrap">
        <div className="flex items-center gap-1">
          {(Object.keys(PERIOD_CONFIG) as PricePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={cn(
                'px-3 py-1 text-xs rounded transition-colors',
                period === p
                  ? 'bg-[#AB9FF2] text-white'
                  : 'text-[#777777] hover:text-[#999999] hover:bg-white/[0.06]'
              )}
            >
              {PERIOD_CONFIG[p].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-[#999999] font-mono">
          <span>P/E: {ticker.pe.toFixed(1)}</span>
          <span>EPS: ${ticker.eps.toFixed(2)}</span>
          <span>Beta: {ticker.beta.toFixed(2)}</span>
          <span className={ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}>
            {ticker.change >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
          </span>
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

      {/* Chart — fills remaining space */}
      <div className="flex-1 min-h-0 px-2 pb-2" onWheel={handleWheel}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={visibleData}
            margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: CHART_COLORS.textMuted }} interval="preserveStartEnd" tickLine={false} axisLine={{ stroke: CHART_COLORS.border }} />
            <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.textMuted }} tickFormatter={(v: number) => `$${v.toFixed(0)}`} width={55} tickLine={false} axisLine={{ stroke: CHART_COLORS.border }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ background: CHART_COLORS.surface, border: `1px solid ${CHART_COLORS.border}`, borderRadius: '6px', fontSize: '12px', color: CHART_COLORS.text }}
              formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'Price']}
            />
            <Line type="monotone" dataKey="price" stroke={CHART_COLORS.accent} strokeWidth={2} dot={false} animationDuration={300} />
            {refAreaLeft && refAreaRight && (
              <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="#AB9FF2" fillOpacity={0.15} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
