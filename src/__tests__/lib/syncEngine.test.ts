import { broadcastStateUpdate, subscribeToSync, closeSyncChannel } from '@/lib/syncEngine';

afterEach(() => {
  closeSyncChannel();
});

describe('syncEngine', () => {
  it('subscribes to a store and returns unsubscribe function', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToSync('testStore', listener);
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });

  it('broadcastStateUpdate does not throw', () => {
    expect(() => broadcastStateUpdate('testStore', { data: 'test' })).not.toThrow();
  });

  it('closeSyncChannel does not throw', () => {
    subscribeToSync('test', jest.fn());
    expect(() => closeSyncChannel()).not.toThrow();
  });
});
