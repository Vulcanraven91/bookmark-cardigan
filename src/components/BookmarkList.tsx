import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { BookmarkCard } from "./BookmarkCard";
import { BookmarkToolbar } from "./BookmarkToolbar";
import { Bookmark, ViewStyle } from "@/types/bookmark";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDragEnd: (result: any) => void;
  onDelete: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
  onClearAll: () => void;
}

export const BookmarkList = ({
  bookmarks,
  onDragEnd,
  onDelete,
  onEdit,
  onClearAll,
}: BookmarkListProps) => {
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [viewStyle, setViewStyle] = useState<ViewStyle>("grid");
  const [showHidden, setShowHidden] = useState(false);
  const [selectedBookmarks, setSelectedBookmarks] = useState<Set<string>>(new Set());

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const domainStats = useMemo(() => {
    const stats = bookmarks.reduce((acc, bookmark) => {
      if (!bookmark.isFolder && bookmark.url) {
        const domain = getDomain(bookmark.url);
        acc[domain] = (acc[domain] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  }, [bookmarks]);

  const handleSelect = (id: string) => {
    setSelectedBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedBookmarks.size} selected bookmarks?`)) {
      selectedBookmarks.forEach(id => onDelete(id));
      setSelectedBookmarks(new Set());
      toast.success(`Deleted ${selectedBookmarks.size} bookmarks`);
    }
  };

  const filteredAndSortedBookmarks = useMemo(() => {
    let filtered = [...bookmarks];

    // Filter hidden bookmarks
    if (!showHidden) {
      filtered = filtered.filter(bookmark => !bookmark.isHidden);
    }

    // Search filter
    if (searchQuery) {
      const isRegex = searchQuery.startsWith("/") && searchQuery.endsWith("/");
      const isWildcard = searchQuery.includes("*");

      filtered = filtered.filter((bookmark) => {
        const searchText = `${bookmark.title} ${bookmark.url} ${bookmark.description || ""}`.toLowerCase();
        
        if (isRegex) {
          try {
            const regex = new RegExp(searchQuery.slice(1, -1), "i");
            return regex.test(searchText);
          } catch {
            return false;
          }
        } else if (isWildcard) {
          const pattern = new RegExp(
            searchQuery.replace(/\*/g, ".*").toLowerCase()
          );
          return pattern.test(searchText);
        } else {
          return searchText.includes(searchQuery.toLowerCase());
        }
      });
    }

    // Sort
    return filtered.sort((a, b) => {
      let result = 0;
      switch (sortBy) {
        case "name":
          result = a.title.localeCompare(b.title);
          break;
        case "type":
          result = a.isFolder === b.isFolder ? a.title.localeCompare(b.title) : (a.isFolder ? -1 : 1);
          break;
        case "domain":
          if (a.isFolder || b.isFolder) return a.isFolder ? -1 : 1;
          result = getDomain(a.url).localeCompare(getDomain(b.url));
          break;
        case "date":
          result = ((b.dateAdded || 0) - (a.dateAdded || 0));
          break;
        default:
          result = 0;
      }
      return sortDirection === "asc" ? result : -result;
    });
  }, [bookmarks, searchQuery, sortBy, sortDirection, showHidden]);

  return (
    <div className="space-y-4">
      <BookmarkToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        viewStyle={viewStyle}
        setViewStyle={setViewStyle}
        showHidden={showHidden}
        setShowHidden={setShowHidden}
        selectedCount={selectedBookmarks.size}
        onClearSelected={handleClearSelected}
        onClearAll={onClearAll}
        onShowStats={() => setShowStats(true)}
      />
      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Domain Statistics</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {domainStats.map(([domain, count]) => (
              <div key={domain} className="flex justify-between items-center">
                <span className="text-sm truncate">{domain}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="bookmarks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <div className={`grid gap-2 ${
                viewStyle === "grid" 
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8" 
                  : "grid-cols-1"
              }`}>
                {filteredAndSortedBookmarks.map((bookmark, index) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    index={index}
                    viewStyle={viewStyle}
                    isSelected={selectedBookmarks.has(bookmark.id)}
                    onSelect={handleSelect}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                ))}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};