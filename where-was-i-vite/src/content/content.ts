import { saveToLocal } from "../services/storage-service-local.ts";
import { restoreFromLocal } from "../services/restore-service.ts";
import {
  createFloatingProgressBar,
  updateProgressBar,
} from "../services/progress-bar-service.ts";
import { showMiniToast } from "../services/mini-toast.ts";

let lastScrollTime = 0;
const throttleDelay = 100;
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

// TODO: 분기 후 로직 분리
window.addEventListener("load", () => {
  restoreFromLocal();
  createFloatingProgressBar();
  updateProgressBar();
});

window.addEventListener("scroll", () => {
  const currentTime = Date.now();

  if (currentTime - lastScrollTime > throttleDelay) {
    lastScrollTime = currentTime;
    updateProgressBar();
  }

  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    updateProgressBar();
  }, 500);
});

window.addEventListener("keydown", (event) => {
  if (event.altKey && event.key.toLowerCase() === "s") {
    saveToLocal();
    event.preventDefault();
    showMiniToast("현재 위치를 기억합니다.");
  }
});
