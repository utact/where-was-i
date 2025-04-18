import { saveScrollPosition } from "../services/storage-service.ts";
import { restoreScrollPosition } from "../services/restore-service.ts";

let scrollTimeout: number | undefined;

window.addEventListener("scroll", () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    saveScrollPosition();
  }, 3000);
});

window.addEventListener("load", () => {
  restoreScrollPosition();
});
