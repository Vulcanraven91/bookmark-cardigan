import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { BookmarkCard } from "./BookmarkCard";
import { Bookmark } from "@/types/bookmark";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Search, BarChart2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  const [sortBy, setSortBy] = useState<"name" | "date" | "type" | "domain">("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStats, setShowStats] = useState(false);

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

  const filteredAndSortedBookmarks = useMemo(() => {
    let filtered = [...bookmarks];

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
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "type":
          if (a.isFolder === b.isFolder) return a.title.localeCompare(b.title);
          return a.isFolder ? -1 : 1;
        case "domain":
          if (a.isFolder || b.isFolder) return a.isFolder ? -1 : 1;
          return getDomain(a.url).localeCompare(getDomain(b.url));
        case "date":
          return (b.dateAdded || 0) - (a.dateAdded || 0);
        default:
          return 0;
      }
    });
  }, [bookmarks, searchQuery, sortBy]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all bookmarks?")) {
                onClearAll();
                toast.success("All bookmarks cleared");
              }
            }}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
          <Dialog open={showStats} onOpenChange={setShowStats}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                Statistics
              </Button>
            </DialogTrigger>
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
        </div>
        <div className="flex flex-1 gap-2 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search bookmarks... (supports * and /regex/)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value: "name" | "date" | "type" | "domain") => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="type">Sort by Type</SelectItem>
              <SelectItem value="domain">Sort by Domain</SelectItem>
              <SelectItem value="date">Sort by Date Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="bookmarks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2">
                {filteredAndSortedBookmarks.map((bookmark, index) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    index={index}
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