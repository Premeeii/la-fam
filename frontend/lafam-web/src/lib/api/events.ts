import { apiClient } from './client';
import type { components } from '@/types/api';
import type { EventFormValues } from '../schemas/event';

export type EventResponse = components['schemas']['EventResponse'];

export async function getGroupEvents(groupId: string, from: string, to: string): Promise<EventResponse[]> {
    const response = await apiClient.get(`/api/groups/${groupId}/events`, {
        params: { from, to }
    });
    return response.data;
}

export async function createEvent(groupId: string, data: EventFormValues): Promise<EventResponse> {
    const response = await apiClient.post(`/api/groups/${groupId}/events`, data);
    return response.data;
}

export async function updateEvent(groupId: string, eventId: string, data: EventFormValues): Promise<EventResponse> {
    const response = await apiClient.patch(`/api/groups/${groupId}/events/${eventId}`, data);
    return response.data;
}

export async function deleteEvent(groupId: string, eventId: string): Promise<void> {
    await apiClient.delete(`/api/groups/${groupId}/events/${eventId}`);
}
