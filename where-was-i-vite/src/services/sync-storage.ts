import { SavedSites, PageData } from "../types/sync-type";
import { showMiniToast } from "@/utils/mini-toast";

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
  showMiniToast("[S] 현재 위치를 기억합니다.");
}
