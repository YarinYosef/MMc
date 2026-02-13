'use client';

import { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { type SankeyData } from '@/data/generators/financialGenerator';
import { formatCurrency } from '@/lib/utils';

// D3 Sankey layout implementation (minimal, no external sankey plugin needed)
interface SankeyNode {
  id: string;
  label: string;
  value: number;
  color: string;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  sourceLinks: SankeyLink[];
  targetLinks: SankeyLink[];
}

interface SankeyLink {
  source: SankeyNode;
  target: SankeyNode;
  value: number;
  color: string;
  width: number;
  y0: number;
  y1: number;
}

function computeSankeyLayout(data: SankeyData, width: number, height: number) {
  const nodeWidth = 16;
  const nodePadding = 12;

  // Build node map
  const nodeMap = new Map<string, SankeyNode>();
  data.nodes.forEach((n) => {
    nodeMap.set(n.id, {
      ...n,
      x0: 0, x1: 0, y0: 0, y1: 0,
      sourceLinks: [],
      targetLinks: [],
    });
  });

  // Build links
  const links: SankeyLink[] = data.links.map((l) => ({
    source: nodeMap.get(l.source)!,
    target: nodeMap.get(l.target)!,
    value: l.value,
    color: l.color,
    width: 0,
    y0: 0,
    y1: 0,
  }));

  links.forEach((l) => {
    l.source.sourceLinks.push(l);
    l.target.targetLinks.push(l);
  });

  // Assign columns by depth
  const columns: SankeyNode[][] = [];
  const visited = new Set<string>();

  function assignColumn(node: SankeyNode, col: number) {
    if (visited.has(node.id)) return;
    visited.add(node.id);
    while (columns.length <= col) columns.push([]);
    columns[col].push(node);
    node.sourceLinks.forEach((l) => assignColumn(l.target, col + 1));
  }

  // Start from nodes with no incoming links
  const roots = Array.from(nodeMap.values()).filter((n) => n.targetLinks.length === 0);
  roots.forEach((r) => assignColumn(r, 0));

  // Also assign any unvisited nodes
  nodeMap.forEach((n) => {
    if (!visited.has(n.id)) {
      assignColumn(n, 0);
    }
  });

  const numCols = columns.length;
  if (numCols === 0) return { nodes: [], links: [] };

  const colWidth = (width - nodeWidth) / Math.max(numCols - 1, 1);

  // Position nodes horizontally
  columns.forEach((col, i) => {
    col.forEach((node) => {
      node.x0 = i * colWidth;
      node.x1 = node.x0 + nodeWidth;
    });
  });

  // Calculate node heights based on value
  const maxValue = Math.max(...Array.from(nodeMap.values()).map((n) => n.value), 1);
  const availableHeight = height - (columns.reduce((max, col) => Math.max(max, col.length), 0) - 1) * nodePadding;
  const scale = availableHeight / maxValue;

  columns.forEach((col) => {
    let y = 0;
    col.forEach((node) => {
      const nodeHeight = Math.max(node.value * scale, 4);
      node.y0 = y;
      node.y1 = y + nodeHeight;
      y += nodeHeight + nodePadding;
    });
    // Center column vertically
    const totalHeight = y - nodePadding;
    const offset = (height - totalHeight) / 2;
    if (offset > 0) {
      col.forEach((node) => {
        node.y0 += offset;
        node.y1 += offset;
      });
    }
  });

  // Position links
  links.forEach((link) => {
    link.width = Math.max(link.value * scale, 1);
    const sourceMid = (link.source.y0 + link.source.y1) / 2;
    const targetMid = (link.target.y0 + link.target.y1) / 2;
    link.y0 = sourceMid;
    link.y1 = targetMid;
  });

  return { nodes: Array.from(nodeMap.values()), links };
}

interface SankeyChartProps {
  data: SankeyData;
  width?: number;
  height?: number;
}

export function SankeyChart({ data, width: propWidth, height: propHeight }: SankeyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dimensions = useMemo(() => {
    return { width: propWidth || 320, height: propHeight || 220 };
  }, [propWidth, propHeight]);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 10, right: 80, bottom: 10, left: 10 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const layout = computeSankeyLayout(data, innerWidth, innerHeight);

    // Draw links
    g.selectAll('.link')
      .data(layout.links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d) => {
        const sx = d.source.x1;
        const tx = d.target.x0;
        const mx = (sx + tx) / 2;
        return `M${sx},${d.y0} C${mx},${d.y0} ${mx},${d.y1} ${tx},${d.y1}`;
      })
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', (d) => Math.max(d.width, 1))
      .attr('fill', 'none')
      .attr('opacity', 0.5);

    // Draw nodes
    g.selectAll('.node')
      .data(layout.nodes)
      .enter()
      .append('rect')
      .attr('class', 'node')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => Math.max(d.y1 - d.y0, 2))
      .attr('fill', (d) => d.color)
      .attr('rx', 2);

    // Draw labels
    g.selectAll('.label')
      .data(layout.nodes)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d) => d.x1 + 6)
      .attr('y', (d) => (d.y0 + d.y1) / 2)
      .attr('dy', '0.35em')
      .attr('font-size', '9px')
      .attr('fill', '#94A3B8')
      .text((d) => `${d.label} ${formatCurrency(d.value)}`);

  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <svg ref={svgRef} />
    </div>
  );
}
