import { SavedSite, ScrollData } from "./types";

export async function saveSiteInfoToStorage(
  title: string,
  url: string,
  scroll: number,
  height: number
): Promise<void> {
  const lastAccessed = Date.now();

  const {
    savedSites = [],
    scrollData = {},
  }: { savedSites?: SavedSite[]; scrollData?: ScrollData } =
    await chrome.storage.local.get(["savedSites", "scrollData"]);

  const existingIndex = savedSites.findIndex((site) => site.url === url);
  if (existingIndex !== -1) {
    savedSites[existingIndex].lastAccessed = lastAccessed;
    savedSites[existingIndex].title = title;
  } else {
    savedSites.push({ title, url, lastAccessed });
  }

  scrollData[url] = { scroll, height };

  await chrome.storage.local.set({ savedSites, scrollData });
}

export async function getSavedSitesAndScrollData(): Promise<{
  savedSites: SavedSite[];
  scrollData: ScrollData;
}> {
  return await chrome.storage.local.get(["savedSites", "scrollData"]);
}
