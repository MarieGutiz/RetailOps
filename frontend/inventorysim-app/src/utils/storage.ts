/**
 * In case local storage is not available via browser
 */
import { isLocalStorageAvailable } from "./auth";

const storageAvailable = isLocalStorageAvailable();

export const saveToStorage =  {
    setItem: (key: string, value: string) => {
        if (storageAvailable) {
            localStorage.setItem(key, value);
        }else{
            console.warn("LocalStorage not available. Cannot set item.");
            // Fallback logic (e.g., use in-memory storage)
           (window as any)._inMemoryStorage = (window as any)._inMemoryStorage || {};
           (window as any)._inMemoryStorage[key] = value;
        }
    },
    getItem: (key: string): string | null => {
        if (storageAvailable) {
            return localStorage.getItem(key);
        }else{
            console.warn("LocalStorage not available. Cannot get item.");
            // Fallback logic (e.g., use in-memory storage)
           return (window as any)._inMemoryStorage ? (window as any)._inMemoryStorage[key] : null;
        }
    },
    removeItem: (key: string) => {
        if (storageAvailable) { 
            localStorage.removeItem(key);
        }else{
            console.warn("LocalStorage not available. Cannot remove item.");
            // Fallback logic (e.g., use in-memory storage)
           delete (window as any)._inMemoryStorage[key];
        }
     },
     
    // Helper to get username directly
    getUsername: (): string | null => {
        const user = saveToStorage.getUser();
        return user?.username || null;
    },
     //  Helper to get user data safely
    getUser: (): any | null => {
        const userStr = saveToStorage.getItem("user");
        if (!userStr) return null;
        try {
        return JSON.parse(userStr);
        } catch (err) {
        console.error("Failed to parse user from storage", err);
        return null;
        }
    },

    
    }