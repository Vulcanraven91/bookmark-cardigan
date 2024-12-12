export interface Bookmark {
  id: string;
  title: string;
  url?: string;
  description?: string;
  favicon?: string;
  dateAdded?: number;
  isFolder: boolean;
  isHidden?: boolean;
}

export type ViewStyle = "grid" | "list";