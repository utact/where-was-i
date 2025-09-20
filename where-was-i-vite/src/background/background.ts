const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;
const CLEANUP_ALARM_NAME = "wwi-cleanup-alarm";

/**
 * 'pendingDelete' 상태이고 24시간이 지난 항목들을 정리합니다.
 */
async function cleanupPendingDeleteSites() {
  try {
    const { savedSites = {}, pageData = {} } = await chrome.storage.sync.get([
      "savedSites",
      "pageData",
    ]);

    const urlsToDelete: string[] = [];
    const now = Date.now();

    for (const url in savedSites) {
      const site = savedSites[url];
      // 'pendingDelete' 상태이고, 마지막 접근 시간으로부터 24시간이 지났는지 확인
      if (
        site.status === "pendingDelete" &&
        now - site.lastAccessed > TWENTY_FOUR_HOURS_IN_MS
      ) {
        urlsToDelete.push(url);
      }
    }

    if (urlsToDelete.length > 0) {
      for (const url of urlsToDelete) {
        delete savedSites[url];
        delete pageData[url];
      }
      await chrome.storage.sync.set({ savedSites, pageData });
      console.log(
        `WWI: Cleaned up ${urlsToDelete.length} pending-delete sites.`
      );
    }
  } catch (e) {
    console.error("WWI: Error during cleanup of pending-delete sites.", e);
  }
}

// 1. 익스텐션이 설치/업데이트될 때 주기적인 알람을 설정합니다.
chrome.runtime.onInstalled.addListener(() => {
  // 1시간마다 'cleanup' 알람이 울리도록 설정
  chrome.alarms.create(CLEANUP_ALARM_NAME, { periodInMinutes: 60 });
  // 설치 직후 한 번 즉시 실행하여 오래된 항목을 정리
  cleanupPendingDeleteSites();
});

// 2. 설정된 알람이 울릴 때마다 정리 함수를 실행합니다.
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === CLEANUP_ALARM_NAME) {
    await cleanupPendingDeleteSites();
  }
});

// 3. 기존 메시지 리스너는 그대로 유지합니다.
chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
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
