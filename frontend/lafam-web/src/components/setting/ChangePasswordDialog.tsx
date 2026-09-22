'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      await apiClient.post('/api/users/me/change-password', data);
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      resetForm();
      setOpen(false);
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const msg = error.response?.data?.message || 'Failed to change password. Please try again.';
      toast.error(msg);
    },
  });

  const passwordsMatch = newPassword === confirmPassword;
  const isValid =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length >= 8 &&
    passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogTrigger
        render={
          <Button
            size="sm"
            className="bg-blue-600 px-4 text-white hover:bg-blue-700 dark:text-gray-100"
          >
            Edit
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* Current Password */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="currentPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-lg border-gray-200 bg-gray-50 px-4 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-lg border-gray-200 bg-gray-50 px-4 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              required
              minLength={8}
            />
            {newPassword.length > 0 && newPassword.length < 8 && (
              <p className="text-xs text-red-500">
                Password must be at least 8 characters
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-lg border-gray-200 bg-gray-50 px-4 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              required
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-500">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={changePasswordMutation.isPending || !isValid}
            className="mt-2 h-11 w-full bg-blue-600 hover:bg-blue-700 dark:text-gray-100"
          >
            {changePasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
