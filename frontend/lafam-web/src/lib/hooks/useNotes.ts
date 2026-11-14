import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGroupNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  type NoteResponse,
  type CreateNoteRequest,
  type UpdateNoteRequest,
  type PageResponse,
} from "../api/notes";
import { toast } from "sonner";

export function useGroupNotes(groupId: string, page = 0, size = 12) {
  return useQuery<PageResponse<NoteResponse>>({
    queryKey: ['notes', groupId, page, size],
    queryFn: () => getGroupNotes(groupId, page, size),
    enabled: !!groupId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useNote(groupId: string, noteId: string | null) {
  return useQuery<NoteResponse>({
    queryKey: ['note', groupId, noteId],
    queryFn: () => getNote(groupId, noteId!),
    enabled: !!groupId && !!noteId,
  });
}

export function useCreateNote(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteRequest) => createNote(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', groupId] });
      toast.success('Note created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create note';
      toast.error(message);
    },
  });
}

export function useUpdateNote(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data: UpdateNoteRequest }) =>
      updateNote(groupId, noteId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes', groupId] });
      queryClient.invalidateQueries({ queryKey: ['note', groupId, variables.noteId] });
      toast.success('Note updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update note';
      toast.error(message);
    },
  });
}

export function useDeleteNote(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => deleteNote(groupId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', groupId] });
      toast.success('Note deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete note';
      toast.error(message);
    },
  });
}
