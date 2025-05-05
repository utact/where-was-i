import { SavedSites, PageData } from "../types/sync-type";

export async function getSavedSitesAndPageData(): Promise<{
  savedSites: SavedSites;
  pageData: PageData;
}> {
  return await chrome.storage.sync.get(["savedSites", "pageData"]);
}
