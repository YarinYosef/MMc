'use client';

import { useCallback } from 'react';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { useNewsStore } from '@/stores/useNewsStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { broadcastStateUpdate } from '@/lib/syncEngine';

// Module-level map to track opened window references for closure detection
const windowRefs = new Map<string, Window>();

/** Check if a tracked window is still open */
export function isTrackedWindowOpen(windowId: string): boolean {
  const ref = windowRefs.get(windowId);
  return !!ref && !ref.closed;
}

/** Get all tracked window refs (used by WindowManager for monitoring) */
export function getWindowRefs(): Map<string, Window> {
  return windowRefs;
}

export function useWindowManager() {
  const { windows, openWindow, closeWindow } = useLayoutStore();

  const openDetachedWindow = useCallback(
    (type: 'news' | 'watchlist', path: string) => {
      const windowId = `detached-${type}`;

      // If window is already open, focus it
      const existingRef = windowRefs.get(windowId);
      if (existingRef && !existingRef.closed) {
        existingRef.focus();
        return;
      }

      const width = type === 'news' ? 1200 : 400;
      const height = 700;
      const left = window.screenX + window.outerWidth;
      const top = window.screenY;

      const features = `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`;
      const newWindow = window.open(path, windowId, features);

      if (newWindow) {
        windowRefs.set(windowId, newWindow);

        openWindow({
          id: windowId,
          type: `detached-${type}` as 'detached-news' | 'detached-watchlist',
          isOpen: true,
          position: { x: left, y: top },
          size: { width, height },
        });

        // Update detached flags in stores
        if (type === 'news') {
          useNewsStore.getState().setDetached(true);
          // Broadcast all existing news items so the detached window gets the full history
          const newsItems = useNewsStore.getState().items;
          setTimeout(() => {
            broadcastStateUpdate('news', { type: 'full-sync', items: newsItems });
          }, 500); // Small delay to let the detached window set up its listener
        } else if (type === 'watchlist') {
          useWatchlistStore.getState().setDetached(true);
        }

        newWindow.addEventListener('beforeunload', () => {
          closeWindow(windowId);
          windowRefs.delete(windowId);

          if (type === 'news') {
            useNewsStore.getState().setDetached(false);
          } else if (type === 'watchlist') {
            useWatchlistStore.getState().setDetached(false);
          }
        });
      }
    },
    [openWindow, closeWindow]
  );

  const isWindowOpen = useCallback(
    (type: string) => windows.some((w) => w.type === type && w.isOpen),
    [windows]
  );

  return {
    windows,
    openDetachedWindow,
    isWindowOpen,
    closeWindow,
  };
}
