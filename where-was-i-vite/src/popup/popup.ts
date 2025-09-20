import { saveToSync } from "@/services/sync-storage";
import { deleteSite } from "@/services/sync-delete";

import { getSavedSitesAndPageData } from "@/utils/sync-util";
import { calculateRetention, getTextColor } from "@/utils/retention";
import { calculateRemainingTime } from "@/utils/time-util";
import { SavedSites, PageData } from "@/types/sync-type";

// --- New Helper Functions ---

/**
 * Formats a timestamp into a human-readable "time ago" string.
 * @param timestamp The timestamp to format.
 * @returns A string like "3일 전".
 */
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}년 전`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}개월 전`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}일 전`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}시간 전`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}분 전`;
  return "방금 전";
}

/**
 * Formats a timestamp into a detailed string for tooltips.
 * @param timestamp The timestamp to format.
 * @returns A string like "마지막 방문: 2023년 10월 27일".
 */
function formatDetailedTime(timestamp: number): string {
  const date = new Date(timestamp);
  return `마지막 방문: ${date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
}

// --- Type for enriched site data ---
type EnrichedSiteData = {
  url: string;
  title: string;
  domain: string;
  lastAccessed: number;
  progress: number;
  retentionRate: number;
  textColor: string;
  isPendingDelete: boolean;
  timeAgo: string;
  detailedTime: string;
  remainingTime: string;
};

// --- SVG Icons ---
const SVG_ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
const SVG_ICON_DELETE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;

// --- Core Rendering Logic ---

let allSites: EnrichedSiteData[] = [];

async function renderUI() {
  const siteList = document.getElementById("siteList");
  const searchInput = document.getElementById(
    "searchInput"
  ) as HTMLInputElement;
  const sortSelect = document.getElementById("sortSelect") as HTMLSelectElement;

  if (!siteList || !searchInput || !sortSelect) return;

  const searchTerm = searchInput.value.toLowerCase();
  const sortBy = sortSelect.value;

  // 1. Filter
  const filteredSites = allSites.filter(
    (site) =>
      site.title.toLowerCase().includes(searchTerm) ||
      site.domain.toLowerCase().includes(searchTerm)
  );

  // 2. Sort
  filteredSites.sort((a, b) => {
    switch (sortBy) {
      case "progress-desc":
        return b.progress - a.progress;
      case "progress-asc":
        return a.progress - b.progress;
      case "retention": // Lower retention rate means older
        return a.retentionRate - b.retentionRate;
      case "recent":
      default:
        return b.lastAccessed - a.lastAccessed;
    }
  });

  // 3. Group by domain
  const groupedSites = filteredSites.reduce((acc, site) => {
    (acc[site.domain] = acc[site.domain] || []).push(site);
    return acc;
  }, {} as Record<string, EnrichedSiteData[]>);

  // 4. Render DOM
  siteList.innerHTML = "";
  if (Object.keys(groupedSites).length === 0) {
    siteList.innerHTML = `<p style="text-align: center; color: #6c757d; padding: 20px;">일치하는 항목이 없습니다.</p>`;
    return;
  }

  for (const domain in groupedSites) {
    const sitesInGroup = groupedSites[domain];
    const groupElement = document.createElement("details");
    groupElement.className = "domain-group";
    groupElement.open = true; // Default to open

    const summaryElement = document.createElement("summary");
    summaryElement.className = "domain-summary";
    summaryElement.textContent = domain;

    groupElement.appendChild(summaryElement);

    sitesInGroup.forEach((site) => {
      const entry = document.createElement("div");
      entry.className = "site-item";
      if (site.isPendingDelete) {
        entry.classList.add("is-pending-delete");
      }

      const progressPercent = Math.round(site.progress * 100);

      // Determine progress bar class based on progress
      let progressClass = "";
      if (progressPercent <= 30) {
        progressClass = "progress-low";
      } else if (progressPercent < 100) {
        progressClass = "progress-mid";
      } else {
        progressClass = "progress-high";
      }

      entry.innerHTML = `
        <a href="${site.url}" target="_blank" class="item-main-link" title="'${site.title}' 페이지 열기">
          <div class="site-item-content">
            <div class="title-wrapper">
              <span class="site-title" style="color: ${site.textColor};" data-tooltip="${site.detailedTime}">${site.title}</span>
            </div>
            <span class="site-meta">${site.timeAgo} <span class="remaining-time">(${site.remainingTime})</span></span>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-filled ${progressClass}" style="width: ${progressPercent}%;"></div>
              </div>
              <span class="progress-text">${progressPercent}%</span>
            </div>
          </div>
        </a>
        <div class="item-actions">
           <button class="edit-button icon-button" title="제목 수정" data-url="${site.url}">${SVG_ICON_EDIT}</button>
           <button class="delete-button icon-button" title="삭제" data-url="${site.url}">${SVG_ICON_DELETE}</button>
        </div>
      `;

      groupElement.appendChild(entry);
    });
    siteList.appendChild(groupElement);
  }

  // Add event listeners for delete buttons
  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const urlToDelete = (e.currentTarget as HTMLElement).dataset.url;
      if (urlToDelete) {
        await deleteSite(urlToDelete);
        await initialize(); // Re-fetch and re-render everything
      }
    });
  });

  // Add event listeners for title editing
  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const targetButton = e.currentTarget as HTMLButtonElement;
      const url = targetButton.dataset.url;
      if (!url) return;

      const siteItem = targetButton.closest(".site-item");
      if (!siteItem) return;

      const titleSpan = siteItem.querySelector<HTMLSpanElement>(".site-title");
      const wrapper = titleSpan?.parentElement;
      if (!titleSpan || !wrapper) return;

      const currentTitle = titleSpan.innerText;

      const input = document.createElement("input");
      input.type = "text";
      input.className = "title-input";
      input.value = currentTitle;

      const saveOrCancel = async (event: FocusEvent | KeyboardEvent) => {
        const newTitle = input.value.trim();
        if (event.type === "blur" || (event as KeyboardEvent).key === "Enter") {
          if (newTitle && newTitle !== currentTitle) {
            await updateSiteTitle(url, newTitle);
          }
        }
        await initialize(); // Always re-render to restore UI or show update
      };

      input.addEventListener("blur", saveOrCancel);
      input.addEventListener("keydown", (keyEvent) => {
        if (keyEvent.key === "Enter" || keyEvent.key === "Escape") {
          input.blur();
        }
      });

      wrapper.innerHTML = "";
      wrapper.appendChild(input);
      input.focus();
      input.select();
    });
  });
}

/**
 * Fetches all data and prepares it for rendering.
 */
async function initialize() {
  const {
    savedSites = {},
    pageData = {},
  }: { savedSites: SavedSites; pageData: PageData } =
    await getSavedSitesAndPageData();

  const enrichedSitesPromises = Object.entries(savedSites).map(
    async ([url, site]) => {
      const scrollInfo = pageData[url] || {
        scroll: 0,
        height: 1,
        viewport: window.innerHeight,
      };

      const progress =
        scrollInfo.height > scrollInfo.viewport
          ? Math.min(
              scrollInfo.scroll / (scrollInfo.height - scrollInfo.viewport),
              1
            )
          : 1;

      const retentionRate = await calculateRetention(site.lastAccessed);
      const domain = new URL(url).hostname;

      const remainingTime = calculateRemainingTime(
        scrollInfo.height,
        scrollInfo.scroll,
        scrollInfo.viewport
      );

      return {
        url,
        title: site.title,
        domain,
        lastAccessed: site.lastAccessed,
        progress,
        retentionRate,
        textColor: getTextColor(retentionRate * 100),
        isPendingDelete: site.status === "pendingDelete",
        timeAgo: formatTimeAgo(site.lastAccessed),
        detailedTime: formatDetailedTime(site.lastAccessed),
        remainingTime,
      };
    }
  );

  allSites = await Promise.all(enrichedSitesPromises);

  await renderUI();

  // Update storage usage text
  const usageText = await getStorageUsageText();
  const usageDiv = document.getElementById("storage-usage");
  if (usageDiv) {
    usageDiv.textContent = usageText;
  }
}

async function updateSiteTitle(url: string, newTitle: string) {
  const { savedSites } = await getSavedSitesAndPageData();
  if (savedSites && savedSites[url]) {
    savedSites[url].title = newTitle;
    await chrome.storage.sync.set({ savedSites });
  }
}

async function saveCurrentSite() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id || !tab.url || !tab.url.startsWith("http")) return;

  const [{ result }] = await chrome.scripting.executeScript<
    [],
    {
      title: string;
      url: string;
      scroll: number;
      height: number;
      viewport: number;
    }
  >({
    target: { tabId: tab.id },
    func: () => {
      return {
        title: document.title,
        url: window.location.href,
        scroll: window.scrollY,
        height: document.documentElement.scrollHeight,
        viewport: window.innerHeight,
      };
    },
  });

  if (!result) return;

  const { title, url, scroll, height, viewport } = result;
  await saveToSync(title, url, scroll, height, viewport);
  await initialize(); // Re-fetch and re-render
}

function getStorageUsageText(): Promise<string> {
  return new Promise((resolve) => {
    const MAX_BYTES = 102400;
    chrome.storage.sync.getBytesInUse(null, (usedBytes) => {
      const usedKB = (usedBytes / 1024).toFixed(2);
      const maxKB = (MAX_BYTES / 1024).toFixed(0);
      if (chrome.runtime.lastError) {
        resolve("사용량 확인 불가");
        return;
      }
      resolve(`사용량: ${usedKB}KB / ${maxKB}KB`);
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const saveButton = document.getElementById("saveButton");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const settingsButton = document.getElementById("settingsButton");
  const settingsPanel = document.getElementById("settingsPanel");
  const retentionPeriodInput = document.getElementById(
    "retentionPeriodInput"
  ) as HTMLInputElement;

  if (saveButton) {
    saveButton.addEventListener("click", saveCurrentSite);
  }
  if (searchInput) {
    searchInput.addEventListener("input", renderUI);
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", renderUI);
  }

  // Settings Panel Logic
  if (settingsButton && settingsPanel) {
    settingsButton.addEventListener("click", () => {
      settingsPanel.classList.toggle("hidden");
    });
    // Close settings panel when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !settingsPanel.classList.contains("hidden") &&
        !settingsPanel.contains(e.target as Node) &&
        !settingsButton.contains(e.target as Node)
      ) {
        settingsPanel.classList.add("hidden");
      }
    });
  }

  if (retentionPeriodInput) {
    // Load initial value
    const { userOptions = {} } = await chrome.storage.sync.get("userOptions");
    retentionPeriodInput.value =
      userOptions.retentionPeriodInDays?.toString() || "14";

    // Save on change and re-render
    retentionPeriodInput.addEventListener("change", async () => {
      const newPeriod = parseInt(retentionPeriodInput.value, 10);
      if (!isNaN(newPeriod) && newPeriod > 0) {
        const { userOptions = {} } = await chrome.storage.sync.get(
          "userOptions"
        );
        userOptions.retentionPeriodInDays = newPeriod;
        await chrome.storage.sync.set({ userOptions });
        await initialize(); // Re-calculate and re-render all
      }
    });
  }

  await initialize();
});
