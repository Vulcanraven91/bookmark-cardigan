import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Search,
  BarChart2,
  Grid,
  List,
  ArrowUpDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { ViewStyle } from "@/types/bookmark";

interface BookmarkToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  viewStyle: ViewStyle;
  setViewStyle: (style: ViewStyle) => void;
  showHidden: boolean;
  setShowHidden: (show: boolean) => void;
  selectedCount: number;
  onClearSelected: () => void;
  onClearAll: () => void;
  onShowStats: () => void;
}

export const BookmarkToolbar = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  viewStyle,
  setViewStyle,
  showHidden,
  setShowHidden,
  selectedCount,
  onClearSelected,
  onClearAll,
  onShowStats,
}: BookmarkToolbarProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (window.confirm("Are you sure you want to clear all bookmarks?")) {
              onClearAll();
            }
          }}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
        {selectedCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearSelected}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Selected ({selectedCount})
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onShowStats}
          className="flex items-center gap-2"
        >
          <BarChart2 className="w-4 h-4" />
          Statistics
        </Button>
      </div>
      <div className="flex flex-1 gap-2 sm:max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search bookmarks... (supports * and /regex/)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
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
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          className="w-10 h-10"
        >
          <ArrowUpDown className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewStyle(viewStyle === "grid" ? "list" : "grid")}
          className="w-10 h-10"
        >
          {viewStyle === "grid" ? (
            <List className="w-4 h-4" />
          ) : (
            <Grid className="w-4 h-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowHidden(!showHidden)}
          className="w-10 h-10"
        >
          {showHidden ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};