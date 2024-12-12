export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  isFolder?: boolean;
  dateAdded?: number;
}