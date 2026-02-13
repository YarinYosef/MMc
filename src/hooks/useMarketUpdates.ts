'use client';

import { useEffect } from 'react';
import { useMarketStore } from '@/stores/useMarketStore';
import { useCompassStore } from '@/stores/useCompassStore';
import { useNewsStore } from '@/stores/useNewsStore';

export function useMarketUpdates() {
  const startEngine = useMarketStore((s) => s.startEngine);
  const stopEngine = useMarketStore((s) => s.stopEngine);
  const startCompass = useCompassStore((s) => s.startUpdates);
  const stopCompass = useCompassStore((s) => s.stopUpdates);
  const startNews = useNewsStore((s) => s.startNewsFeed);
  const stopNews = useNewsStore((s) => s.stopNewsFeed);

  useEffect(() => {
    startEngine();
    startCompass();
    startNews();

    return () => {
      stopEngine();
      stopCompass();
      stopNews();
    };
  }, [startEngine, stopEngine, startCompass, stopCompass, startNews, stopNews]);
}
