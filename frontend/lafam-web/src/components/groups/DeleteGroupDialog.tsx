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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-semibold">
            Confirm Delete Group
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            className="h-10 w-full"
            id="confirm"
            placeholder={`Type "${groupName}" to confirm`}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          ></Input>
        </div>
        <DialogFooter className="flex w-full items-center justify-end">
          <Button
            className="text-red-600"
            type="button"
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
