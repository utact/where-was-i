import { SavedSite, PageData } from "./types";

export async function saveSiteInfoToStorage(
  title: string,
  url: string,
  scroll: number,
  height: number,
  viewport: number
): Promise<void> {
  const lastAccessed = Date.now();
  const progress = Math.min(scroll / (height - viewport), 1);

  const {
    savedSites = [],
    pageData = {},
  }: { savedSites?: SavedSite[]; pageData?: PageData } =
    await chrome.storage.sync.get(["savedSites", "pageData"]);

  const existingIndex = savedSites.findIndex((site) => site.url === url);
  const status = progress >= 0.9 ? "pendingDelete" : "active";

  if (existingIndex !== -1) {
    savedSites[existingIndex].lastAccessed = lastAccessed;
    savedSites[existingIndex].title = title;
    savedSites[existingIndex].status = status;
  } else if (existingIndex == -1) {
    savedSites.push({ title, url, lastAccessed });
  }

  pageData[url] = { scroll, height, viewport };

  await chrome.storage.sync.set({ savedSites, pageData: pageData });
}

export async function getSavedSitesAndPageData(): Promise<{
  savedSites: SavedSite[];
  pageData: PageData;
}> {
  return await chrome.storage.sync.get(["savedSites", "pageData"]);
}
