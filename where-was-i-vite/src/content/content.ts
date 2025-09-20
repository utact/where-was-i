import { saveToLocal } from "@/services/local-storage";
import { removeFromLocal } from "@/services/local-delete";
import { restoreFromLocal } from "@/services/local-restore";
import { restoreFromSync } from "@/services/sync-restore";
import {
  createFloatingProgressBar,
  updateProgressBar,
} from "@/services/progress-bar";

let lastScrollTime = 0;
const throttleDelay = 80;
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

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

window.addEventListener("keydown", (event) => {
  if (event.altKey) {
    const key = event.key.toLowerCase();

    if (key === "s") {
      saveToLocal();
      event.preventDefault();
    }

    if (key === "d") {
      removeFromLocal();
      event.preventDefault();
    }
  }
});

const updateSyncStorage = async () => {
  const { savedSites } = await getSavedSitesAndPageData();
  const url = window.location.href;

  if (savedSites && savedSites[url]?.status === "active") {
    chrome.runtime.sendMessage({
      type: "UPDATE_SYNC",
      payload: {
        url: url,
        scroll: window.scrollY,
        height: document.documentElement.scrollHeight,
        viewport: window.innerHeight,
      },
    });
  }
};

window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    updateSyncStorage();
  }
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
