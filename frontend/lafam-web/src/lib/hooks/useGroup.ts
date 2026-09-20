import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { components } from '@/types/api';
import {
  createGroup,
  deleteGroup,
  leaveGroup,
  joinGroup,
  previewInviteToken,
  requestGroupAvatarUploadUrl,
  uploadGroupFileToR2,
  confirmGroupAvatarUpload,
  transferOwnership,
} from '../api/groups';
import type { AddGroupFormValues } from '../schemas/group';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentGroup } from '../stores/currentGroup';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';

type GroupMemberResponse = components['schemas']['GroupMemberResponse'];

export function useGroup() {
  return useQuery<GroupMemberResponse[]>({
    queryKey: ['userGroups'],
    queryFn: () => apiClient.get('/api/groups').then((res) => res.data),
  });
}

export function useGroupMembers(groupId: string) {
  return useQuery<GroupMemberResponse[]>({
    queryKey: ['groupMembers', groupId],
    queryFn: () =>
      apiClient.get(`/api/groups/${groupId}/members`).then((res) => res.data),
    enabled: !!groupId,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setGroupId = useCurrentGroup((s) => s.setGroupId);

  return useMutation({
    mutationFn: (data: AddGroupFormValues) => createGroup(data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      toast.success('Create Group Success');
      
      const newGroupId = data.id || data.groupId;
      if (newGroupId) {
        setGroupId(newGroupId);
        router.push(`/groups/${newGroupId}/dashboard`);
      }
    },
    onError: () => {
      toast.error('Failed to create group');
    },
  });
}

export function usePreviewJoinGroup() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();

  const {
    data: previewData,
    isLoading: isPreviewLoading,
    error: previewError,
  } = useQuery({
    queryKey: ['invitePreview', token],
    queryFn: () => previewInviteToken(token!),
    enabled: !!token,
    retry: false,
  });

  const joinMutation = useMutation({
    mutationFn: (tokenToJoin: string) => joinGroup(tokenToJoin),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      toast.success('Successfully joined the group!');
      router.push(`/groups/${data.groupId}/dashboard`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to join group';
      toast.error(msg);
    },
  });

  return {
    token,
    user,
    isUserLoading,
    previewData,
    isPreviewLoading,
    previewError,
    joinMutation,
    router,
  };
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      toast.success('Successfully deleted group');
    },
    onError: () => {
      toast.error('Failed to delete group');
    },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (groupId: string) => leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      toast.success('leave group success');
      router.push('/groups');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to leave group';
      toast.error(msg);
    },
  });
}

export function useKickMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({groupId, userId}: {groupId: string, userId: string}) => {
      const response = await apiClient.delete(
        `/api/groups/${groupId}/members/${userId}`,
      );

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['groupMembers', variables.groupId],
      });
      toast.success('Member removed successfully');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to kick a member';
      toast.error(msg);
    },
  });
}

export function useUpdateGroup(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await apiClient.put(
        `/api/groups/${groupId}`,
        data,
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userGroups'],
      });
    },
  });
}

export function useGroupBookmark(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch(
        `/api/groups/${groupId}/bookmark`,
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userGroups'],
      });
    },
     onError: () => {
      toast.error('Failed to bookmark a group');
    },
  });
}

export function useTransferOwnership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      userId,
    }: {
      groupId: string;
      userId: string;
    }) => {
      return transferOwnership({ groupId, userId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['groupMembers', variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ['userGroups'],
      });
      toast.success('Ownership transferred successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to transfer ownership');
    },
  });
}
