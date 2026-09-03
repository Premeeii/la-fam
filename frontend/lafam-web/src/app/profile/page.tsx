'use client';
import { useEffect, useRef, useState } from 'react';
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

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();
  const uploadMutation = useAvatarUpload();
  const queryClient = useQueryClient();

  // store preview URL for display selected image before upload
  const [preview, setPreview] = useState<string | null>(null);

  // store file object until user press save
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  // sync value from user data when loaded
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
    }
  }, [user]);
  // Mutation for update displayName and bio
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { displayName?: string; bio?: string }) => {
      const res = await apiClient.patch('/api/users/me', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('บันทึกข้อมูลโปรไฟล์สำเร็จ');
    },
    onError: () => {
      toast.error('บันทึกไม่สำเร็จ กรุณาลองใหม่');
    },
  });
  // when file is selected: create preview but not upload yet
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // delete old preview (if any) to prevent memory leak
    if (preview) URL.revokeObjectURL(preview);

    // create new preview URL + store file
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  // when Save: upload avatar (if any) + update profile
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

    // update displayName + bio
    updateProfileMutation.mutate({
      displayName: displayName.trim() || undefined,
      bio: bio.trim() || undefined,
    });
  };

  const isPending = uploadMutation.isPending || updateProfileMutation.isPending;
  const initials = user?.displayName?.charAt(0).toUpperCase() || 'U';

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 h-32 w-full animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">Profile & Visibility</h1>

      {/* Banner + Avatar */}
      <div className="relative mt-6">
        {/* Banner */}
        <img
          src="/profile_cover.webp"
          alt="Profile Cover"
          className="h-48 w-full rounded-xl object-cover"
        />
        <div className="h-32 w-full rounded-xl bg-gray-200" />
        {/* Avatar — above banner */}
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
          <div className="relative">
            <Avatar className="h-28 w-28 border-4 border-white shadow-md">
              <AvatarImage src={preview || user?.avatarUrl || undefined} />
              <AvatarFallback className="bg-gray-300 text-3xl text-gray-600">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/*Camera button - Open folder*/}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="absolute right-1 bottom-1 rounded-full bg-blue-600 p-1.5 text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
            </button>
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

      {/* About Section */}
      <div className="mt-20">
        <h2 className="text-xl font-bold text-gray-900">About</h2>
        <p className="mt-1 text-sm text-gray-500">
          Required fields are marked with an asterisk
          <span className="text-red-500">*</span>
        </p>
        <div className="mt-6 flex flex-col gap-5">
          {/* Display Name */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="displayName"
              className="text-sm font-medium text-gray-700"
            >
              Display name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="h-11 rounded-lg border-gray-200 bg-gray-50 px-4"
              required
            />
          </div>
          {/* Bio */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio
            </Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell something about yourself"
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isPending || !displayName.trim()}
            className="bg-blue-600 px-6 hover:bg-blue-700"
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
