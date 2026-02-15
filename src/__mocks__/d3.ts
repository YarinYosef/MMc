/* eslint-disable @typescript-eslint/no-explicit-any */
// Manual mock for d3 (ESM-only package that Jest can't transform)
export const select = jest.fn(() => ({
  append: jest.fn().mockReturnThis(),
  attr: jest.fn().mockReturnThis(),
  style: jest.fn().mockReturnThis(),
  text: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  call: jest.fn().mockReturnThis(),
  selectAll: jest.fn().mockReturnThis(),
  data: jest.fn().mockReturnThis(),
  enter: jest.fn().mockReturnThis(),
  exit: jest.fn().mockReturnThis(),
  remove: jest.fn().mockReturnThis(),
  merge: jest.fn().mockReturnThis(),
  transition: jest.fn().mockReturnThis(),
  duration: jest.fn().mockReturnThis(),
  ease: jest.fn().mockReturnThis(),
  node: jest.fn(() => null),
}));
export const selectAll = jest.fn(() => select());
export const scaleLinear = jest.fn(() => {
  const scale = (v: number) => v;
  (scale as any).domain = jest.fn().mockReturnValue(scale);
  (scale as any).range = jest.fn().mockReturnValue(scale);
  (scale as any).nice = jest.fn().mockReturnValue(scale);
  (scale as any).ticks = jest.fn(() => []);
  return scale;
});
export const scaleOrdinal = jest.fn(() => {
  const scale = (v: string) => v;
  (scale as any).domain = jest.fn().mockReturnValue(scale);
  (scale as any).range = jest.fn().mockReturnValue(scale);
  return scale;
});
export const scaleBand = jest.fn(() => {
  const scale = () => 0;
  (scale as any).domain = jest.fn().mockReturnValue(scale);
  (scale as any).range = jest.fn().mockReturnValue(scale);
  (scale as any).padding = jest.fn().mockReturnValue(scale);
  (scale as any).bandwidth = jest.fn(() => 10);
  return scale;
});
export const arc = jest.fn(() => {
  const a: any = jest.fn(() => '');
  a.innerRadius = jest.fn().mockReturnValue(a);
  a.outerRadius = jest.fn().mockReturnValue(a);
  a.startAngle = jest.fn().mockReturnValue(a);
  a.endAngle = jest.fn().mockReturnValue(a);
  a.padAngle = jest.fn().mockReturnValue(a);
  a.cornerRadius = jest.fn().mockReturnValue(a);
  return a;
});
export const pie = jest.fn(() => {
  const p: any = jest.fn(() => []);
  p.value = jest.fn().mockReturnValue(p);
  p.sort = jest.fn().mockReturnValue(p);
  p.sortValues = jest.fn().mockReturnValue(p);
  p.padAngle = jest.fn().mockReturnValue(p);
  return p;
});
export const line = jest.fn(() => {
  const l: any = jest.fn(() => '');
  l.x = jest.fn().mockReturnValue(l);
  l.y = jest.fn().mockReturnValue(l);
  l.curve = jest.fn().mockReturnValue(l);
  l.defined = jest.fn().mockReturnValue(l);
  return l;
});
export const area = jest.fn(() => {
  const a: any = jest.fn(() => '');
  a.x = jest.fn().mockReturnValue(a);
  a.y0 = jest.fn().mockReturnValue(a);
  a.y1 = jest.fn().mockReturnValue(a);
  a.curve = jest.fn().mockReturnValue(a);
  return a;
});
export const sankey = jest.fn(() => {
  const s: any = jest.fn(() => ({ nodes: [], links: [] }));
  s.nodeWidth = jest.fn().mockReturnValue(s);
  s.nodePadding = jest.fn().mockReturnValue(s);
  s.extent = jest.fn().mockReturnValue(s);
  s.nodeId = jest.fn().mockReturnValue(s);
  s.nodeAlign = jest.fn().mockReturnValue(s);
  return s;
});
export const sankeyLinkHorizontal = jest.fn(() => jest.fn(() => ''));
export const sankeyLeft = jest.fn();
export const sankeyRight = jest.fn();
export const sankeyCenter = jest.fn();
export const sankeyJustify = jest.fn();
export const treemap = jest.fn(() => {
  const t: any = jest.fn(() => ({}));
  t.size = jest.fn().mockReturnValue(t);
  t.padding = jest.fn().mockReturnValue(t);
  t.round = jest.fn().mockReturnValue(t);
  t.tile = jest.fn().mockReturnValue(t);
  return t;
});
export const hierarchy = jest.fn(() => ({
  sum: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  children: [],
  data: {},
  value: 0,
  leaves: jest.fn(() => []),
}));
export const treemapSquarify = jest.fn();
export const treemapBinary = jest.fn();
export const interpolate = jest.fn(() => jest.fn());
export const interpolateNumber = jest.fn(() => jest.fn());
export const interpolateRound = jest.fn(() => jest.fn());
export const curveMonotoneX = jest.fn();
export const curveBasis = jest.fn();
export const curveLinear = jest.fn();
export const max = jest.fn((arr: number[]) => Math.max(...arr));
export const min = jest.fn((arr: number[]) => Math.min(...arr));
export const extent = jest.fn((arr: number[]) => [Math.min(...arr), Math.max(...arr)]);
export const sum = jest.fn((arr: number[]) => arr.reduce((a, b) => a + b, 0));
export const mean = jest.fn((arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length);
export const format = jest.fn(() => jest.fn((v: number) => String(v)));
export const axisBottom = jest.fn(() => jest.fn());
export const axisLeft = jest.fn(() => jest.fn());
export const axisRight = jest.fn(() => jest.fn());
export const axisTop = jest.fn(() => jest.fn());
export const color = jest.fn(() => ({ toString: () => '#000' }));
export const rgb = jest.fn(() => ({ toString: () => '#000' }));
export const hsl = jest.fn(() => ({ toString: () => '#000' }));
