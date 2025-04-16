import { saveScrollPosition } from "../services/storage-service.js";

let scrollTimeout;

window.addEventListener("scroll", () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    saveScrollPosition();
  }, 3000);
});
