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

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-500">
        Loading events...
      </div>
    );
  }

  return (
    <div className="custom-calendar-wrapper flex-1 overflow-auto p-0">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={mappedEvents}
        headerToolbar={false}
        dayMaxEvents={3}
        firstDay={1}
        height="100%"

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
    </div>
  );
}


