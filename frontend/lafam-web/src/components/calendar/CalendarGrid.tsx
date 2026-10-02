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
  onDateClick: (date: Date, el?: HTMLElement) => void;
  onEventClick: (event: EventResponse, el?: HTMLElement) => void;
  onCurrentDateChange: (date: Date) => void;
}

function mapEventsToCalendarEvents(events: EventResponse[]) {
  //map backend response straight to fullCalendar
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    backgroundColor: event.color || '#3b82f6',
    borderColor: 'transparent',
    extendedProps: event, //take full response in fullCalendar
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
    from: '', //from = 2026-07-1
    to: '', //from = 2026-07-31
  });

  const { data: events = [], isLoading } = useGroupEvents(
    //fetch array event from backend
    groupId,
    dateRange.from,
    dateRange.to,
  );

  const mappedEvents = mapEventsToCalendarEvents(events); //converts backend response format into fullcalendar format

  return (
    <div className="custom-calendar-wrapper relative min-h-[600px] flex-1 overflow-auto p-0 md:min-h-0">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={mappedEvents}
        headerToolbar={false}
        dayMaxEvents={3}
        firstDay={1}
        height="auto"
        eventDisplay="block"

        eventContent={(arg) => {
          return (
            <div className="flex w-full items-center overflow-hidden px-1.5 py-0.5 text-xs text-ellipsis whitespace-nowrap text-black">
              <span className="truncate font-medium">{arg.event.title}</span>
            </div>
          );
        }}

        dateClick={(arg) => {
          onDateClick(arg.date, arg.dayEl as HTMLElement);
        }}

        eventClick={(arg) => {
          // if clicked inside FullCalendar's +more popover, anchor to the grid day cell instead
          const morePopover = arg.el.closest('.fc-popover, .fc-more-popover');
          let targetEl: HTMLElement = arg.el;

          if (morePopover) {
            const eventDate = arg.event.start;
            if (eventDate) {
              const year = eventDate.getFullYear();
              const month = String(eventDate.getMonth() + 1).padStart(2, '0');
              const day = String(eventDate.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;
              const dayCell = document.querySelector<HTMLElement>(
                `.fc-daygrid-day[data-date="${dateStr}"]`,
              );
              if (dayCell) {
                targetEl = dayCell; //set to the day cell when clicked inside FullCalendar's +more popover
              }
            }
          }

          onEventClick(
            arg.event.extendedProps as EventResponse,
            targetEl,
          );
        }}

        datesSet={(arg) => {
          setDateRange({
            from: arg.startStr,
            to: arg.endStr,
          });

          onCurrentDateChange(arg.view.currentStart);
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
