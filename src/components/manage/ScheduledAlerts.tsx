'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type AlertEntry } from '@/data/types/layout';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { loadFromStorage, saveToStorage } from '@/lib/storageEngine';
import { notify } from '@/lib/notificationEngine';

const STORAGE_KEY = 'managing-alerts';

type AlertCondition = AlertEntry['condition'];

const CONDITION_LABELS: Record<AlertCondition, string> = {
  'price-above': 'Price Above',
  'price-below': 'Price Below',
  'volume-spike': 'Volume Spike %',
  'percent-change': 'Change %',
};

export function ScheduledAlerts() {
  const [alerts, setAlerts] = useState<AlertEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    return loadFromStorage<AlertEntry[]>(STORAGE_KEY) ?? [];
  });
  const [ticker, setTicker] = useState('');
  const [condition, setCondition] = useState<AlertCondition>('price-above');
  const [value, setValue] = useState('');
  const selectedSymbol = useDetailsStore((s) => s.selectedSymbol);
  const tickers = useMarketStore((s) => s.tickers);
  const alertsRef = useRef(alerts);

  useEffect(() => {
    alertsRef.current = alerts;
  });

  // Check alerts against live data
  useEffect(() => {
    if (tickers.size === 0) return;
    const currentAlerts = alertsRef.current;

    let triggered = false;
    const updated = currentAlerts.map((alert) => {
      if (!alert.isActive || alert.triggeredAt) return alert;
      const t = tickers.get(alert.ticker);
      if (!t) return alert;

      let fire = false;
      if (alert.condition === 'price-above' && t.price >= alert.value) fire = true;
      if (alert.condition === 'price-below' && t.price <= alert.value) fire = true;
      if (alert.condition === 'volume-spike' && t.volume > t.avgVolume * (1 + alert.value / 100)) fire = true;
      if (alert.condition === 'percent-change' && Math.abs(t.changePercent) >= alert.value) fire = true;

      if (fire) {
        triggered = true;
        notify({
          type: 'price-alert',
          title: `Alert: ${alert.ticker}`,
          message: `${CONDITION_LABELS[alert.condition]} ${alert.value} triggered`,
          ticker: alert.ticker,
          timestamp: Date.now(),
        });
        return { ...alert, triggeredAt: Date.now(), isActive: false };
      }
      return alert;
    });

    if (triggered) {
      setAlerts(updated);
      saveToStorage(STORAGE_KEY, updated);
    }
  }, [tickers]);

  const persist = useCallback((updated: AlertEntry[]) => {
    setAlerts(updated);
    saveToStorage(STORAGE_KEY, updated);
  }, []);

  const addAlert = () => {
    const sym = ticker.trim().toUpperCase() || selectedSymbol;
    if (!sym || !value.trim()) return;

    const entry: AlertEntry = {
      id: uuidv4(),
      ticker: sym,
      condition,
      value: parseFloat(value),
      isActive: true,
      createdAt: Date.now(),
    };
    persist([entry, ...alerts]);
    setTicker('');
    setValue('');
  };

  const toggleAlert = (id: string) => {
    persist(alerts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive, triggeredAt: undefined } : a)));
  };

  const deleteAlert = (id: string) => {
    persist(alerts.filter((a) => a.id !== id));
  };

  const activeCount = alerts.filter((a) => a.isActive).length;

  return (
    <div className="flex flex-col h-full">
      {/* Add form */}
      <div className="space-y-2 mb-3">
        <div className="flex gap-1.5">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder={selectedSymbol || 'Ticker...'}
            className="w-20 bg-white/[0.06] border border-black rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#AB9FF2] uppercase"
          />
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as AlertCondition)}
            className="flex-1 bg-white/[0.06] border border-black rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#AB9FF2]"
          >
            {Object.entries(CONDITION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
            className="w-20 bg-white/[0.06] border border-black rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#AB9FF2]"
          />
          <button
            onClick={addAlert}
            disabled={!value.trim()}
            className="px-2.5 py-1.5 text-[10px] rounded bg-[#AB9FF2] text-white hover:brightness-110 disabled:opacity-40"
          >
            Set
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-[#999999]">
          {activeCount} active / {alerts.length} total
        </span>
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {alerts.length === 0 && (
          <div className="text-center text-[#999999] text-[10px] py-6">
            No alerts set. Create one above.
          </div>
        )}
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-center gap-2 px-2 py-1.5 rounded ${
              alert.triggeredAt
                ? 'bg-[#CD8554]/10 border border-[#CD8554]/20'
                : alert.isActive
                ? 'bg-white/[0.03]'
                : 'bg-white/[0.02] opacity-50'
            }`}
          >
            <button
              onClick={() => toggleAlert(alert.id)}
              className={`w-3 h-3 rounded-full flex-shrink-0 border ${
                alert.isActive
                  ? 'bg-[#2EC08B] border-[#2EC08B]'
                  : 'border-[#777777]'
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white">{alert.ticker}</span>
                <span className="text-[10px] text-[#999999]">
                  {CONDITION_LABELS[alert.condition]}
                </span>
                <span className="text-[10px] text-[#AB9FF2] font-medium">{alert.value}</span>
              </div>
              {alert.triggeredAt && (
                <span className="text-[10px] text-[#CD8554]">
                  Triggered {new Date(alert.triggeredAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <button
              onClick={() => deleteAlert(alert.id)}
              className="text-[10px] text-[#777777] hover:text-[#FF7243] flex-shrink-0"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
