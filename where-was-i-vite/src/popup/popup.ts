import {
  saveSiteInfoToStorage,
  getSavedSitesAndScrollData,
} from "../services/url-storage-service";
import { SavedSite, ScrollData } from "../services/types";
import { deleteSite } from "../services/delete-service";

async function loadSavedSites() {
  const {
    savedSites = [],
    scrollData = {},
  }: { savedSites: SavedSite[]; scrollData: ScrollData } =
    await getSavedSitesAndScrollData();

  const siteList = document.getElementById("siteList");
  if (!siteList) return;

  siteList.innerHTML = "";

  savedSites.forEach((site) => {
    const scrollInfo = scrollData[site.url] || { scroll: 0, height: 1 };
    const progress = Math.min(scrollInfo.scroll / scrollInfo.height, 1);

    const entry = document.createElement("div");
    entry.className = "site-entry";

    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";

    const link = document.createElement("a");
    link.href = site.url;
    link.className = "site-link";
    link.innerText = site.title;
    link.target = "_blank";
    link.title = site.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "✕";
    deleteBtn.className = "delete-button";
    deleteBtn.onclick = async () => {
      await deleteSite(site.url);
      await loadSavedSites();
    };

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    const filled = document.createElement("div");
    filled.className = "progress-filled";
    filled.style.width = `${progress * 100}%`;

    titleContainer.appendChild(link);
    titleContainer.appendChild(deleteBtn);
    entry.appendChild(titleContainer);
    progressBar.appendChild(filled);
    entry.appendChild(progressBar);
    siteList.appendChild(entry);
  });
}

async function saveCurrentSite() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id || !tab.url || !tab.url.startsWith("http")) return;

  const [{ result }] = await chrome.scripting.executeScript<
    [],
    { title: string; url: string; scroll: number; height: number }
  >({
    target: { tabId: tab.id },
    func: () => {
      return {
        title: document.title,
        url: window.location.href,
        scroll: window.scrollY,
        height: document.documentElement.scrollHeight,
      };
    },
  });

  if (!result) return; // undefined

  const { title, url, scroll, height } = result;
  await saveSiteInfoToStorage(title, url, scroll, height);
  await loadSavedSites();
}

document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("saveButton");
  if (saveButton) {
    saveButton.addEventListener("click", saveCurrentSite);
  }

  loadSavedSites();
});
