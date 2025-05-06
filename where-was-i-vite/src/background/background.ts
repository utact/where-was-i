chrome.runtime.onMessage.addListener((msg, _sender) => {
  if (msg.type === "UPDATE_SYNC") {
    const { url, scroll, height, viewport } = msg.payload;

    chrome.storage.sync.get(["savedSites", "pageData"], (result) => {
      const savedSites = result.savedSites || {};

      if (!savedSites[url]) {
        return;
      }

      const pageData = result.pageData || {};

      const progress = Math.min(scroll / (height - viewport), 1);
      const status = progress >= 0.9 ? "pendingDelete" : "active";
      const lastAccessed = Date.now();

      savedSites[url] = {
        ...savedSites[url],
        lastAccessed,
        status,
      };
      pageData[url] = { scroll, height, viewport };

      chrome.storage.sync.set({ savedSites, pageData });
    });
  }
});
