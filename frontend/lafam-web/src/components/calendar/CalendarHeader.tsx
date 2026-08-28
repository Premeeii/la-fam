'use client';

import { Button } from '../ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onToday: () => void;
  onNext: () => void;
  onAddEvent: () => void;
}

export function CalendarHeader({
  currentDate,
  onPrev,
  onToday,
  onNext,
  onAddEvent,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-gray-100 p-4 sm:items-center sm:p-6">
      <h1 className="w-24 min-w-0 shrink text-xl leading-tight font-semibold wrap-break-word text-gray-900 sm:w-auto sm:text-2xl">
        {format(currentDate, 'MMMM yyyy')}
      </h1>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-900"
            onClick={onPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-medium text-gray-700 sm:px-3 sm:text-sm"
            onClick={onToday}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-900"
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={onAddEvent}
          className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-3 text-white hover:bg-blue-700 sm:px-4"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add event</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  );
}
