import { getStorageKey } from "./key-util";

interface ScrollPositionResult {
  [key: string]: number | undefined;
}

export function restoreScrollPosition(): void {
  const key: string = getStorageKey();
  chrome.storage.sync.get([key], (result: ScrollPositionResult) => {
    const savedY = result[key];
    if (savedY !== undefined) {
      window.scrollTo({ top: savedY, behavior: "smooth" });
    }
  });
}
