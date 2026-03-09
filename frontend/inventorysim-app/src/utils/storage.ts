/**
 * In case local storage is not available via browser
 */
import { isLocalStorageAvailable } from './auth';

const inMemoryStore: Record<string, string> = {};
const storageAvailable = isLocalStorageAvailable();

export const saveToStorage = {
  setItem: (key: string, value: string) => {
    if (storageAvailable) {
      localStorage.setItem(key, value);
    } else {
      console.warn('LocalStorage not available. Cannot set item.');
      // Fallback logic (e.g., use in-memory storage)
      inMemoryStore[key] = value;
    }
  },
  getItem: (key: string): string | null => {
    if (storageAvailable) {
      return localStorage.getItem(key);
    } else {
      console.warn('LocalStorage not available. Cannot get item.');
      // Fallback logic (e.g., use in-memory storage)
      return inMemoryStore[key] ?? null;
    }
  },
  removeItem: (key: string) => {
    if (storageAvailable) {
      localStorage.removeItem(key);
    } else {
      console.warn('LocalStorage not available. Cannot remove item.');
      // Fallback logic (e.g., use in-memory storage)
      delete inMemoryStore[key];
    }
  },

  /** Save a full user object safely */
  setUser: (user: any) => {
    try {
      saveToStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  },
  /** Restore full user object */
  getUser(): any | null {
    try {
      const raw = this.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error('Failed to parse user:', err);
      return null;
    }
  },

  // Helper to get username directly
  getUsername: (): string | null => {
    const user = saveToStorage.getUser();
    return user?.username || null;
  },

  /** Remove both user + token */
  clearUser() {
    this.removeItem('user');
    this.removeItem('token');
  },
};
