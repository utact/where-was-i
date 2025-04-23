import { saveScrollPosition } from "../services/storage-service.ts";
import { restoreScrollPosition } from "../services/restore-service.ts";
import {
  createFloatingProgressBar,
  updateProgressBar,
} from "../services/progress-bar-service.ts";

let scrollTimeout: number | undefined;

window.addEventListener("load", () => {
  restoreScrollPosition();
  createFloatingProgressBar();
  updateProgressBar();
});

window.addEventListener("scroll", () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);

  scrollTimeout = window.setTimeout(() => {
    saveScrollPosition();
  }, 3000);

  updateProgressBar();
});
