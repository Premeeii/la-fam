import { apiClient } from './client';

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface NoteResponse {
  id: string;
  groupId: string;
  title: string;
  content: string | null;
  createdBy: string;
  creatorName: string;
  updatedBy: string | null;
  updaterName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content?: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
}

export async function getGroupNotes(
  groupId: string,
  page = 0,
  size = 12
): Promise<PageResponse<NoteResponse>> {
  const response = await apiClient.get(`/api/groups/${groupId}/notes`, {
    params: { page, size },
  });
  if (Array.isArray(response.data)) {
    return {
      content: response.data,
      totalPages: 1,
      totalElements: response.data.length,
      number: page,
      size: size,
    };
  }
  return response.data;
}

export async function getNote(
  groupId: string,
  noteId: string
): Promise<NoteResponse> {
  const response = await apiClient.get(`/api/groups/${groupId}/notes/${noteId}`);
  return response.data;
}

export async function createNote(
  groupId: string,
  data: CreateNoteRequest
): Promise<NoteResponse> {
  const response = await apiClient.post(`/api/groups/${groupId}/notes`, data);
  return response.data;
}

export async function updateNote(
  groupId: string,
  noteId: string,
  data: UpdateNoteRequest
): Promise<NoteResponse> {
  const response = await apiClient.patch(`/api/groups/${groupId}/notes/${noteId}`, data);
  return response.data;
}

export async function deleteNote(
  groupId: string,
  noteId: string
): Promise<void> {
  await apiClient.delete(`/api/groups/${groupId}/notes/${noteId}`);
}
