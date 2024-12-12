import { useState, useEffect } from "react";
import { BookmarkList } from "@/components/BookmarkList";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { Bookmark } from "@/types/bookmark";
import { nanoid } from "nanoid";
import { parseBookmarksFile } from "@/utils/bookmarkParser";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "bookmarks";

const Index = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored bookmarks:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleClearAll = () => {
    setBookmarks([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleAdd = (newBookmark: Omit<Bookmark, "id">) => {
    if (bookmarks.some(b => b.url === newBookmark.url)) {
      toast.error("This bookmark already exists!");
      return;
    }

    const bookmark: Bookmark = {
      ...newBookmark,
      id: nanoid(),
      favicon: newBookmark.isFolder ? undefined : `https://www.google.com/s2/favicons?domain=${new URL(newBookmark.url).hostname}`,
    };
    setBookmarks([...bookmarks, bookmark]);
    toast.success("Bookmark added successfully!");
  };

  const handleDelete = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
    toast.success("Bookmark deleted successfully!");
  };

  const handleEdit = (bookmark: Bookmark) => {
    setBookmarks(bookmarks.map((b) => (b.id === bookmark.id ? bookmark : b)));
    toast.success("Bookmark updated successfully!");
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(bookmarks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBookmarks(items);
  };

  const handleExport = () => {
    const generateHTML = (bookmarks: Bookmark[]) => {
      const items = bookmarks.map(bookmark => {
        if (bookmark.isFolder) {
          return `<DT><H3>${bookmark.title}</H3>`;
        }
        return `<DT><A HREF="${bookmark.url}" ${bookmark.description ? `DESCRIPTION="${bookmark.description}"` : ''}>${bookmark.title}</A>`;
      }).join('\n');

      return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
${items}
</DL><p>`;
    };

    const html = generateHTML(bookmarks);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookmarks.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Bookmarks exported successfully!");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const parsedBookmarks = parseBookmarksFile(content);
      
      // Add only non-duplicate bookmarks
      const newBookmarks = parsedBookmarks.filter(
        newBookmark => !bookmarks.some(existing => existing.url === newBookmark.url)
      ).map(bookmark => ({
        ...bookmark,
        id: nanoid(),
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}`,
      }));

      if (newBookmarks.length === 0) {
        toast.info("No new bookmarks to import!");
        return;
      }

      setBookmarks(prev => [...prev, ...newBookmarks]);
      toast.success(`Imported ${newBookmarks.length} new bookmarks!`);
    } catch (error) {
      console.error("Error importing bookmarks:", error);
      toast.error("Failed to import bookmarks. Please check the file format.");
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <div className="flex gap-4">
          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
            Import Bookmarks
            <input
              type="file"
              accept=".html"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <Button onClick={handleExport} variant="outline">
            Export Bookmarks
          </Button>
          <AddBookmarkDialog onAdd={handleAdd} />
        </div>
      </div>
      <BookmarkList
        bookmarks={bookmarks}
        onDragEnd={handleDragEnd}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default Index;
