function getStorageKey() {
  return `scroll-data-${location.href}`;
}

export function saveScrollPosition() {
  const key = getStorageKey();
  const y = window.scrollY;
  chrome.storage.sync.set({ [key]: y });
}
