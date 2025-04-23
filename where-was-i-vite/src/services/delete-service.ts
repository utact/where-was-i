import { getSavedSitesAndScrollData } from "../services/url-storage-service";

export async function deleteSite(urlToDelete: string): Promise<void> {
  const { savedSites = [], scrollData = {} } =
    await getSavedSitesAndScrollData();

  const filteredSites = savedSites.filter((site) => site.url !== urlToDelete);
  delete scrollData[urlToDelete];

  await chrome.storage.sync.set({
    savedSites: filteredSites,
    scrollData,
  });
}
