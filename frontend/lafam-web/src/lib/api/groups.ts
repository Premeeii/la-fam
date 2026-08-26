import { apiClient } from './client';
import { AddGroupFormValues } from '../schemas/group';
import type { components } from '@/types/api';

type InviteTokenPreviewResponse = components['schemas']['InviteTokenPreviewResponse'];
type GroupMemberResponse = components['schemas']['GroupMemberResponse'];

export async function createGroup(data: AddGroupFormValues) {
    const response = await apiClient.post('/api/groups', data);
    return response.data;
}

export async function previewInviteToken(token: string): Promise<InviteTokenPreviewResponse> {
    const response = await apiClient.get(`/api/groups/invites/${token}/preview`);
    return response.data;
}

export async function joinGroup(token: string): Promise<GroupMemberResponse> {
    const response = await apiClient.post(`/api/groups/join?token=${token}`);
    return response.data;
}
