import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { BookmarkCard } from "./BookmarkCard";
import { Bookmark } from "@/types/bookmark";
import { toast } from "sonner";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDragEnd: (result: any) => void;
  onDelete: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
}

export const BookmarkList = ({
  bookmarks,
  onDragEnd,
  onDelete,
  onEdit,
}: BookmarkListProps) => {
  return (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.map((bookmark, index) => (
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
  );
};