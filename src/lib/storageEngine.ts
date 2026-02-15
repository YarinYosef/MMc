const STORAGE_PREFIX = 'mmc-dashboard:';

export function saveToStorage<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized);
  } catch (error) {
    console.warn(`Failed to save to localStorage: ${key}`, error);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const serialized = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!serialized) return null;
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.warn(`Failed to load from localStorage: ${key}`, error);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.warn(`Failed to remove from localStorage: ${key}`, error);
  }
}

export function clearAllStorage(): void {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_PREFIX));
    for (const key of keys) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('Failed to clear localStorage', error);
  }
}

// Export/import full state as JSON file
export function exportState(): string {
  const state: Record<string, unknown> = {};
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_PREFIX));
    for (const key of keys) {
      const cleanKey = key.replace(STORAGE_PREFIX, '');
      const value = localStorage.getItem(key);
      if (value) {
        state[cleanKey] = JSON.parse(value);
      }
    }
  } catch (error) {
    console.warn('Failed to export state', error);
  }
  return JSON.stringify(state, null, 2);
}

export function importState(json: string): void {
  try {
    const state = JSON.parse(json) as Record<string, unknown>;
    for (const [key, value] of Object.entries(state)) {
      saveToStorage(key, value);
    }
  } catch (error) {
    console.warn('Failed to import state', error);
  }
}
