export type SavedSites = Record<
  string,
  {
    title: string;
    lastAccessed: number;
    status?: "active" | "pendingDelete";
  }
>;

export type PageData = Record<
  string,
  {
    scroll: number;
    height: number;
    viewport: number;
  }
>;
