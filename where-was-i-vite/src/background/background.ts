chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "UPDATE_SYNC") {
    // 비동기 로직을 처리하기 위해 즉시 실행 함수(IIFE) 사용
    (async () => {
      try {
        const { url, scroll, height, viewport } = msg.payload;

        const { savedSites = {}, pageData = {} } =
          await chrome.storage.sync.get(["savedSites", "pageData"]);

        // WWI Tracker에 의해 추적되는 사이트가 아니면 업데이트하지 않음
        if (!savedSites[url]) {
          return;
        }

        // 진행률 계산 및 상태 결정
        // 스크롤이 없는 페이지(height <= viewport)의 엣지 케이스 처리
        const progress =
          height > viewport ? Math.min(scroll / (height - viewport), 1) : 1;
        // '모두 읽음'의 기준을 95%로 상향
        const status = progress >= 0.95 ? "pendingDelete" : "active";
        const lastAccessed = Date.now();

        savedSites[url] = {
          ...savedSites[url],
          lastAccessed,
          status,
        };
        pageData[url] = { scroll, height, viewport };

        await chrome.storage.sync.set({ savedSites, pageData });
      } catch (e) {
        console.error("WWI: sync 스토리지 업데이트 중 오류 발생.", e);
      }
    })();
    // 메시지 채널을 비동기 응답을 위해 열어둠
    return true;
  }
});
