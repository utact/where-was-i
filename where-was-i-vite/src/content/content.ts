import { saveToLocal } from "@/services/local-storage";
import { restoreFromLocal } from "@/services/local-restore";
import { restoreFromSync } from "@/services/sync-restore";
import {
  createFloatingProgressBar,
  updateProgressBar,
} from "@/services/progress-bar";

let lastScrollTime = 0;
const throttleDelay = 80;
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
  }, 250);
});

// local manual save
window.addEventListener("keydown", (event) => {
  if (event.altKey && event.key.toLowerCase() === "s") {
    saveToLocal();
    event.preventDefault();
  }
});

// sync auto save
window.addEventListener("beforeunload", () => {
  chrome.runtime.sendMessage({
    type: "UPDATE_SYNC",
    payload: {
      url: window.location.href,
      scroll: window.scrollY,
      height: document.documentElement.scrollHeight,
      viewport: window.innerHeight,
    },
  });
});

/*
Temporary solution due to import syntax error with `getSavedSitesAndPageData`
Will refactor and resolve the import issues later
 */
import { SavedSites, PageData } from "../types/sync-type";

export async function getSavedSitesAndPageData(): Promise<{
  savedSites: SavedSites;
  pageData: PageData;
}> {
  return await chrome.storage.sync.get(["savedSites", "pageData"]);
}
