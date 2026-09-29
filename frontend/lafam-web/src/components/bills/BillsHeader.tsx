'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Search, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { BillCategoryResponse } from '@/lib/api/bills';
import { AddBillPopover } from './AddBillPopover';

export type SortOption = 'newest' | 'oldest' | 'amount_desc' | 'amount_asc';

interface BillsHeaderProps {
  groupId: string;
  categories: BillCategoryResponse[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: 'all' | 'own' | string) => void; // 'all' | 'own' | categoryId
  activeFilter: string;
  sortOrder?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  onAddBill?: () => void;
}

export function BillsHeader({
  groupId,
  categories,
  searchQuery,
  onSearchChange,
  onFilterChange,
  activeFilter,
  sortOrder = 'newest',
  onSortChange,
  onAddBill,
}: BillsHeaderProps) {
  const getFilterLabel = () => {
    if (activeFilter === 'all') return 'Categories';
    if (activeFilter === 'own') return 'Own Bills';
    const cat = categories.find((c) => c.id === activeFilter);
    return cat?.name || 'Categories';
  };

  const getSortLabel = () => {
    switch (sortOrder) {
      case 'oldest':
        return 'Oldest';
      case 'amount_desc':
        return 'Highest Amount';
      case 'amount_asc':
        return 'Lowest Amount';
      default:
        return 'Newest';
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search ..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <AddBillPopover groupId={groupId} />

        {/* Sort Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-5">
                <ArrowUpDown className="h-4 w-4 mr-1.5" />
                {getSortLabel()}
              </Button>
            }
          />
          <DropdownMenuContent align="end" sideOffset={8} className="w-44">
            <DropdownMenuItem
              className={sortOrder === 'newest' ? 'font-semibold py-2 cursor-pointer' : 'py-2 cursor-pointer'}
              onClick={() => onSortChange?.('newest')}
            >
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortOrder === 'oldest' ? 'font-semibold py-2 cursor-pointer' : 'py-2 cursor-pointer'}
              onClick={() => onSortChange?.('oldest')}
            >
              Oldest
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortOrder === 'amount_desc' ? 'font-semibold py-2 cursor-pointer' : 'py-2 cursor-pointer'}
              onClick={() => onSortChange?.('amount_desc')}
            >
              Highest Amount
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortOrder === 'amount_asc' ? 'font-semibold py-2 cursor-pointer' : 'py-2 cursor-pointer'}
              onClick={() => onSortChange?.('amount_asc')}
            >
              Lowest Amount
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-5">
                <Star className="h-4 w-4" />
                {getFilterLabel()}
              </Button>
            }
          />
          <DropdownMenuContent align="end" sideOffset={8} className="w-48 ">
            <DropdownMenuItem
              className={activeFilter === 'own' ? 'font-semibold py-2 cursor-pointer' : 'py-2 cursor-pointer'}
              onClick={() => onFilterChange('own')}
            >
              Own Bills
            </DropdownMenuItem>
            <DropdownMenuItem
              className={activeFilter === 'all' ? 'font-semibold py-2 cursor-pointer' : 'py-2 cursor-pointer'}
              onClick={() => onFilterChange('all')}
            >
              All
            </DropdownMenuItem>
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat.id}
                className={activeFilter === cat.id ? 'font-semibold py-2 cursor-pointer' : 'py-2 cursor-pointer'}
                onClick={() => onFilterChange(cat.id!)}
              >
                {cat.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
