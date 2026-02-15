import { type Timeframe } from './market';

export type OnionRingType =
  | 'asset-class'
  | 'sector'
  | 'sub-sector'
  | 'factor-style'
  | 'ticker';

export interface OnionSegment {
  id: string;
  label: string;
  value: number;
  color: string;
  ringType: OnionRingType;
  parentId?: string;
  children?: string[];
  change: number;
  changePercent: number;
}

export interface OnionRingData {
  type: OnionRingType;
  segments: OnionSegment[];
  innerRadius: number;
  outerRadius: number;
}

export interface OnionState {
  selectedRing: OnionRingType | null;
  selectedSegment: string | null;
  hoveredSegment: string | null;
  timeframe: Timeframe;
  drillPath: string[]; // breadcrumb of selections
  rotation: number;
}

export type MoneyMapType =
  | 'cross-asset'
  | 'sector'
  | 'sub-sector'
  | 'factor-style'
  | 'stock-selection';

export interface MoneyMapData {
  type: MoneyMapType;
  nodes: MoneyMapNode[];
  flows: MoneyMapFlow[];
}

export interface MoneyMapNode {
  id: string;
  label: string;
  value: number;
  change: number;
  category: string;
  size: number;
}

export interface MoneyMapFlow {
  source: string;
  target: string;
  value: number;
  direction: 'inflow' | 'outflow';
}
