'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useLeaveGroup } from '@/lib/hooks/useGroup';
import { useRouter } from 'next/navigation';

interface LeaveGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupId: string;
}

export function LeaveGroupDialog({
  isOpen,
  onClose,
  groupName,
  groupId,
}: LeaveGroupDialogProps) {
  const leaveGroupMutation = useLeaveGroup();
  const router = useRouter();
  const isPending = leaveGroupMutation.isPending;

  const handleLeaveGroup = async () => {
    leaveGroupMutation.mutate(groupId, {
      onSuccess: () => {
        router.push('/groups');
      },
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-sm">
        <DialogHeader>
          <DialogTitle className="font-medium">
            Leave Group?
          </DialogTitle>
        </DialogHeader>
        <div className=" text-gray-500">
          <p>Are you sure you want to leave {groupName}?</p>
        </div>
        <DialogFooter className="flex w-full flex-row justify-center gap-2 md:justify-end">
            <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-20 h-10"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-11 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleLeaveGroup}
          >
            Leave
          </Button>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
