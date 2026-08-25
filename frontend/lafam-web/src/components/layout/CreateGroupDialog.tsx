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
          <Button className="hidden h-10 gap-2 rounded-lg bg-blue-600 px-4 text-white shadow-sm hover:bg-blue-700 sm:flex">
            <Plus className="h-4 w-4 fill-white" /> Create Group
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create New Group
          </DialogTitle>
          <DialogDescription className="mt-1 text-gray-500">
            Set up a new space for your group to stay connected.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="name" className="font-semibold text-gray-900">
              Group Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Aespa, Newjeans"
              className="h-11 border-gray-200 bg-gray-50/50 focus-visible:ring-blue-600"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter className="mt-8 flex flex-row-reverse gap-3 sm:flex-row sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="w-full font-medium sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createGroupMutation.isPending}
              className="w-full bg-blue-600 font-medium text-white hover:bg-blue-700 sm:w-auto"
            >
              {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
