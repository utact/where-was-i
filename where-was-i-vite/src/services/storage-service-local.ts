import { getStorageKey } from "./key-util";

export function saveToLocal(): void {
  const key: string = getStorageKey();
  const y: number = window.scrollY;
  chrome.storage.local.set({ [key]: y });
}
