'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type NoteSortOption = 'newest' | 'oldest' | 'title_asc';

interface NotesHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: NoteSortOption;
  onSortChange: (sort: NoteSortOption) => void;
  onAddNote: () => void;
}

export function NotesHeader({
  searchQuery,
  onSearchChange,
  sortOrder = 'newest',
  onSortChange,
  onAddNote,
}: NotesHeaderProps) {
  const getSortLabel = () => {
    switch (sortOrder) {
      case 'oldest':
        return 'Oldest';
      case 'title_asc':
        return 'Title (A-Z)';
      default:
        return 'Newest';
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Sort Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="h-10 px-4 text-sm font-medium border-gray-200 dark:border-gray-700">
                <ArrowUpDown className="h-4 w-4 mr-1.5" />
                {getSortLabel()}
              </Button>
            }
          />
          <DropdownMenuContent align="end" sideOffset={8} className="w-40">
            <DropdownMenuItem
              className={sortOrder === 'newest' ? 'font-semibold py-2 cursor-pointer' : 'py-2 cursor-pointer'}
              onClick={() => onSortChange('newest')}
            >
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortOrder === 'oldest' ? 'font-semibold py-2 cursor-pointer' : 'py-2 cursor-pointer'}
              onClick={() => onSortChange('oldest')}
            >
              Oldest
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortOrder === 'title_asc' ? 'font-semibold py-2 cursor-pointer' : 'py-2 cursor-pointer'}
              onClick={() => onSortChange('title_asc')}
            >
              Title (A-Z)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add Note Button */}
        <Button
          onClick={onAddNote}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-4 text-sm shadow-xs"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Note
        </Button>
      </div>
    </div>
  );
}
