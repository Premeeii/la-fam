'use client';

import { useState } from 'react';
import { useDeleteGroup } from '@/lib/hooks/useGroup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

interface DeleteGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupId: string;
}

export function DeleteGroupDialog({
  isOpen,
  onClose,
  groupName,
  groupId,
}: DeleteGroupDialogProps) {
  const deleteMutation = useDeleteGroup();
  const isPending = deleteMutation.isPending;
  const router = useRouter();

  const [confirmText, setConfirmText] = useState('');

  const handleDeleteClick = async () => {
    deleteMutation.mutate(groupId, {
        onSuccess: () => {
            router.push('/groups');
        }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-background border-0">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-gray-900 dark:text-gray-100 font-bold">Delete Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center font-medium text-gray-900 dark:text-gray-100"
            placeholder={`Type "${groupName}" to confirm`}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          ></Input>
        </div>
        <DialogFooter className="flex w-full items-center justify-end">
          <Button
            className="flex-1 h-11 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            variant="outline"
            disabled={isPending || confirmText !== groupName}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
