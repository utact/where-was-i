export interface SavedSite {
  title: string;
  url: string;
  lastAccessed: number;
}

export interface ScrollInfo {
  scroll: number;
  height: number;
}

export type ScrollData = Record<string, ScrollInfo>;
