import { useState, useEffect } from "react";
import { BookmarkList } from "@/components/BookmarkList";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { Bookmark } from "@/types/bookmark";
import { nanoid } from "nanoid";
import { parseBookmarksFile } from "@/utils/bookmarkParser";
import { toast } from "sonner";

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

  const handleAdd = (newBookmark: Omit<Bookmark, "id">) => {
    // Check for duplicates
    if (bookmarks.some(b => b.url === newBookmark.url)) {
      toast.error("This bookmark already exists!");
      return;
    }

    const bookmark: Bookmark = {
      ...newBookmark,
      id: nanoid(),
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(newBookmark.url).hostname}`,
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
          <AddBookmarkDialog onAdd={handleAdd} />
        </div>
      </div>
      <BookmarkList
        bookmarks={bookmarks}
        onDragEnd={handleDragEnd}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default Index;