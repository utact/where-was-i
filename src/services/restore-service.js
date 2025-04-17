import { getStorageKey } from "./key-util.js";

export function restoreScrollPosition() {
  const key = getStorageKey();
  chrome.storage.sync.get([key], (result) => {
    const savedY = result[key];
    if (savedY !== undefined) {
      window.scrollTo({ top: savedY, behavior: "smooth" });
    }
  });
}
