export interface SavedSite {
  title: string;
  url: string;
  lastAccessed: number;
  status?: "active" | "pendingDelete";
}

export interface ScrollInfo {
  scroll: number;
  height: number;
}

export type ScrollData = Record<string, ScrollInfo>;
