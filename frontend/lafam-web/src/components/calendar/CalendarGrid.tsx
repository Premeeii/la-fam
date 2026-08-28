'use client';

import { useState, type RefObject } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { useGroupEvents } from '@/lib/hooks/useEvents';
import type { EventResponse } from '@/lib/api/events';

interface CalendarGridProps {
  groupId: string;
  calendarRef?: RefObject<FullCalendar | null>;
  onDateClick: (date: Date) => void;
  onEventClick: (event: EventResponse) => void;
  onCurrentDateChange: (date: Date) => void;
}

function mapEventsToCalendarEvents(events: EventResponse[]) {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    backgroundColor: event.color || '#3b82f6',
    borderColor: 'transparent',
    extendedProps: event,
  }));
}

export function CalendarGrid({
  groupId,
  calendarRef,
  onDateClick,
  onEventClick,
  onCurrentDateChange,
}: CalendarGridProps) {
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  const { data: events = [], isLoading } = useGroupEvents(
    groupId,
    dateRange.from,
    dateRange.to
  );

  const mappedEvents = mapEventsToCalendarEvents(events);

  return (
    <div className="custom-calendar-wrapper relative flex-1 overflow-auto p-0">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={mappedEvents}
        headerToolbar={false}
        dayMaxEvents={3}
        firstDay={1}
        height="150%"

        eventContent={(arg) => {
          return (
            <div className="flex w-full items-center overflow-hidden text-ellipsis whitespace-nowrap px-1.5 py-0.5 text-xs text-black">
              
              <span className="truncate font-medium">{arg.event.title}{arg.timeText}</span>
            </div>
          );
        }}

        dateClick={(arg) => {
          onDateClick(arg.date);
        }}

        eventClick={(arg) => {
          onEventClick(
            arg.event.extendedProps as EventResponse
          );
        }}

        datesSet={(arg) => {
          setDateRange({
            from: arg.startStr,
            to: arg.endStr,
          });

          onCurrentDateChange(
            arg.view.currentStart
          );
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          Loading events...
        </div>
      )}
    </div>
  );
}


