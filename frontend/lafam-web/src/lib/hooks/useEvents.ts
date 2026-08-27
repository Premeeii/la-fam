import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGroupEvents, createEvent, updateEvent, deleteEvent, type EventResponse } from "../api/events";
import type { EventFormValues } from "../schemas/event";
import { toast } from "sonner";

export function useGroupEvents(groupId: string, from: string, to: string) {
    return useQuery<EventResponse[]>({
        queryKey: ['events', groupId, from, to],
        queryFn: () => getGroupEvents(groupId, from, to),
        enabled: !!groupId && !!from && !!to,
    });
}

export function useCreateEvent(groupId: string) {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: EventFormValues) => createEvent(groupId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events', groupId] });
            toast.success('Event created successfully');
        },
        onError: () => {
            toast.error('Failed to create event');
        }
    });
}

export function useUpdateEvent(groupId: string) {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ eventId, data }: { eventId: string, data: EventFormValues }) => updateEvent(groupId, eventId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events', groupId] });
            toast.success('Event updated successfully');
        },
        onError: () => {
            toast.error('Failed to update event');
        }
    });
}

export function useDeleteEvent(groupId: string) {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (eventId: string) => deleteEvent(groupId, eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events', groupId] });
            toast.success('Event deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete event');
        }
    });
}
