export interface WindowState {
  id: string;
  type: 'main' | 'detached-news' | 'detached-watchlist' | 'chart-modal';
  isOpen: boolean;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface WidgetPosition {
  id: string;
  type: 'compass' | 'onion' | 'moneymap' | 'details' | 'news' | 'watchlist' | 'manage' | 'screener';
  order: number;
  visible: boolean;
}

export interface DashboardLayout {
  id: string;
  name: string;
  createdAt: number;
  widgets: WidgetPosition[];
  newsHeightPercent: number;
  onionMoneyMapSplit?: number;
  detachedWindows: WindowState[];
  hiddenCompasses?: string[];
}

export interface LayoutState {
  currentLayoutId: string;
  savedLayouts: DashboardLayout[];
  windows: WindowState[];
  isDragging: boolean;
  dragSource: string | null;
  dragTarget: string | null;
}

export interface ManagingPaneState {
  isOpen: boolean;
  activeTab: 'notes' | 'todo' | 'alerts' | 'feedback';
}

export interface NoteEntry {
  id: string;
  content: string;
  ticker?: string;
  createdAt: number;
  updatedAt: number;
}

export interface TodoEntry {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface AlertEntry {
  id: string;
  ticker: string;
  condition: 'price-above' | 'price-below' | 'volume-spike' | 'percent-change';
  value: number;
  isActive: boolean;
  createdAt: number;
  triggeredAt?: number;
}
