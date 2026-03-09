//Check if localstorag is available
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('LocalStorage not available:', e);
    return false;
  }
};

// Validate JWT token expiration
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    return payload.exp > now;
  } catch (error) {
    console.error('Invalid token', error);
    return false;
  }
};
