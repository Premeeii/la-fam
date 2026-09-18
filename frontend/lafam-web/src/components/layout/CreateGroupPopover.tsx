'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addGroupSchema, type AddGroupFormValues } from '@/lib/schemas/group';
import { useCreateGroup } from '@/lib/hooks/useGroup';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateGroupPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const createGroupMutation = useCreateGroup();

  const form = useForm<AddGroupFormValues>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: '',
      });
    }
  }, [isOpen, form]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const onSubmit = (data: AddGroupFormValues) => {
    createGroupMutation.mutate(data, { onSuccess: handleClose });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 sm:h-10 sm:px-4">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Group</span>
          </Button>
        }
      />
      <PopoverContent
        className="w-[340px] rounded-2xl border-gray-200 p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900"
        align="end"
        sideOffset={12}
      >
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Create New Group
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Set up a new space for your group to stay connected.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              className="h-10 w-full"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="flex w-full items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={createGroupMutation.isPending}
              size="lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createGroupMutation.isPending}
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
