import { getSavedSitesAndPageData } from "./storage-service-sync";

export async function deleteSite(urlToDelete: string): Promise<void> {
  const { savedSites = [], pageData: pageData = {} } =
    await getSavedSitesAndPageData();

  const filteredSites = savedSites.filter((site) => site.url !== urlToDelete);
  delete pageData[urlToDelete];

  await chrome.storage.sync.set({
    savedSites: filteredSites,
    pageData: pageData,
  });
}
