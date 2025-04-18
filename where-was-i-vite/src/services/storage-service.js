import { getStorageKey } from "./key-util.js";

export function saveScrollPosition() {
  const key = getStorageKey();
  const y = window.scrollY;
  chrome.storage.sync.set({ [key]: y });
}
