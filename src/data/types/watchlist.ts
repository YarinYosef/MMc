export type WatchlistItemType = 'ticker' | 'sub-sector' | 'sector' | 'etf' | 'currency' | 'resource';

export interface WatchlistItem {
  symbol: string;
  type: WatchlistItemType;
  addedAt: number;
  notes?: string;
  alertPrice?: number;
  alertDirection?: 'above' | 'below';
  subscribedToNews: boolean;
}

export interface WatchlistGroup {
  id: string;
  name: string;
  color: string; // hex color from palette
  items: WatchlistItem[];
  createdAt: number;
  sortOrder: number;
}

export type NotificationFrequency = 'immediate' | 'hourly' | 'daily';

export interface NotificationPreferences {
  groupId: string;
  email: boolean;
  phone: boolean;
  inApp: boolean;
  frequency: NotificationFrequency;
}

export interface NotificationContactInfo {
  emailAddress: string;
  phoneNumber: string;
}

export interface WatchlistState {
  groups: WatchlistGroup[];
  isOpen: boolean;
  activeGroupId: string | null;
  filterGroupId: string | null; // null = show all
  searchQuery: string;
  isDetached: boolean;
  notificationPrefs: NotificationPreferences[];
  contactInfo: NotificationContactInfo;
}
