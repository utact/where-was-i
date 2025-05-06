import { getStorageKey } from "../utils/local-util";
import { showMiniToast } from "../utils/mini-toast";

export function saveToLocal(): void {
  const key: string = getStorageKey();
  const y: number = window.scrollY;
  chrome.storage.local.set({ [key]: y });
  showMiniToast("[L] 현재 위치를 기억합니다.");
}
