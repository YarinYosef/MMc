'use client';

import { useCallback } from 'react';
import { useWindowManager } from './useWindowManager';

export function useDetachable(type: 'news' | 'watchlist') {
  const { openDetachedWindow, isWindowOpen, closeWindow } = useWindowManager();

  const path = `/detached/${type}`;
  const windowId = `detached-${type}`;
  const detached = isWindowOpen(`detached-${type}`);

  const detach = useCallback(() => {
    if (!detached) {
      openDetachedWindow(type, path);
    }
  }, [detached, type, path, openDetachedWindow]);

  const reattach = useCallback(() => {
    if (detached) {
      closeWindow(windowId);
    }
  }, [detached, windowId, closeWindow]);

  return { detached, detach, reattach };
}
