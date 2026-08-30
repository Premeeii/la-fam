'use client';

import { useMemo } from 'react';
import { useGroupEvents } from '@/lib/hooks/useEvents';
import { useGroupMembers } from '@/lib/hooks/useGroup';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UpcomingEvents({ groupId }: { groupId: string }) {
  // Use stable dates for fetching to avoid infinite refetches identify date length
  const { fromStr, toStr } = useMemo(() => {
    const now = new Date();
    const fromStr = now.toISOString();
    const toDate = new Date(now);
    toDate.setDate(now.getDate() + 30); // fetch events for the next 30 days
    return { fromStr, toStr: toDate.toISOString() };
  }, []);

  const { data: events, isLoading: isLoadingEvents } = useGroupEvents(groupId, fromStr, toStr);
  const { data: members } = useGroupMembers(groupId);

  // Filter events that haven't ended yet and sort by start date
  const upcomingEvents = useMemo(() => {
  if (!events) return [];

  const nowTime = Date.now();

  return [...events]
    .filter((event) => {
      if (!event.startDate || !event.endDate) { //if dont have startdate or enddate skip it
        return false;
      }

      return new Date(event.endDate).getTime() >= nowTime;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate!).getTime() - //sort events by startdate ascending
        new Date(b.startDate!).getTime()
    )
    .slice(0, 2);
}, [events]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  if (isLoadingEvents) {
    return (
      <div className="flex flex-col space-y-4 w-full">
        <div className="h-28 w-full bg-gray-100 rounded-xl animate-pulse"></div>
        <div className="h-28 w-full bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (!upcomingEvents || upcomingEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-xl bg-gray-50 text-gray-400">
        <p>No upcoming events.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 w-full">
      {upcomingEvents.map((event) => {
        const owner = members?.find((m) => m.userId === event.ownerId);
        
        return (
          <div 
            key={event.id} 
            className="flex flex-col justify-between p-4 bg-white border border-blue-500 rounded-xl shadow-sm relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.description || 'No description'}</p>
              </div>
              <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm">
                {/*its will error when identify types of startDate (it's string? Date?) its must required to be date type*/}
                {formatTime(event.startDate)} 
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-3">
              <div className="flex -space-x-2">
                {owner && (
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={owner.userAvatarUrl || ''} />
                    <AvatarFallback className="bg-gray-200 text-xs text-gray-600">
                      {owner.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
