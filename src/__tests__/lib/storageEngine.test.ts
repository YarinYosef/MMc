import { saveToStorage, loadFromStorage, removeFromStorage } from '@/lib/storageEngine';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((i: number) => Object.keys(store)[i] ?? null),
    // For Object.keys() to work
    ...(() => {
      const obj: Record<string, string> = {};
      return obj;
    })(),
  };
})();

// We need to handle Object.keys(localStorage) calls
Object.defineProperty(window, 'localStorage', {
  value: new Proxy(localStorageMock, {
    ownKeys: () => {
      // Return all keys stored
      return Reflect.ownKeys(localStorageMock).filter(k => typeof k === 'string' && !['getItem', 'setItem', 'removeItem', 'clear', 'length', 'key'].includes(k as string));
    },
  }),
});

beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
});

describe('storageEngine', () => {
  describe('saveToStorage / loadFromStorage', () => {
    it('saves and loads string data', () => {
      saveToStorage('test', 'hello');
      const result = loadFromStorage<string>('test');
      expect(result).toBe('hello');
    });

    it('saves and loads object data', () => {
      const data = { name: 'test', values: [1, 2, 3] };
      saveToStorage('obj', data);
      const result = loadFromStorage<typeof data>('obj');
      expect(result).toEqual(data);
    });

    it('returns null for missing key', () => {
      const result = loadFromStorage('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('removeFromStorage', () => {
    it('removes an item', () => {
      saveToStorage('toRemove', 'value');
      removeFromStorage('toRemove');
      expect(loadFromStorage('toRemove')).toBeNull();
    });
  });
});
