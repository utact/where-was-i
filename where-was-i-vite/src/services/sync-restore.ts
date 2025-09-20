import { showMiniToast } from "@/utils/mini-toast";

export async function restoreFromSync(): Promise<void> {
  const url = location.href;
  const { pageData = {} } = await chrome.storage.sync.get("pageData");
  const scrollData = pageData[url];

  if (scrollData && typeof scrollData.scroll === "number") {
    window.scrollTo({ top: scrollData.scroll, behavior: "smooth" });
    showMiniToast("마지막 위치로 복원되었습니다.");
  }
}
