'use client';
import { use, useEffect, useRef, useState } from 'react';
import { useGroupAvatarUpload } from '@/lib/hooks/useAvatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import { useGroup, useUpdateGroup } from '@/lib/hooks/useGroup';
import { DangerZoneSetting } from '@/components/groups/DangerZoneSetting';
import { DeleteGroupDialog } from '@/components/groups/DeleteGroupDialog';

export default function SettingsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const resolvedParams = use(params);
  const { data: groups } = useGroup();
  const uploadMutation = useGroupAvatarUpload(resolvedParams.groupId);

  const currentGroup = groups?.find(
    (g) => g.groupId === resolvedParams.groupId,
  );

  const updateGroupMutation = useUpdateGroup(resolvedParams.groupId);

  const [groupName, setGroupName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // delete old preview (if any) to prevent memory leak
    if (preview) URL.revokeObjectURL(preview);

    // create new preview URL + store file
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleSave = async () => {
    // upload avatar (if any)
    if (selectedFile) {
      uploadMutation.mutate(
        { file: selectedFile },
        {
          onSuccess: () => {
            if (preview) URL.revokeObjectURL(preview);
            setPreview(null);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          },
        },
      );
    }

    // update groupName
    updateGroupMutation.mutate({
      name: groupName.trim(),
    });
  };

  useEffect(() => {
    if (currentGroup?.groupName) {
      setGroupName(currentGroup.groupName);
    }
  }, [currentGroup]);

  const isPending = uploadMutation.isPending || updateGroupMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-gray-900">Group Setting</h1>
      <div className="relative mt-6">
        <img
          src="/profile_cover.webp"
          alt="Profile Cover"
          className="h-48 w-full rounded-t-xl object-cover"
        />
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
          <div className="relative">
            <Avatar className="h-28 w-28 border-4 border-white shadow-md">
              <AvatarImage
                src={preview || currentGroup?.groupAvatarUrl || undefined}
              />
              <AvatarFallback className="bg-gray-300 text-3xl text-gray-600">
                {currentGroup?.groupName?.slice(0, 2).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            {currentGroup?.role === 'OWNER' && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="absolute right-1 bottom-1 rounded-full bg-blue-600 p-1.5 text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* hidden input file */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

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
              onClick={handleSave}
              disabled={updateGroupMutation.isPending || !groupName.trim()}
              className="rounded-lg bg-blue-600 px-6 py-4.5 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {updateGroupMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>
      {currentGroup?.role === 'OWNER' && (
        <DangerZoneSetting onDelete={() => setIsDeleteDialogOpen(true)} />
      )}

      <DeleteGroupDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        groupId={resolvedParams.groupId}
        groupName={currentGroup?.groupName || ''}
      />
    </div>
  );
}
