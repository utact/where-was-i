export interface SavedSite {
  title: string;
  url: string;
  lastAccessed: number;
  status?: "active" | "pendingDelete";
}

export interface ScrollInfo {
  scroll: number;
  height: number;
  viewport: number;
}

export type ScrollData = Record<string, ScrollInfo>;
