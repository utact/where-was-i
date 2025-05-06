import { showMiniToast } from "@/utils/mini-toast";

export async function restoreFromSync(): Promise<void> {
  const url = location.href;
  const { pageData = {} } = await chrome.storage.sync.get("pageData");
  const scrollData = pageData[url];

  if (scrollData && typeof scrollData.scroll === "number") {
    window.scrollTo({ top: scrollData.scroll, behavior: "smooth" });
    showMiniToast("[S] 이전에 읽던 위치로 이동했어요!");
  }
}
