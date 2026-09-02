'use client';
import { use, useEffect, useRef, useState } from 'react';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useAvatarUpload } from '@/lib/hooks/useAvatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useGroup } from '@/lib/hooks/useGroup';

export default function SettingsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const resolvedParams = use(params);
  const { data: groups } = useGroup();

  const currentGroup = groups?.find(
    (g) => g.groupId === resolvedParams.groupId,
  );

  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (currentGroup?.groupName) {
      setGroupName(currentGroup.groupName);
    }
  }, [currentGroup]);

  const queryClient = useQueryClient();

  const updateGroupMutatuon = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await apiClient.put(
        `api/groups/${resolvedParams.groupId}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Group name updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: () => {
      toast.error('Failed to update group name. Please try again.');
    },
  });

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-gray-900">Group Setting</h1>
      <div className="relative mt-6">
        <img
          src="/profile_cover.webp"
          alt="Profile Cover"
          className="h-48 w-full rounded-xl object-cover"
        />
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
          <div className="relative">
            <Avatar className="h-28 w-28 border-4 border-white shadow-md">
              <AvatarImage src={currentGroup?.groupAvatarUrl || undefined} />
              <AvatarFallback className="bg-gray-300 text-3xl text-gray-600">
                {currentGroup?.groupName?.slice(0, 2).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <h2 className="text-xl font-bold text-gray-900">About</h2>
        <p className="mt-1 text-sm text-gray-500">
          Required fields are marked with an asterisk
          <span className="text-red-500">*</span>
        </p>
        <div className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
            <Label
              htmlFor="displayName"
              className="text-sm font-medium text-gray-700"
            >
              Group name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="displayName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Your display name"
              className="h-11 rounded-lg border-gray-200 bg-gray-50 px-4"
              required
              disabled={currentGroup?.role !== 'OWNER'}
            />
          </div>
        </div>
        
        {currentGroup?.role === 'OWNER' && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => {
                if (groupName.trim()) {
                  updateGroupMutatuon.mutate({ name: groupName.trim() });
                }
              }}
              disabled={updateGroupMutatuon.isPending || !groupName.trim()}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {updateGroupMutatuon.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
