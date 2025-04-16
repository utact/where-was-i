let scrollTimeout;

function getStorageKey() {
  return `scroll-data-${location.href}`;
}

function saveScrollPosition() {
  const key = getStorageKey();
  const y = window.scrollY;
  chrome.storage.sync.set({ [key]: y });
}

window.addEventListener("scroll", () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    saveScrollPosition();
  }, 3000);
});
