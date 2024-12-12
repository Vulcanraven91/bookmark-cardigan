import { useState } from "react";
import { BookmarkList } from "@/components/BookmarkList";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { Bookmark } from "@/types/bookmark";
import { nanoid } from "nanoid";

const Index = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const handleAdd = (newBookmark: Omit<Bookmark, "id">) => {
    const bookmark: Bookmark = {
      ...newBookmark,
      id: nanoid(),
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(newBookmark.url).hostname}`,
    };
    setBookmarks([...bookmarks, bookmark]);
  };

  const handleDelete = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const handleEdit = (bookmark: Bookmark) => {
    setBookmarks(bookmarks.map((b) => (b.id === bookmark.id ? bookmark : b)));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(bookmarks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBookmarks(items);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <AddBookmarkDialog onAdd={handleAdd} />
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