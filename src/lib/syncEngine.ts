// BroadcastChannel-based cross-window state synchronization

type SyncMessage = {
  type: 'state-update';
  store: string;
  payload: unknown;
  senderId: string;
};

const CHANNEL_NAME = 'mmc-dashboard-sync';
const SENDER_ID = typeof window !== 'undefined' ? `${Date.now()}-${Math.random().toString(36).slice(2)}` : '';

let channel: BroadcastChannel | null = null;
const listeners = new Map<string, Set<(payload: unknown) => void>>();

function getChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined') return null;
  if (!channel) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event: MessageEvent<SyncMessage>) => {
        const { type, store, payload, senderId } = event.data;
        if (type === 'state-update' && senderId !== SENDER_ID) {
          const storeListeners = listeners.get(store);
          if (storeListeners) {
            for (const listener of storeListeners) {
              listener(payload);
            }
          }
        }
      };
    } catch {
      // BroadcastChannel not supported
      return null;
    }
  }
  return channel;
}

export function broadcastStateUpdate(store: string, payload: unknown): void {
  const ch = getChannel();
  if (ch) {
    const message: SyncMessage = {
      type: 'state-update',
      store,
      payload,
      senderId: SENDER_ID,
    };
    ch.postMessage(message);
  }
}

export function subscribeToSync(store: string, listener: (payload: unknown) => void): () => void {
  getChannel(); // ensure channel is initialized

  if (!listeners.has(store)) {
    listeners.set(store, new Set());
  }
  listeners.get(store)!.add(listener);

  return () => {
    listeners.get(store)?.delete(listener);
  };
}

export function closeSyncChannel(): void {
  if (channel) {
    channel.close();
    channel = null;
  }
  listeners.clear();
}
