'use client';

import { useRef, useState, use } from 'react';
import './calendar.css'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useGroupEvents } from "@/lib/hooks/useEvents";
import { EventDialog } from "@/components/calendar/EventDialog";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { EventResponse } from '@/lib/api/events';
import { format } from 'date-fns';

export default function CalendarPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = use(params);
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  
  // Date range state for fetching events
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const { data: events = [], isLoading } = useGroupEvents(groupId, dateRange.from, dateRange.to);

  const mappedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    backgroundColor: event.color || '#3b82f6',
    borderColor: 'transparent',
    extendedProps: { ...event }
  }));

  const handlePrev = () => {
    calendarRef.current?.getApi()?.prev();
  };

  const handleNext = () => {
    calendarRef.current?.getApi()?.next();
  };

  const handleToday = () => {
    calendarRef.current?.getApi()?.today();
  };

  const handleDateClick = (arg: { date: Date }) => {
    setDialogMode('create');
    setSelectedEvent(undefined);
    setSelectedDate(arg.date);
    setIsDialogOpen(true);
  };

  const handleEventClick = (arg: { event: any }) => {
    setDialogMode('edit');
    setSelectedEvent(arg.event.extendedProps as EventResponse);
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
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Custom Header matching the mockup */}
      <div className="flex items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-100 gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 min-w-0 flex-shrink break-words leading-tight w-24 sm:w-auto">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 justify-end">
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-700" onClick={handleToday}>
              Today
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={handleAddEventClick} className="h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 sm:px-4 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add event</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="flex-1 p-0 custom-calendar-wrapper overflow-auto">
        
        <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={mappedEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            datesSet={(arg) => {
              setDateRange({ from: arg.startStr, to: arg.endStr });
              setCurrentDate(arg.view.currentStart);
            }}
            dayMaxEvents={3}
            firstDay={1}
            height="100%"
            headerToolbar={false}

          
          />
          {isLoading && (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
      Loading events...
    </div>
  )}
        
      </div>

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
