'use client';

import { useRef, useState, use } from 'react';
import './calendar.css';
import FullCalendar from '@fullcalendar/react';
import { EventPopover } from '@/components/calendar/EventPopover';
import type { EventResponse } from '@/lib/api/events';

import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';

export default function CalendarPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Popover state
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverMode, setPopoverMode] = useState<'create' | 'edit'>('create');
  const [selectedEvent, setSelectedEvent] = useState<
    EventResponse | undefined
  >();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePrev = () => {
    calendarRef.current?.getApi()?.prev();
  };

  const handleNext = () => {
    calendarRef.current?.getApi()?.next();
  };

  const handleToday = () => {
    calendarRef.current?.getApi()?.today();
  };

  const handleDateClick = (date: Date, el?: HTMLElement) => {
    setPopoverMode('create');
    setSelectedEvent(undefined);
    setSelectedDate(date);
    setAnchorEl(el || null);
    setIsPopoverOpen(true);
  };

  const handleEventClick = (event: EventResponse, el?: HTMLElement) => {
    setPopoverMode('edit');
    setSelectedEvent(event);
    setSelectedDate(undefined);
    setAnchorEl(el || null);
    setIsPopoverOpen(true);
  };

  const handleAddEventClick = () => {
    setPopoverMode('create');
    setSelectedEvent(undefined);
    setSelectedDate(new Date());
    setAnchorEl(null);
    setIsPopoverOpen(true);
  };

  return (
    <div className="dark:bg-background flex min-h-full flex-col overflow-y-auto rounded-xl border border-gray-200 bg-white pb-40 shadow-sm md:h-full md:overflow-hidden md:pb-0 dark:border-gray-700">
      {/* Calendar Header */}
      <CalendarHeader
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onAddEvent={handleAddEventClick}
      />

      {/* Calendar Grid Container */}
      <CalendarGrid
        groupId={groupId}
        calendarRef={calendarRef}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        onCurrentDateChange={setCurrentDate}
      />

      {/* Add / Edit Event Popover */}
      <EventPopover
        key={selectedEvent?.id ?? `create-${selectedDate?.getTime() ?? 'new'}`} //select event id or create timestamp when change event on grid
        isOpen={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        groupId={groupId}
        mode={popoverMode}
        initialData={selectedEvent}
        selectedDate={selectedDate}
        anchorEl={anchorEl}
      />
    </div>
  );
}
