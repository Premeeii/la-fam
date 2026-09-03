import { apiClient } from './client';
import { AddGroupFormValues } from '../schemas/group';
import type { components } from '@/types/api';

type InviteTokenPreviewResponse =
  components['schemas']['InviteTokenPreviewResponse'];
type GroupMemberResponse = components['schemas']['GroupMemberResponse'];
type InviteTokenResponse = components['schemas']['InviteTokenResponse'];

export interface AvatarUploadResponse {
  uploadUrl: string;
  publicUrl: string;
  objectKey: string;
}

export async function createGroup(data: AddGroupFormValues) {
  const response = await apiClient.post('/api/groups', data);
  return response.data;
}

export async function previewInviteToken(
  token: string,
): Promise<InviteTokenPreviewResponse> {
  const response = await apiClient.get(`/api/groups/invites/${token}/preview`);
  return response.data;
}

export async function joinGroup(token: string): Promise<GroupMemberResponse> {
  const response = await apiClient.post(`/api/groups/join?token=${token}`);
  return response.data;
}

export async function generateInviteToken(
  groupId: string,
): Promise<InviteTokenResponse> {
  const response = await apiClient.post(`/api/groups/${groupId}/invites`);
  return response.data;
}

export async function deleteGroup(groupId: string) {
  const response = await apiClient.delete(`/api/groups/${groupId}`);
  return response.data;
}

export async function requestGroupAvatarUploadUrl(
  groupId: string,
  contentType: string,
) {
  const response = await apiClient.post<AvatarUploadResponse>(
    `/api/groups/${groupId}/avatar/upload-url?contentType=${encodeURIComponent(contentType)}`,
  );

  return response.data;
}

export async function uploadGroupFileToR2(
  preSignedUrl: string,
  file: File,
): Promise<void> {
  const res = await fetch(preSignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`);
  }
}

export async function confirmGroupAvatarUpload(
  groupId: string,
  objectKey: string,
) {
  const response = await apiClient.patch(
    `/api/groups/${groupId}/avatar/confirm`,
    { objectKey },
  );

  return response.data;
}
