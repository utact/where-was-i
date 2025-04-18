import { saveScrollPosition } from "../services/storage-service";
import { restoreScrollPosition } from "../services/restore-service";

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
