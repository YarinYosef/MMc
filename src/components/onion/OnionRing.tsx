'use client';

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { type OnionSegment } from '@/data/types/onion';

interface OnionRingProps {
  segments: OnionSegment[];
  innerRadius: number;
  outerRadius: number;
  selectedId?: string | null;
  onSegmentClick?: (segment: OnionSegment) => void;
  onSegmentHover?: (segment: OnionSegment | null, event?: MouseEvent) => void;
}

export function OnionRing({
  segments,
  innerRadius,
  outerRadius,
  selectedId,
  onSegmentClick,
  onSegmentHover,
}: OnionRingProps) {
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = d3.select(gRef.current);
    if (!g.node() || segments.length === 0) return;

    g.selectAll('*').remove();

    const pie = d3.pie<OnionSegment>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.02);

    const arc = d3.arc<d3.PieArcDatum<OnionSegment>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(3);

    const hoverArc = d3.arc<d3.PieArcDatum<OnionSegment>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(outerRadius + 4)
      .cornerRadius(3);

    const arcs = pie(segments);

    g.selectAll('path')
      .data(arcs)
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => {
        if (selectedId && d.data.id === selectedId) {
          const c = d3.hsl(d.data.color);
          c.l = Math.min(c.l + 0.15, 0.8);
          return c.formatHex();
        }
        return d.data.color;
      })
      .attr('stroke', (d) => (selectedId && d.data.id === selectedId ? '#FFFFFF' : 'rgba(0,0,0,0.8)'))
      .attr('stroke-width', (d) => (selectedId && d.data.id === selectedId ? 2 : 1))
      .attr('opacity', (d) => {
        if (selectedId && d.data.id !== selectedId) return 0.45;
        return 0.9;
      })
      .attr('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', hoverArc(d) as string)
          .attr('opacity', 1);
        onSegmentHover?.(d.data, event as unknown as MouseEvent);
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arc(d) as string)
          .attr('opacity', selectedId && d.data.id !== selectedId ? 0.45 : 0.9);
        onSegmentHover?.(null);
      })
      .on('click', function (event, d) {
        event.stopPropagation();
        onSegmentClick?.(d.data);
      });

    // Labels
    g.selectAll('text.label')
      .data(arcs)
      .join('text')
      .attr('class', 'label')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .text((d) => {
        const angle = d.endAngle - d.startAngle;
        return angle > 0.3 ? d.data.label : '';
      });

  }, [segments, innerRadius, outerRadius, selectedId, onSegmentClick, onSegmentHover]);

  return <g ref={gRef} />;
}
