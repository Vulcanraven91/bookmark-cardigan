import { Card } from "@/components/ui/card";
import { Draggable } from "@hello-pangea/dnd";
import { Bookmark } from "@/types/bookmark";
import { X, Edit, Globe } from "lucide-react";
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
          <Card className="p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {bookmark.favicon ? (
                  <img
                    src={bookmark.favicon}
                    alt=""
                    className="w-6 h-6 rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <Globe className="w-6 h-6 text-gray-400" />
                )}
                <div className="text-left">
                  <h3 className="font-medium text-lg">{bookmark.title}</h3>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-700 truncate block max-w-[200px]"
                  >
                    {bookmark.url}
                  </a>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(bookmark)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onDelete(bookmark.id);
                    toast.success("Bookmark deleted");
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {bookmark.description && (
              <p className="mt-2 text-sm text-gray-600">{bookmark.description}</p>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
};