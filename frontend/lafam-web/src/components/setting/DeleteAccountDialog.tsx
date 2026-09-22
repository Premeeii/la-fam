'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { deleteAccount } from '@/lib/api/user';
import { apiClient } from '@/lib/api/client';
import { useCurrentGroup } from '@/lib/stores/currentGroup';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
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

export function DeleteAccountDialog() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const resetForm = () => {
    setPassword('');
    setConfirmText('');
  };

  const deleteMutation = useMutation({
    mutationFn: () => deleteAccount(password),
    onSuccess: async () => {
      // Logout after deletion
      try {
        await apiClient.post('/api/auth/logout');
      } catch {
        // ignore — account is already deleted
      }
      useCurrentGroup.getState().setGroupId('');
      queryClient.clear();
      router.push('/login');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const msg = error.response?.data?.message || 'Failed to delete account. Please try again.';
      toast.error(msg);
    },
  });

  const canSubmit = password.trim().length > 0 && confirmText === 'DELETE';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    deleteMutation.mutate();
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
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700
                       dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            Delete Account
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All your data
            including bills, events, and group memberships will be deleted.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="deletePassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Current Password
            </Label>
            <Input
              id="deletePassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-lg border-gray-200 bg-gray-50 px-4 text-gray-900
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="confirmDelete"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Type <span className="font-bold text-red-600">DELETE</span> to confirm
            </Label>
            <Input
              id="confirmDelete"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="h-11 rounded-lg border-gray-200 bg-gray-50 px-4 text-gray-900
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={deleteMutation.isPending || !canSubmit}
            className="mt-2 h-11 w-full bg-red-600 text-white hover:bg-red-700"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete My Account'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}