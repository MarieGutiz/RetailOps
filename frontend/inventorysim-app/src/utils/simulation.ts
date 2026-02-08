import { saveToStorage } from "./storage";

export function getOrCreateSimId(shopId: string): string {
  const key = `simId:${shopId}`;
  let simId = saveToStorage.getItem(key);

  if (!simId) {
    simId = `${shopId}-${crypto.randomUUID()}`;
    saveToStorage.setItem(key, simId);
  }

  return simId;
}


export function resetSimId(shopId: string) {
  saveToStorage.removeItem(`simId:${shopId}`);
}
