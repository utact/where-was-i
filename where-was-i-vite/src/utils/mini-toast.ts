export function showMiniToast(message: string) {
  const NOTIFICATION_SHOWN_KEY = "wwi-notification-shown";

  // Only show the toast once per session to avoid duplication on restores.
  if (sessionStorage.getItem(NOTIFICATION_SHOWN_KEY)) {
    return;
  }
  sessionStorage.setItem(NOTIFICATION_SHOWN_KEY, "true");

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

  toast.appendChild(img);
  toast.appendChild(text);
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2500);
}
