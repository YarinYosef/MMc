'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { useOnionStore } from '@/stores/useOnionStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { WidgetContainer } from '@/components/layout/WidgetContainer';
import { OnionTooltip } from './OnionTooltip';
import { type Timeframe, type Ticker } from '@/data/types/market';
import { SECTOR_HIERARCHY } from '@/data/constants/sectors';
import { TICKER_UNIVERSE } from '@/data/constants/tickers';


const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M'];

// Top ETFs for the outer ring: mapped from sector hierarchy
const TOP_ETFS = SECTOR_HIERARCHY.slice(0, 5).map((s) => ({
  id: `etf-${s.etf}`,
  label: s.etf,
  name: s.name,
  color: s.color,
  sectorName: s.name,
}));

interface SegmentData {
  id: string;
  label: string;
  displayLabel: string;
  value: number;
  color: string;
  change: number;
  changePercent: number;
  ringLevel: number;
  parentId?: string;
  ticker?: Ticker;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  label: string;
  value: number;
  change: number;
  changePercent: number;
  extra: Ticker | null;
}

function computeSectorAggregates(tickers: Map<string, Ticker>, sectorName: string) {
  const sectorTickers = TICKER_UNIVERSE.filter((t) => t.sector === sectorName);
  let totalVolume = 0;
  let weightedChange = 0;
  let totalCap = 0;
  for (const def of sectorTickers) {
    const t = tickers.get(def.symbol);
    if (t) {
      totalVolume += t.volume;
      weightedChange += t.changePercent * t.marketCap;
      totalCap += t.marketCap;
    }
  }
  return {
    volume: totalVolume,
    changePercent: totalCap > 0 ? weightedChange / totalCap : 0,
    change: totalCap > 0 ? (weightedChange / totalCap) * 0.01 * 100 : 0,
    marketCap: totalCap,
  };
}

function computeSubSectorAggregates(tickers: Map<string, Ticker>, sectorName: string, subSectorName: string) {
  const subTickers = TICKER_UNIVERSE.filter((t) => t.sector === sectorName && t.subSector === subSectorName);
  let totalVolume = 0;
  let weightedChange = 0;
  let totalCap = 0;
  for (const def of subTickers) {
    const t = tickers.get(def.symbol);
    if (t) {
      totalVolume += t.volume;
      weightedChange += t.changePercent * t.marketCap;
      totalCap += t.marketCap;
    }
  }
  return {
    volume: totalVolume,
    changePercent: totalCap > 0 ? weightedChange / totalCap : 0,
    change: totalCap > 0 ? (weightedChange / totalCap) * 0.01 * 100 : 0,
    marketCap: totalCap,
  };
}

export function OnionChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { timeframe, setTimeframe, drillPath, drillDown, drillUp, resetDrill } = useOnionStore();
  const tickers = useMarketStore((s) => s.tickers);
  const setSelectedSymbol = useDetailsStore((s) => s.setSelectedSymbol);

  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, label: '', value: 0, change: 0, changePercent: 0, extra: null,
  });

  // Observe container size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.floor(width), height: Math.floor(height) });
      }
    });
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  // Build ring data based on drillPath
  const rings = useMemo(() => {
    const result: SegmentData[][] = [];

    // Layer 1: ETFs (always visible)
    const etfRing: SegmentData[] = TOP_ETFS.map((etf) => {
      const agg = computeSectorAggregates(tickers, etf.sectorName);
      return {
        id: etf.id,
        label: etf.label,
        displayLabel: `${etf.label}`,
        value: Math.max(agg.volume / 1_000_000, 10), // normalize for sizing
        color: etf.color,
        change: agg.change,
        changePercent: agg.changePercent,
        ringLevel: 0,
      };
    });
    result.push(etfRing);

    // Layer 2: Sectors within selected ETF
    if (drillPath.length >= 1) {
      const selectedEtf = TOP_ETFS.find((e) => e.id === drillPath[0]);
      if (selectedEtf) {
        const sector = SECTOR_HIERARCHY.find((s) => s.name === selectedEtf.sectorName);
        if (sector) {
          const sectorRing: SegmentData[] = sector.subSectors.slice(0, 5).map((sub, i) => {
            const agg = computeSubSectorAggregates(tickers, sector.name, sub.name);
            const hue = d3.hsl(sector.color);
            hue.l = 0.4 + i * 0.08;
            return {
              id: `sector-${sub.name}`,
              label: sub.name,
              displayLabel: sub.name,
              value: Math.max(agg.volume / 1_000_000, 5),
              color: hue.formatHex(),
              change: agg.change,
              changePercent: agg.changePercent,
              ringLevel: 1,
              parentId: drillPath[0],
            };
          });
          result.push(sectorRing);
        }
      }
    }

    // Layer 3: Sub-sectors (tickers within sub-sector, displayed as sub-sector grouping)
    if (drillPath.length >= 2) {
      const selectedEtf = TOP_ETFS.find((e) => e.id === drillPath[0]);
      const subSectorName = drillPath[1].replace('sector-', '');
      if (selectedEtf) {
        const subTickers = TICKER_UNIVERSE.filter(
          (t) => t.sector === selectedEtf.sectorName && t.subSector === subSectorName
        );
        // Group by first letter as mock sub-grouping, or just show tickers directly
        if (subTickers.length > 0) {
          const subRing: SegmentData[] = subTickers.map((def, i) => {
            const t = tickers.get(def.symbol);
            const baseColor = SECTOR_HIERARCHY.find((s) => s.name === def.sector)?.color || '#6366F1';
            const hue = d3.hsl(baseColor);
            hue.l = 0.35 + i * 0.07;
            hue.s = 0.7 + i * 0.03;
            return {
              id: `subsector-${def.symbol}`,
              label: def.symbol,
              displayLabel: def.symbol,
              value: t ? t.volume / 1_000_000 : 10,
              color: hue.formatHex(),
              change: t?.change || 0,
              changePercent: t?.changePercent || 0,
              ringLevel: 2,
              parentId: drillPath[1],
              ticker: t || undefined,
            };
          });
          result.push(subRing);
        }
      }
    }

    // Layer 4: Center pie (ticker details)
    if (drillPath.length >= 3) {
      const symbol = drillPath[2].replace('subsector-', '');
      const t = tickers.get(symbol);
      if (t) {
        // Show a pie of fundamental metrics
        const pieParts: SegmentData[] = [
          { id: `pie-price`, label: 'Price', displayLabel: `$${t.price.toFixed(0)}`, value: 30, color: '#3B82F6', change: t.change, changePercent: t.changePercent, ringLevel: 3, ticker: t },
          { id: `pie-vol`, label: 'Volume', displayLabel: `${(t.volume / 1e6).toFixed(0)}M`, value: 25, color: '#10B981', change: 0, changePercent: 0, ringLevel: 3 },
          { id: `pie-cap`, label: 'MktCap', displayLabel: `${(t.marketCap / 1e9).toFixed(0)}B`, value: 25, color: '#F59E0B', change: 0, changePercent: 0, ringLevel: 3 },
          { id: `pie-pe`, label: 'P/E', displayLabel: t.pe.toFixed(1), value: 20, color: '#8B5CF6', change: 0, changePercent: 0, ringLevel: 3 },
        ];
        result.push(pieParts);
      }
    }

    return result;
  }, [drillPath, tickers]);

  // Breadcrumb labels
  const breadcrumbs = useMemo(() => {
    const crumbs: string[] = ['ETFs'];
    if (drillPath[0]) {
      const etf = TOP_ETFS.find((e) => e.id === drillPath[0]);
      if (etf) crumbs.push(etf.label);
    }
    if (drillPath[1]) {
      crumbs.push(drillPath[1].replace('sector-', ''));
    }
    if (drillPath[2]) {
      crumbs.push(drillPath[2].replace('subsector-', ''));
    }
    return crumbs;
  }, [drillPath]);

  const handleSegmentClick = useCallback(
    (segment: SegmentData) => {
      if (segment.ringLevel === 0) {
        // Click on ETF ring
        if (drillPath[0] === segment.id) {
          // Clicking same ETF - drill up
          resetDrill();
        } else {
          // Navigate/drill from this ETF
          resetDrill();
          setTimeout(() => drillDown(segment.id), 0);
        }
      } else if (segment.ringLevel === 1) {
        if (drillPath[1] === segment.id) return;
        // Re-drill from sector level
        const etfId = drillPath[0];
        resetDrill();
        setTimeout(() => {
          drillDown(etfId);
          setTimeout(() => drillDown(segment.id), 0);
        }, 0);
      } else if (segment.ringLevel === 2) {
        if (drillPath[2] === segment.id) return;
        const etfId = drillPath[0];
        const sectorId = drillPath[1];
        resetDrill();
        setTimeout(() => {
          drillDown(etfId);
          setTimeout(() => {
            drillDown(sectorId);
            setTimeout(() => {
              drillDown(segment.id);
              // Also select this ticker in the details panel
              const sym = segment.id.replace('subsector-', '');
              setSelectedSymbol(sym);
            }, 0);
          }, 0);
        }, 0);
      }
    },
    [drillPath, drillDown, resetDrill, setSelectedSymbol]
  );

  // D3 rendering
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return;

    const { width, height } = dimensions;
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(cx, cy) - 20;

    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    if (rings.length === 0) return;

    // Calculate radii for each ring - outer rings stay large, inner rings fit inside
    const ringCount = rings.length;
    const ringThickness = Math.min(maxRadius / (ringCount + 0.5), 55);
    const gap = 3;

    rings.forEach((ringData, ringIndex) => {
      const outerR = maxRadius - ringIndex * (ringThickness + gap);
      const innerR = outerR - ringThickness;

      if (innerR < 15) return; // Don't render if too small

      const pie = d3.pie<SegmentData>()
        .value((d) => d.value)
        .sort(null)
        .padAngle(0.02);

      const arc = d3.arc<d3.PieArcDatum<SegmentData>>()
        .innerRadius(innerR)
        .outerRadius(outerR)
        .cornerRadius(3);

      const hoverArc = d3.arc<d3.PieArcDatum<SegmentData>>()
        .innerRadius(innerR - 2)
        .outerRadius(outerR + 4)
        .cornerRadius(3);

      const arcs = pie(ringData);

      const ringGroup = g.append('g').attr('class', `ring-${ringIndex}`);

      // Segments
      ringGroup
        .selectAll('path')
        .data(arcs)
        .join('path')
        .attr('d', arc)
        .attr('fill', (d) => {
          // Highlight selected segments
          const isSelected = drillPath.includes(d.data.id);
          if (isSelected) {
            const c = d3.hsl(d.data.color);
            c.l = Math.min(c.l + 0.15, 0.8);
            return c.formatHex();
          }
          return d.data.color;
        })
        .attr('stroke', (d) => {
          const isSelected = drillPath.includes(d.data.id);
          return isSelected ? '#E2E8F0' : 'rgba(15,23,42,0.8)';
        })
        .attr('stroke-width', (d) => drillPath.includes(d.data.id) ? 2 : 1)
        .attr('opacity', (d) => {
          // Dim non-selected segments on drilled rings
          if (ringIndex < drillPath.length && !drillPath.includes(d.data.id)) {
            return 0.4;
          }
          return 0.9;
        })
        .attr('cursor', 'pointer')
        .on('mouseover', function (event, d) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('d', hoverArc(d) as string)
            .attr('opacity', 1);

          setTooltip({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            label: d.data.label,
            value: (d.data.value / ringData.reduce((s, seg) => s + seg.value, 0)) * 100,
            change: d.data.change,
            changePercent: d.data.changePercent,
            extra: d.data.ticker || null,
          });
        })
        .on('mousemove', function (event) {
          setTooltip((prev) => ({ ...prev, x: event.clientX, y: event.clientY }));
        })
        .on('mouseout', function (event, d) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('d', arc(d) as string)
            .attr('opacity', () => {
              if (ringIndex < drillPath.length && !drillPath.includes(d.data.id)) return 0.4;
              return 0.9;
            });

          setTooltip((prev) => ({ ...prev, visible: false }));
        })
        .on('click', function (event, d) {
          event.stopPropagation();
          handleSegmentClick(d.data);
        });

      // Labels
      ringGroup
        .selectAll('text')
        .data(arcs)
        .join('text')
        .attr('transform', (d) => {
          const [x, y] = arc.centroid(d);
          return `translate(${x},${y})`;
        })
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', '#E2E8F0')
        .attr('font-size', () => {
          if (ringIndex === 3) return '9px'; // Center pie
          if (ringThickness < 35) return '8px';
          return '10px';
        })
        .attr('font-weight', '600')
        .attr('pointer-events', 'none')
        .text((d) => {
          const angle = d.endAngle - d.startAngle;
          if (angle < 0.3) return ''; // Too small to label
          return d.data.displayLabel;
        });

      // Percentage labels (smaller, below main label)
      ringGroup
        .selectAll('.pct-label')
        .data(arcs)
        .join('text')
        .attr('class', 'pct-label')
        .attr('transform', (d) => {
          const [x, y] = arc.centroid(d);
          return `translate(${x},${y + 11})`;
        })
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', '#94A3B8')
        .attr('font-size', '8px')
        .attr('pointer-events', 'none')
        .text((d) => {
          const angle = d.endAngle - d.startAngle;
          if (angle < 0.4) return '';
          const total = ringData.reduce((s, seg) => s + seg.value, 0);
          const pct = (d.data.value / total) * 100;
          return `${pct.toFixed(0)}%`;
        });
    });

    // Center text when nothing drilled
    if (drillPath.length === 0) {
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', '#64748B')
        .attr('font-size', '11px')
        .text('Click a segment');
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('y', 16)
        .attr('fill', '#475569')
        .attr('font-size', '9px')
        .text('to drill down');
    }

  }, [rings, dimensions, drillPath, handleSegmentClick]);

  return (
    <WidgetContainer
      id="onion-chart"
      title="Onion Chart"
      className="h-full"
      noPadding
      headerActions={
        <div className="flex items-center gap-1">
          {drillPath.length > 0 && (
            <button
              onClick={resetDrill}
              className="px-1.5 py-0.5 text-[10px] rounded bg-slate-700 text-slate-300 hover:bg-slate-600 mr-1"
            >
              Reset
            </button>
          )}
          {drillPath.length > 1 && (
            <button
              onClick={drillUp}
              className="px-1.5 py-0.5 text-[10px] rounded bg-slate-700 text-slate-300 hover:bg-slate-600 mr-1"
            >
              Back
            </button>
          )}
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-1.5 py-0.5 text-[10px] rounded ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      }
    >
      {/* Breadcrumbs */}
      {drillPath.length > 0 && (
        <div className="px-3 py-1.5 border-b border-slate-700/50 flex items-center gap-1 text-[10px]">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-slate-600">/</span>}
              <button
                onClick={() => {
                  if (i === 0) resetDrill();
                  // Clicking breadcrumb reconstructs drill to that level
                }}
                className={`${i === breadcrumbs.length - 1 ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {crumb}
              </button>
            </span>
          ))}
        </div>
      )}

      <div ref={containerRef} className="flex-1 w-full h-full min-h-0 relative">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      <OnionTooltip
        x={tooltip.x}
        y={tooltip.y}
        label={tooltip.label}
        value={tooltip.value}
        change={tooltip.change}
        changePercent={tooltip.changePercent}
        extra={tooltip.extra}
        visible={tooltip.visible}
      />
    </WidgetContainer>
  );
}
