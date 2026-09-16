'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addGroupSchema, type AddGroupFormValues } from '@/lib/schemas/group';
import { useCreateGroup } from '@/lib/hooks/useGroup';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateGroupDialog() {
  const [open, setOpen] = useState(false);
  const createGroupMutation = useCreateGroup();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddGroupFormValues>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: AddGroupFormValues) => {
    createGroupMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset(); // Reset form when closing
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 sm:h-10 sm:px-4">
            <Plus className="h-4 w-4" />
            <span className="inline">Create Group</span>
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="dark:bg-background border-0 bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900 dark:text-gray-100">
            Create New Group
          </DialogTitle>
          <DialogDescription className="mt-1 text-gray-500">
            Set up a new space for your group to stay connected.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-1">
          <div className="flex flex-col gap-3">
            <Label
              htmlFor="name"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Group Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Aespa, Newjeans"
              className="h-11 border-gray-200 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="w-full font-medium sm:w-auto sm:p-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createGroupMutation.isPending}
              className="w-full bg-blue-600 font-medium text-white hover:bg-blue-700 sm:w-auto sm:p-4"
            >
              {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
