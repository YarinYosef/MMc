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

// All 9 sector ETFs for the outer ring
const ALL_ETFS = SECTOR_HIERARCHY.map((s) => ({
  id: `etf-${s.etf}`,
  label: s.etf,
  name: s.name,
  color: s.color,
  sectorName: s.name,
}));

// Distinct color palettes for inner rings (not derived from parent sector)
const INNER_PALETTE_1 = ['#F472B6', '#A78BFA', '#34D399', '#FBBF24', '#60A5FA', '#FB923C', '#E879F9', '#2DD4BF'];
const INNER_PALETTE_2 = ['#38BDF8', '#FB7185', '#A3E635', '#C084FC', '#FACC15', '#4ADE80', '#F87171', '#818CF8'];
const INNER_PALETTE_3 = ['#22D3EE', '#F97316', '#A78BFA', '#10B981', '#EF4444', '#6366F1', '#F59E0B', '#EC4899'];

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

function computeIndustryAggregates(tickers: Map<string, Ticker>, sectorName: string, subSectorName: string, industryName: string) {
  const indTickers = TICKER_UNIVERSE.filter(
    (t) => t.sector === sectorName && t.subSector === subSectorName && t.industry === industryName
  );
  let totalVolume = 0;
  let weightedChange = 0;
  let totalCap = 0;
  for (const def of indTickers) {
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
  const { timeframe, setTimeframe, drillPath, drillUp, resetDrill, setDrillPath } = useOnionStore();
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
  // 4 GICS-aligned layers: ETFs → Sectors → Sub-sectors → Tickers
  const rings = useMemo(() => {
    const result: SegmentData[][] = [];

    // Ring 0 (outermost donut): All 5 sector ETFs
    const etfWithAgg = ALL_ETFS.map((etf) => ({
      etf,
      agg: computeSectorAggregates(tickers, etf.sectorName),
    }));

    const etfRing: SegmentData[] = etfWithAgg.map(({ etf, agg }) => ({
      id: etf.id,
      label: etf.label,
      displayLabel: etf.label,
      value: Math.max(agg.volume / 1_000_000, 10),
      color: etf.color,
      change: agg.change,
      changePercent: agg.changePercent,
      ringLevel: 0,
    }));
    result.push(etfRing);

    // Ring 1 (donut): Top 5 sub-sectors within selected ETF by aggregate market cap
    if (drillPath.length >= 1) {
      const selectedEtf = ALL_ETFS.find((e) => e.id === drillPath[0]);
      if (selectedEtf) {
        const sector = SECTOR_HIERARCHY.find((s) => s.name === selectedEtf.sectorName);
        if (sector) {
          const subWithAgg = sector.subSectors.map((sub) => ({
            sub,
            agg: computeSubSectorAggregates(tickers, sector.name, sub.name),
          }));
          subWithAgg.sort((a, b) => b.agg.marketCap - a.agg.marketCap);
          const top5Subs = subWithAgg.slice(0, 5);

          const sectorRing: SegmentData[] = top5Subs.map(({ sub, agg }, i) => ({
            id: `sector-${sub.name}`,
            label: sub.name,
            displayLabel: sub.name,
            value: Math.max(agg.volume / 1_000_000, 5),
            color: INNER_PALETTE_1[i % INNER_PALETTE_1.length],
            change: agg.change,
            changePercent: agg.changePercent,
            ringLevel: 1,
            parentId: drillPath[0],
          }));
          result.push(sectorRing);
        }
      }
    }

    // Ring 2 (donut): Industries within selected sub-sector
    if (drillPath.length >= 2) {
      const selectedEtf = ALL_ETFS.find((e) => e.id === drillPath[0]);
      const subSectorName = drillPath[1].replace('sector-', '');
      if (selectedEtf) {
        const sector = SECTOR_HIERARCHY.find((s) => s.name === selectedEtf.sectorName);
        const subSector = sector?.subSectors.find((ss) => ss.name === subSectorName);
        if (sector && subSector && subSector.industries.length > 0) {
          const industryRing: SegmentData[] = subSector.industries.map((ind, i) => {
            const agg = computeIndustryAggregates(tickers, sector.name, subSectorName, ind);
            return {
              id: `subsector-${ind}`,
              label: ind,
              displayLabel: ind.length > 18 ? ind.slice(0, 16) + '..' : ind,
              value: Math.max(agg.volume / 1_000_000, 3),
              color: INNER_PALETTE_2[i % INNER_PALETTE_2.length],
              change: agg.change,
              changePercent: agg.changePercent,
              ringLevel: 2,
              parentId: drillPath[1],
            };
          });
          result.push(industryRing);
        }
      }
    }

    // Ring 3 (center pie): Top 5 tickers by market cap within selected industry
    if (drillPath.length >= 3) {
      const selectedEtf = ALL_ETFS.find((e) => e.id === drillPath[0]);
      const subSectorName = drillPath[1].replace('sector-', '');
      const industryName = drillPath[2].replace('subsector-', '');
      if (selectedEtf) {
        const sector = SECTOR_HIERARCHY.find((s) => s.name === selectedEtf.sectorName);
        if (sector) {
          const indTickers = TICKER_UNIVERSE
            .filter((t) => t.sector === sector.name && t.subSector === subSectorName && t.industry === industryName)
            .sort((a, b) => b.marketCap - a.marketCap)
            .slice(0, 5);

          if (indTickers.length > 0) {
            const tickerPie: SegmentData[] = indTickers.map((def, i) => {
              const t = tickers.get(def.symbol);
              return {
                id: `ticker-${def.symbol}`,
                label: def.symbol,
                displayLabel: def.symbol,
                value: def.marketCap,
                color: INNER_PALETTE_3[i % INNER_PALETTE_3.length],
                change: t?.change || 0,
                changePercent: t?.changePercent || 0,
                ringLevel: 3,
                parentId: drillPath[2],
                ticker: t || undefined,
              };
            });
            result.push(tickerPie);
          }
        }
      }
    }

    return result;
  }, [drillPath, tickers]);

  // Breadcrumb labels
  const breadcrumbs = useMemo(() => {
    const crumbs: string[] = ['ETFs'];
    if (drillPath[0]) {
      const etf = ALL_ETFS.find((e) => e.id === drillPath[0]);
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
      // Clicking a ticker in center pie -> select in details panel
      if (segment.ringLevel === 3) {
        const sym = segment.id.replace('ticker-', '');
        setSelectedSymbol(sym);
        return;
      }

      if (segment.ringLevel === 0) {
        if (drillPath[0] === segment.id) {
          resetDrill();
        } else {
          setDrillPath([segment.id]);
        }
      } else if (segment.ringLevel === 1) {
        if (drillPath[1] === segment.id) return;
        setDrillPath([drillPath[0], segment.id]);
      } else if (segment.ringLevel === 2) {
        if (drillPath[2] === segment.id) return;
        setDrillPath([drillPath[0], drillPath[1], segment.id]);
      }
    },
    [drillPath, resetDrill, setDrillPath, setSelectedSymbol]
  );

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = useCallback(
    (level: number) => {
      if (level === 0) {
        resetDrill();
      } else {
        setDrillPath(drillPath.slice(0, level));
      }
    },
    [drillPath, resetDrill, setDrillPath]
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

    const ringCount = rings.length;
    const ringThickness = Math.min(maxRadius / (ringCount + 0.5), 55);
    const gap = 3;

    rings.forEach((ringData, ringIndex) => {
      const isCenterPie = ringIndex === rings.length - 1 && ringIndex === 3;

      const outerR = maxRadius - ringIndex * (ringThickness + gap);
      const innerR = isCenterPie ? 0 : outerR - ringThickness;

      if (outerR <= 0) return;

      const pie = d3.pie<SegmentData>()
        .value((d) => d.value)
        .sort(null)
        .padAngle(isCenterPie ? 0.02 : 0.02);

      const arc = d3.arc<d3.PieArcDatum<SegmentData>>()
        .innerRadius(innerR)
        .outerRadius(outerR)
        .cornerRadius(isCenterPie ? 2 : 3);

      const hoverArc = d3.arc<d3.PieArcDatum<SegmentData>>()
        .innerRadius(Math.max(0, innerR - 2))
        .outerRadius(outerR + 4)
        .cornerRadius(isCenterPie ? 2 : 3);

      const arcs = pie(ringData);

      const ringGroup = g.append('g').attr('class', `ring-${ringIndex}`);

      // Segments
      ringGroup
        .selectAll('path')
        .data(arcs)
        .join('path')
        .attr('d', arc)
        .attr('fill', (d) => {
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
          return isSelected ? '#FFFFFF' : 'rgba(0,0,0,0.8)';
        })
        .attr('stroke-width', (d) => drillPath.includes(d.data.id) ? 2 : 1)
        .attr('opacity', (d) => {
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
        .attr('fill', '#FFFFFF')
        .attr('font-size', () => {
          if (isCenterPie) return '9px';
          if (ringThickness < 35) return '8px';
          return '10px';
        })
        .attr('font-weight', '600')
        .attr('pointer-events', 'none')
        .text((d) => {
          const angle = d.endAngle - d.startAngle;
          if (angle < 0.3) return '';
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
        .attr('fill', '#999999')
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
      className="h-full"
      noPadding
    >
      <div ref={containerRef} className="flex-1 w-full h-full min-h-0 relative">
        {/* Breadcrumbs overlay at top-left */}
        {drillPath.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 text-[10px] bg-[#131313]/80 backdrop-blur-sm rounded-md px-2 py-1">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#777777]">/</span>}
                <button
                  onClick={() => handleBreadcrumbClick(i)}
                  className={`${i === breadcrumbs.length - 1 ? 'text-[#AB9FF2]' : 'text-[#999999] hover:text-white'}`}
                >
                  {crumb}
                </button>
              </span>
            ))}
          </div>
        )}
        {/* Buttons overlay at top-right */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-[#131313]/80 backdrop-blur-sm rounded-md px-2 py-1">
          {drillPath.length > 0 && (
            <button
              onClick={resetDrill}
              className="px-1.5 py-0.5 text-[10px] rounded bg-white/[0.06] text-[#999999] hover:bg-white/10 mr-1"
            >
              Reset
            </button>
          )}
          {drillPath.length > 1 && (
            <button
              onClick={drillUp}
              className="px-1.5 py-0.5 text-[10px] rounded bg-white/[0.06] text-[#999999] hover:bg-white/10 mr-1"
            >
              Back
            </button>
          )}
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-1.5 py-0.5 text-[10px] rounded ${timeframe === tf
                ? 'bg-[#AB9FF2] text-white'
                : 'text-[#999999] hover:text-white'
                }`}
            >
              {tf}
            </button>
          ))}
        </div>
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
