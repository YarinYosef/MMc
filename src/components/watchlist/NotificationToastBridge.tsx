'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNewsStore } from '@/stores/useNewsStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import {
  setToastCallback,
  startDigestTimer,
  stopDigestTimer,
  queueDigestNotification,
  simulateEmailNotification,
  simulatePhoneNotification,
  type NotificationPayload,
} from '@/lib/notificationEngine';

export function NotificationToastBridge() {
  const prevWatchlistItemsRef = useRef<string[]>([]);

  // Set up the toast callback on mount
  useEffect(() => {
    setToastCallback((payload: NotificationPayload) => {
      const icon = payload.type === 'news' ? '📰' : payload.type === 'price-alert' ? '💹' : '🔔';
      toast(`${icon} ${payload.title}: ${payload.message}`, {
        autoClose: 4000,
        className: 'text-xs',
      });
    });

    startDigestTimer();

    return () => {
      setToastCallback(() => {});
      stopDigestTimer();
    };
  }, []);

  // Watch for new watchlist news items and fire notifications
  const watchlistItems = useNewsStore((s) => s.items.watchlist);
  const groups = useWatchlistStore((s) => s.groups);
  const notificationPrefs = useWatchlistStore((s) => s.notificationPrefs);
  const contactInfo = useWatchlistStore((s) => s.contactInfo);

  useEffect(() => {
    if (!watchlistItems || watchlistItems.length === 0) return;

    // Compare with previous to find new items
    const currentIds = watchlistItems.map((i) => i.id);
    const prevIds = prevWatchlistItemsRef.current;
    const newIds = currentIds.filter((id) => !prevIds.includes(id));
    prevWatchlistItemsRef.current = currentIds;

    if (newIds.length === 0 || prevIds.length === 0) return;

    // For each new watchlist news item, check which groups have notifications enabled
    for (const newId of newIds) {
      const newsItem = watchlistItems.find((i) => i.id === newId);
      if (!newsItem) continue;

      // Find which groups contain subscribed items matching this news
      for (const group of groups) {
        const subscribedSymbols = group.items
          .filter((i) => i.subscribedToNews)
          .map((i) => i.symbol);

        const matchedTicker = newsItem.tickers.find((t) =>
          subscribedSymbols.includes(t)
        );

        if (!matchedTicker) continue;

        const prefs = notificationPrefs.find((p) => p.groupId === group.id);
        const frequency = prefs?.frequency ?? 'immediate';

        const payload: NotificationPayload = {
          type: 'news',
          title: `${matchedTicker} News`,
          message: newsItem.headline,
          ticker: matchedTicker,
          timestamp: Date.now(),
          groupId: group.id,
        };

        // In-app toast (respects frequency)
        if (prefs?.inApp !== false) {
          queueDigestNotification(payload, group.id, frequency);
        }

        // Email notification (simulated)
        if (prefs?.email && contactInfo.emailAddress) {
          simulateEmailNotification(
            contactInfo.emailAddress,
            `MMC Alert: ${matchedTicker} News`,
            newsItem.headline
          );
        }

        // Phone notification (simulated)
        if (prefs?.phone && contactInfo.phoneNumber) {
          simulatePhoneNotification(
            contactInfo.phoneNumber,
            `${matchedTicker}: ${newsItem.headline}`
          );
        }
      }
    }
  }, [watchlistItems, groups, notificationPrefs, contactInfo]);

  return null;
}
