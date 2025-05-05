import { saveToLocal } from "../services/local-storage.ts";
import { restoreFromLocal } from "../services/local-restore.ts";
import { updateSync } from "../services/sync-storage.ts"; // import error
import { restoreFromSync } from "../services/sync-restore.ts";

import {
  createFloatingProgressBar,
  updateProgressBar,
} from "../services/progress-bar.ts";

import { getSavedSitesAndPageData } from "../utils/sync-util.ts"; // import error

let lastScrollTime = 0;
const throttleDelay = 100;
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

// restore
window.addEventListener("load", async () => {
  const { savedSites } = await getSavedSitesAndPageData();
  const url = location.href;

  if (savedSites && savedSites[url]?.status === "active") {
    restoreFromSync();
  } else {
    restoreFromLocal();
  }

  createFloatingProgressBar();
  updateProgressBar();
});

// progress bar
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

// local manual save
window.addEventListener("keydown", (event) => {
  if (event.altKey && event.key.toLowerCase() === "s") {
    saveToLocal();
    event.preventDefault();
  }
});

// sync auto save: not work!
window.addEventListener("beforeunload", async () => {
  const url = location.href;
  updateSync(url);
});
