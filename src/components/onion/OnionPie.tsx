'use client';

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface PieSegment {
  label: string;
  value: number;
  color: string;
}

interface OnionPieProps {
  segments: PieSegment[];
  radius: number;
  centerLabel?: string;
}

export function OnionPie({ segments, radius, centerLabel }: OnionPieProps) {
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = d3.select(gRef.current);
    if (!g.node() || segments.length === 0) return;

    g.selectAll('*').remove();

    const pie = d3.pie<PieSegment>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.03);

    const arc = d3.arc<d3.PieArcDatum<PieSegment>>()
      .innerRadius(radius * 0.3)
      .outerRadius(radius)
      .cornerRadius(2);

    const arcs = pie(segments);

    g.selectAll('path')
      .data(arcs)
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', 'rgba(15,23,42,0.6)')
      .attr('stroke-width', 1)
      .attr('opacity', 0.9);

    // Labels
    g.selectAll('text')
      .data(arcs)
      .join('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#E2E8F0')
      .attr('font-size', '8px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .text((d) => {
        const angle = d.endAngle - d.startAngle;
        return angle > 0.5 ? d.data.label : '';
      });

    // Center label
    if (centerLabel) {
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', '#94A3B8')
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .text(centerLabel);
    }
  }, [segments, radius, centerLabel]);

  return <g ref={gRef} />;
}
