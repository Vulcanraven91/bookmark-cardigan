export interface ParsedBookmark {
  title: string;
  url: string;
  description?: string;
}

export const parseBookmarksFile = (fileContent: string): ParsedBookmark[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(fileContent, 'text/html');
  const bookmarkElements = doc.getElementsByTagName('a');
  
  const bookmarks: ParsedBookmark[] = [];
  
  for (const element of Array.from(bookmarkElements)) {
    const url = element.getAttribute('href');
    const title = element.textContent;
    
    if (url && title) {
      bookmarks.push({
        title: title.trim(),
        url: url,
        description: element.getAttribute('description') || undefined
      });
    }
  }
  
  return bookmarks;
};