import { SavedSites, PageData } from "../types/sync-type";

export async function saveToSync(
  title: string,
  url: string,
  scroll: number,
  height: number,
  viewport: number
): Promise<void> {
  const lastAccessed = Date.now();
  const progress = Math.min(scroll / (height - viewport), 1);
  const status = progress >= 0.9 ? "pendingDelete" : "active";

  const {
    savedSites = {},
    pageData = {},
  }: { savedSites?: SavedSites; pageData?: PageData } =
    await chrome.storage.sync.get(["savedSites", "pageData"]);

  savedSites[url] = { title, lastAccessed, status };
  pageData[url] = { scroll, height, viewport };

  await chrome.storage.sync.set({ savedSites, pageData });
}

export function updateSync(url: string): void {
  const scroll = window.scrollY;
  const height = document.body.scrollHeight;
  const viewport = window.innerHeight;
  const lastAccessed = Date.now();
  const progress = Math.min(scroll / (height - viewport), 1);
  const status = progress >= 0.9 ? "pendingDelete" : "active";

  chrome.storage.sync.get(["savedSites", "pageData"], (result) => {
    const savedSites: SavedSites = result.savedSites || {};
    const pageData: PageData = result.pageData || {};

    if (!savedSites[url]) return;

    savedSites[url] = {
      ...savedSites[url],
      lastAccessed,
      status,
    };
    pageData[url] = { scroll, height, viewport };

    chrome.storage.sync.set({ savedSites, pageData });
  });
}
