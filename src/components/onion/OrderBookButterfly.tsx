'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useMarketStore } from '@/stores/useMarketStore';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { generateOrderBook } from '@/data/generators/orderBookGenerator';
import { WidgetContainer } from '@/components/layout/WidgetContainer';

export function OrderBookButterfly() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedSymbol = useDetailsStore((s) => s.selectedSymbol);
  const getTicker = useMarketStore((s) => s.getTicker);

  const [dims, setDims] = useState({ width: 400, height: 300 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDims({ width: Math.floor(width), height: Math.floor(height) });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const orderBook = useMemo(() => {
    if (!selectedSymbol) return null;
    const t = getTicker(selectedSymbol);
    if (!t) return null;
    return generateOrderBook(t.price, 15);
  }, [selectedSymbol, getTicker]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node() || !orderBook) return;

    const { width, height } = dims;
    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 10, bottom: 20, left: 10 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const centerX = innerW / 2;
    const barHeight = Math.min(Math.floor(innerH / Math.max(orderBook.bids.length, orderBook.asks.length, 1)) - 1, 16);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const maxTotal = Math.max(
      d3.max(orderBook.bids, (d) => d.total) || 1,
      d3.max(orderBook.asks, (d) => d.total) || 1
    );

    const xScale = d3.scaleLinear().domain([0, maxTotal]).range([0, centerX - 40]);

    // Spread indicator
    g.append('rect')
      .attr('x', centerX - 25)
      .attr('y', 0)
      .attr('width', 50)
      .attr('height', innerH)
      .attr('fill', 'rgba(51,65,85,0.3)')
      .attr('rx', 2);

    g.append('text')
      .attr('x', centerX)
      .attr('y', -6)
      .attr('text-anchor', 'middle')
      .attr('fill', '#999999')
      .attr('font-size', '9px')
      .text(`Spread: $${orderBook.spread.toFixed(2)} (${orderBook.spreadPercent.toFixed(2)}%)`);

    // Bids (left side, green)
    orderBook.bids.forEach((bid, i) => {
      const y = i * (barHeight + 1);
      const barW = xScale(bid.total);

      // Cumulative depth bar
      g.append('rect')
        .attr('x', centerX - 25 - barW)
        .attr('y', y)
        .attr('width', barW)
        .attr('height', barHeight)
        .attr('fill', 'rgba(34,197,94,0.25)')
        .attr('rx', 1);

      // Size bar (darker, inner)
      const sizeW = xScale(bid.size);
      g.append('rect')
        .attr('x', centerX - 25 - sizeW)
        .attr('y', y)
        .attr('width', sizeW)
        .attr('height', barHeight)
        .attr('fill', 'rgba(34,197,94,0.5)')
        .attr('rx', 1);

      // Price label (near center)
      g.append('text')
        .attr('x', centerX - 2)
        .attr('y', y + barHeight / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'central')
        .attr('fill', '#22C55E')
        .attr('font-size', '8px')
        .attr('font-weight', '500')
        .text(bid.price.toFixed(2));

      // Quantity
      if (barW > 30) {
        g.append('text')
          .attr('x', centerX - 30 - barW / 2)
          .attr('y', y + barHeight / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#86EFAC')
          .attr('font-size', '7px')
          .text(bid.size.toLocaleString());
      }
    });

    // Asks (right side, red)
    orderBook.asks.forEach((ask, i) => {
      const y = i * (barHeight + 1);
      const barW = xScale(ask.total);

      // Cumulative depth bar
      g.append('rect')
        .attr('x', centerX + 25)
        .attr('y', y)
        .attr('width', barW)
        .attr('height', barHeight)
        .attr('fill', 'rgba(239,68,68,0.25)')
        .attr('rx', 1);

      // Size bar
      const sizeW = xScale(ask.size);
      g.append('rect')
        .attr('x', centerX + 25)
        .attr('y', y)
        .attr('width', sizeW)
        .attr('height', barHeight)
        .attr('fill', 'rgba(239,68,68,0.5)')
        .attr('rx', 1);

      // Price label (near center)
      g.append('text')
        .attr('x', centerX + 28)
        .attr('y', y + barHeight / 2)
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'central')
        .attr('fill', '#EF4444')
        .attr('font-size', '8px')
        .attr('font-weight', '500')
        .text(ask.price.toFixed(2));

      // Quantity
      if (barW > 30) {
        g.append('text')
          .attr('x', centerX + 30 + barW / 2)
          .attr('y', y + barHeight / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#FCA5A5')
          .attr('font-size', '7px')
          .text(ask.size.toLocaleString());
      }
    });

    // Labels at top
    g.append('text')
      .attr('x', centerX / 2)
      .attr('y', -6)
      .attr('text-anchor', 'middle')
      .attr('fill', '#22C55E')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .text('BUY');

    g.append('text')
      .attr('x', centerX + centerX / 2)
      .attr('y', -6)
      .attr('text-anchor', 'middle')
      .attr('fill', '#EF4444')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .text('SELL');

  }, [orderBook, dims]);

  return (
    <WidgetContainer
      id="orderbook-butterfly"
      title={`Order Book${selectedSymbol ? ` - ${selectedSymbol}` : ''}`}
      className="h-full"
      noPadding
    >
      <div ref={containerRef} className="w-full h-full min-h-0">
        {orderBook ? (
          <svg ref={svgRef} className="w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full text-[#777777] text-xs">
            Select a ticker to view order book
          </div>
        )}
      </div>
    </WidgetContainer>
  );
}
