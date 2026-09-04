'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useGroupEvents } from '@/lib/hooks/useEvents';
import { startOfWeek, endOfWeek, addDays, format, isSameDay, isToday } from 'date-fns';

export function UpcomingWeek({ groupId }: { groupId: string }) {
  // Get start and end of the current week (Sunday to Saturday)
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  // Fetch events for this week
  const { data: events = [] } = useGroupEvents(
    groupId,
    weekStart.toISOString(),
    weekEnd.toISOString()
  );

  // Generate the 7 days of the week
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(weekStart, index);
      // Find events that happen on this day to show dots
      const dayEvents = events.filter(
        (event) => {
          if (!event.startDate || !event.endDate) return false;
          return new Date(event.startDate).getTime() <= date.getTime() + 24 * 60 * 60 * 1000 &&
                 new Date(event.endDate).getTime() >= date.getTime();
        }
      );
      
      return {
        date,
        dayName: format(date, 'EEE').toUpperCase(),
        dayNumber: format(date, 'd'),
        isCurrentDay: isToday(date),
        events: dayEvents,
      };
    });
  }, [weekStart, events]);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Upcoming Week</h2>
        <Link 
          href={`/groups/${groupId}/calendar`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View Full Calendar
        </Link>
      </div>

      <div className="border border-gray-200 rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-sm flex justify-between items-center overflow-x-auto custom-scrollbar">
        {weekDays.map((day, i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-1 sm:gap-2 min-w-[32px] sm:min-w-[40px]">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500">{day.dayName}</span>
            <div 
              className={`flex flex-col items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg relative ${
                day.isCurrentDay 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'text-gray-900'
              }`}
            >
              <span className={`text-sm sm:text-base font-semibold ${day.isCurrentDay ? 'text-white' : 'text-gray-900'}`}>
                {day.dayNumber}
              </span>
              
              {/* Event indicators (dots) */}
              {day.events.length > 0 && !day.isCurrentDay && (
                <div className="absolute -bottom-3 flex gap-1">
                  {day.events.slice(0, 1).map((e) => (
                    <span 
                      key={e.id} 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: e.color || '#3b82f6' }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
