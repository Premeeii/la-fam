'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { BillCategoryResponse } from '@/lib/api/bills';

interface BillsHeaderProps {
  categories: BillCategoryResponse[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: 'all' | 'own' | string) => void; // 'all' | 'own' | categoryId
  activeFilter: string;
  onAddBill: () => void;
}

export function BillsHeader({
  categories,
  searchQuery,
  onSearchChange,
  onFilterChange,
  activeFilter,
  onAddBill,
}: BillsHeaderProps) {
  const getFilterLabel = () => {
    if (activeFilter === 'all') return 'Categories';
    if (activeFilter === 'own') return 'Own Bills';
    const cat = categories.find((c) => c.id === activeFilter);
    return cat?.name || 'Categories';
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
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-5"
          onClick={onAddBill}
        >
          Add Bill
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-5">
                <Star className="h-4 w-4" />
                {getFilterLabel()}
              </Button>
            }
          />
          <DropdownMenuContent align="end" sideOffset={8} className="w-48">
            <DropdownMenuItem
              className={activeFilter === 'own' ? 'font-semibold' : ''}
              onClick={() => onFilterChange('own')}
            >
              Own Bills
            </DropdownMenuItem>
            <DropdownMenuItem
              className={activeFilter === 'all' ? 'font-semibold' : ''}
              onClick={() => onFilterChange('all')}
            >
              All
            </DropdownMenuItem>
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat.id}
                className={activeFilter === cat.id ? 'font-semibold' : ''}
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
