import { getStorageKey } from "@/utils/local-util";
import { showMiniToast } from "@/utils/mini-toast";

export function removeFromLocal(): void {
  const key: string = getStorageKey();
  chrome.storage.local.remove(key);
  showMiniToast("[L] 저장된 위치를 삭제했습니다.");
}
