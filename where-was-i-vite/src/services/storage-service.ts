import { getStorageKey } from "./key-util";

export function saveScrollPosition(): void {
  const key: string = getStorageKey();
  const y: number = window.scrollY;
  chrome.storage.sync.set({ [key]: y });
}
