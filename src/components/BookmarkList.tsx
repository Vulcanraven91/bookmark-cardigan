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
import { Trash2 } from "lucide-react";

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
  const [sortBy, setSortBy] = useState<"name" | "date" | "type">("name");

  const sortedBookmarks = useMemo(() => 
    [...bookmarks].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "type":
          if (a.isFolder === b.isFolder) return a.title.localeCompare(b.title);
          return a.isFolder ? -1 : 1;
        default:
          return 0;
      }
    }), [bookmarks, sortBy]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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
        <Select
          value={sortBy}
          onValueChange={(value: "name" | "date" | "type") => setSortBy(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="type">Sort by Type</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DragDropContext
        onDragEnd={(result) => {
          onDragEnd(result);
          if (result.destination) {
            toast.success("Bookmark reordered");
          }
        }}
      >
        <Droppable droppableId="bookmarks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2">
                {sortedBookmarks.map((bookmark, index) => (
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