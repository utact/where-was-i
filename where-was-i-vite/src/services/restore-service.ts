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
      showMiniToast("이전에 읽던 위치로 이동했어요!");
    }
  });
}

function showMiniToast(message: string) {
  const toast = document.createElement("div");

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("icons/icon48.png");
  img.alt = "icon";
  img.style.width = "18px";
  img.style.height = "18px";
  img.style.marginRight = "8px";
  img.style.verticalAlign = "middle";

  const text = document.createElement("span");
  text.innerText = message;
  text.style.verticalAlign = "middle";

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "10px 16px";
  toast.style.backgroundColor = "#333";
  toast.style.color = "#fff";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "14px";
  toast.style.zIndex = "9999";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";

  // 요소 조합
  toast.appendChild(img);
  toast.appendChild(text);
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2500);
}
