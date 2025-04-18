<<<<<<<< HEAD:where-was-i-vite/src/content/content.js
import { saveScrollPosition } from "../services/storage-service.ts";
import { restoreScrollPosition } from "../services/restore-service.ts";
========
import { saveScrollPosition } from "../services/storage-service";
import { restoreScrollPosition } from "../services/restore-service";
>>>>>>>> 03cb8f8 (feat: convert content.js to TypeScript, handle number and undefined types):where-was-i-vite/src/content/content.ts

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
