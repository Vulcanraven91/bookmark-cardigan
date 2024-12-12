import { Card } from "@/components/ui/card";
import { Draggable } from "@hello-pangea/dnd";
import { Bookmark } from "@/types/bookmark";
import { X, Edit, Globe, Folder } from "lucide-react";
import { toast } from "sonner";

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
}

export const BookmarkCard = ({ bookmark, index, onDelete, onEdit }: BookmarkCardProps) => {
  return (
    <Draggable draggableId={bookmark.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="p-3 mb-2 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {bookmark.isFolder ? (
                  <Folder className="w-4 h-4 text-blue-500 flex-shrink-0" />
                ) : bookmark.favicon ? (
                  <img
                    src={bookmark.favicon}
                    alt=""
                    className="w-4 h-4 rounded flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <h3 className="font-medium text-sm truncate">{bookmark.title}</h3>
                  {!bookmark.isFolder && (
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700 truncate block"
                    >
                      {bookmark.url}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
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
            {bookmark.description && (
              <p className="mt-1 text-xs text-gray-600 truncate">{bookmark.description}</p>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
};