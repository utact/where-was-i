import { getSavedSitesAndPageData } from "./storage-service-sync";

export async function deleteSite(urlToDelete: string): Promise<void> {
  const { savedSites = {}, pageData = {} } = await getSavedSitesAndPageData();

  delete savedSites[urlToDelete];
  delete pageData[urlToDelete];

  await chrome.storage.sync.set({
    savedSites,
    pageData,
  });
}
