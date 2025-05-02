import { saveScrollPosition } from "../services/storage-service.ts";
import { restoreScrollPosition } from "../services/restore-service.ts";
import {
  createFloatingProgressBar,
  updateProgressBar,
} from "../services/progress-bar-service.ts";

let lastScrollTime = 0;
const throttleDelay = 100;
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

window.addEventListener("load", () => {
  restoreScrollPosition();
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

window.addEventListener("beforeunload", () => {
  saveScrollPosition();
});
