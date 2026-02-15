// Notification system for alerts and events

import { type NotificationFrequency } from '@/data/types/watchlist';

export type NotificationType = 'price-alert' | 'news' | 'system' | 'error';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  ticker?: string;
  timestamp: number;
  groupId?: string;
}

// Browser notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;

  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendBrowserNotification(payload: NotificationPayload): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  new Notification(payload.title, {
    body: payload.message,
    icon: '/favicon.ico',
    tag: `${payload.type}-${payload.ticker ?? 'system'}`,
  });
}

// In-app notification queue (for react-toastify)
type ToastCallback = (payload: NotificationPayload) => void;
let toastCallback: ToastCallback | null = null;

export function setToastCallback(cb: ToastCallback): void {
  toastCallback = cb;
}

export function notify(payload: NotificationPayload): void {
  // Send browser notification
  sendBrowserNotification(payload);

  // Send in-app toast
  if (toastCallback) {
    toastCallback(payload);
  }
}

export function notifyPriceAlert(ticker: string, price: number, direction: 'above' | 'below'): void {
  notify({
    type: 'price-alert',
    title: `Price Alert: ${ticker}`,
    message: `${ticker} is now ${direction} $${price.toFixed(2)}`,
    ticker,
    timestamp: Date.now(),
  });
}

// Digest notification batching
interface DigestBucket {
  items: NotificationPayload[];
  lastFlushed: number;
}

const digestBuckets: Record<string, DigestBucket> = {};
let digestIntervalId: ReturnType<typeof setInterval> | null = null;

function getDigestKey(groupId: string, frequency: NotificationFrequency): string {
  return `${groupId}:${frequency}`;
}

export function queueDigestNotification(
  payload: NotificationPayload,
  groupId: string,
  frequency: NotificationFrequency
): void {
  if (frequency === 'immediate') {
    notify(payload);
    return;
  }

  const key = getDigestKey(groupId, frequency);
  if (!digestBuckets[key]) {
    digestBuckets[key] = { items: [], lastFlushed: Date.now() };
  }
  digestBuckets[key].items.push(payload);
}

function flushDigestBucket(key: string): void {
  const bucket = digestBuckets[key];
  if (!bucket || bucket.items.length === 0) return;

  const count = bucket.items.length;
  const tickers = [...new Set(bucket.items.map((i) => i.ticker).filter(Boolean))];
  const tickerStr = tickers.length > 0 ? tickers.join(', ') : 'various';

  notify({
    type: 'news',
    title: `News Digest (${count} items)`,
    message: `${count} news update${count > 1 ? 's' : ''} for ${tickerStr}`,
    timestamp: Date.now(),
  });

  bucket.items = [];
  bucket.lastFlushed = Date.now();
}

export function startDigestTimer(): void {
  if (digestIntervalId) return;

  // Check every minute
  digestIntervalId = setInterval(() => {
    const now = Date.now();
    for (const key of Object.keys(digestBuckets)) {
      const bucket = digestBuckets[key];
      if (!bucket || bucket.items.length === 0) continue;

      const isHourly = key.endsWith(':hourly');
      const isDaily = key.endsWith(':daily');

      const hourMs = 60 * 60 * 1000;
      const dayMs = 24 * 60 * 60 * 1000;

      if (isHourly && now - bucket.lastFlushed >= hourMs) {
        flushDigestBucket(key);
      } else if (isDaily && now - bucket.lastFlushed >= dayMs) {
        flushDigestBucket(key);
      }
    }
  }, 60_000);
}

export function stopDigestTimer(): void {
  if (digestIntervalId) {
    clearInterval(digestIntervalId);
    digestIntervalId = null;
  }
}

// Notify about news for subscribed watchlist items
export function notifyNewsForSymbol(
  symbol: string,
  headline: string,
  groupId?: string
): void {
  notify({
    type: 'news',
    title: `News: ${symbol}`,
    message: headline,
    ticker: symbol,
    timestamp: Date.now(),
    groupId,
  });
}

// Email/phone simulation (in a real app, these would hit APIs)
export function simulateEmailNotification(
  emailAddress: string,
  subject: string,
  body: string
): void {
  // In production, this would call an email API
  console.log(`[Email to ${emailAddress}] ${subject}: ${body}`);
}

export function simulatePhoneNotification(
  phoneNumber: string,
  message: string
): void {
  // In production, this would call an SMS/push API
  console.log(`[SMS to ${phoneNumber}] ${message}`);
}
