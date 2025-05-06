import { getStorageKey } from "../utils/local-util";
import { showMiniToast } from "../utils/mini-toast";

interface ScrollPositionResult {
  [key: string]: number | undefined;
}

export function restoreFromLocal(): void {
  const key: string = getStorageKey();
  chrome.storage.local.get([key], (result: ScrollPositionResult) => {
    const savedY = result[key];
    if (savedY !== undefined) {
      window.scrollTo({ top: savedY, behavior: "smooth" });
      showMiniToast("[L] 이전에 읽던 위치로 이동했어요!");
    }
  });
}
