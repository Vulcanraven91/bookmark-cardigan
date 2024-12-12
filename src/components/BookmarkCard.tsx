import { Card } from "@/components/ui/card";
import { Draggable } from "@hello-pangea/dnd";
import { Bookmark } from "@/types/bookmark";
import { X, Edit, Globe, Folder } from "lucide-react";
import { toast } from "sonner";
import { memo } from "react";

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
}

export const BookmarkCard = memo(({ bookmark, index, onDelete, onEdit }: BookmarkCardProps) => {
  return (
    <Draggable draggableId={bookmark.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="p-2 hover:shadow-lg transition-shadow duration-200 h-full">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start gap-1 mb-1">
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  {bookmark.isFolder ? (
                    <Folder className="w-3 h-3 text-blue-500 flex-shrink-0" />
                  ) : bookmark.favicon ? (
                    <img
                      src={bookmark.favicon}
                      alt=""
                      className="w-3 h-3 rounded flex-shrink-0"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <Globe className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  )}
                  <h3 className="font-medium text-xs truncate">{bookmark.title}</h3>
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => onEdit(bookmark)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      onDelete(bookmark.id);
                      toast.success("Bookmark deleted");
                    }}
                    className="p-1 hover:bg-gray-100 rounded text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {!bookmark.isFolder && (
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-blue-500 hover:text-blue-700 truncate block"
                >
                  {bookmark.url}
                </a>
              )}
              {bookmark.description && (
                <p className="mt-1 text-[10px] text-gray-600 truncate">
                  {bookmark.description}
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
});

BookmarkCard.displayName = "BookmarkCard";