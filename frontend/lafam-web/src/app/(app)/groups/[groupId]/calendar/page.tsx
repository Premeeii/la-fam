'use client';

import { useRef, useState, use } from 'react';
import './calendar.css';
import FullCalendar from '@fullcalendar/react';
import { EventDialog } from '@/components/calendar/EventDialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { EventResponse } from '@/lib/api/events';
import { format } from 'date-fns';

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

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedEvent, setSelectedEvent] = useState<
    EventResponse | undefined
  >();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const handlePrev = () => {
    calendarRef.current?.getApi()?.prev();
  };

  const handleNext = () => {
    calendarRef.current?.getApi()?.next();
  };

  const handleToday = () => {
    calendarRef.current?.getApi()?.today();
  };

  const handleDateClick = (date: Date) => {
    setDialogMode('create');
    setSelectedEvent(undefined);
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleEventClick = (event: EventResponse) => {
    setDialogMode('edit');
    setSelectedEvent(event);
    setSelectedDate(undefined);
    setIsDialogOpen(true);
  };

  const handleAddEventClick = () => {
    setDialogMode('create');
    setSelectedEvent(undefined);
    setSelectedDate(new Date());
    setIsDialogOpen(true);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Custom Header matching the mockup */}
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

      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        groupId={groupId}
        mode={dialogMode}
        initialData={selectedEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
}
