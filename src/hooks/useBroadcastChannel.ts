'use client';

import { useEffect, useRef } from 'react';
import { subscribeToSync, broadcastStateUpdate } from '@/lib/syncEngine';

export function useBroadcastChannel<T>(
  storeName: string,
  onReceive: (payload: T) => void
) {
  const onReceiveRef = useRef(onReceive);

  useEffect(() => {
    onReceiveRef.current = onReceive;
  });

  useEffect(() => {
    const unsubscribe = subscribeToSync(storeName, (payload) => {
      onReceiveRef.current(payload as T);
    });

    return unsubscribe;
  }, [storeName]);

  return {
    broadcast: (payload: T) => broadcastStateUpdate(storeName, payload),
  };
}
