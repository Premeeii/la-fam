'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventFormValues } from '@/lib/schemas/event';
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/lib/hooks/useEvents';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import type { EventResponse } from '@/lib/api/events';
import {
  Popover,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EventPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  mode: 'create' | 'edit';
  initialData?: EventResponse;
  selectedDate?: Date;
  anchorEl?: HTMLElement | null;
}

export function EventPopover({
  isOpen,
  onClose,
  groupId,
  mode,
  initialData,
  selectedDate,
  anchorEl,
}: EventPopoverProps) {
  const createMutation = useCreateEvent(groupId);
  const updateMutation = useUpdateEvent(groupId);
  const deleteMutation = useDeleteEvent(groupId);
  const { data: currentUser } = useCurrentUser();

  const canEdit = mode === 'create' || (mode === 'edit' && initialData?.ownerId === currentUser?.id);

  const baseDate = selectedDate
    ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
    : new Date();

  const defaultStartDate = baseDate.toISOString().slice(0, 16);
  const defaultEndDate = new Date(baseDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      color: '#3b82f6',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        form.reset({
          title: initialData.title || '',
          description: initialData.description || '',
          startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : defaultStartDate,
          endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : defaultEndDate,
          color: initialData.color || '#3b82f6',
        });
      } else {
        form.reset({
          title: '',
          description: '',
          startDate: defaultStartDate,
          endDate: defaultEndDate,
          color: '#3b82f6',
        });
      }
    }
  }, [isOpen, mode, initialData, selectedDate, form]);

  const onSubmit = (data: EventFormValues) => {
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };

    if (mode === 'create') {
      createMutation.mutate(formattedData, {
        onSuccess: () => onClose(),
      });
    } else if (mode === 'edit' && initialData?.id) {
      updateMutation.mutate(
        { eventId: initialData.id, data: formattedData },
        { onSuccess: () => onClose() }
      );
    }
  };

  const handleDelete = () => {
    if (initialData?.id) {
      if (confirm('Are you sure you want to delete this event?')) {
        deleteMutation.mutate(initialData.id, {
          onSuccess: () => onClose(),
        });
      }
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverContent
        anchor={anchorEl || undefined}
        side="bottom"
        align="center"
        sideOffset={8}
        className="w-[360px] sm:w-[400px] p-5 rounded-2xl bg-popover border border-gray-200 dark:border-gray-700 shadow-xl z-50"
      >
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Add Event' : 'Edit Event'}
          </h3>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              className="w-full h-10"
              id="title"
              placeholder="Event Title"
              {...form.register('title')}
              disabled={!canEdit}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              className="w-full h-10"
              id="description"
              placeholder="Description (optional)"
              {...form.register('description')}
              disabled={!canEdit}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                className="w-full h-10 text-xs"
                id="startDate"
                type="datetime-local"
                {...form.register('startDate')}
                disabled={!canEdit}
              />
              {form.formState.errors.startDate && (
                <p className="text-xs text-red-500">{form.formState.errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                className="w-full h-10 text-xs"
                id="endDate"
                type="datetime-local"
                {...form.register('endDate')}
                disabled={!canEdit}
              />
              {form.formState.errors.endDate && (
                <p className="text-xs text-red-500">{form.formState.errors.endDate.message}</p>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="space-y-1.5 flex items-center gap-3">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                className="w-14 h-10 p-1 border-none bg-transparent cursor-pointer"
                {...form.register('color')}
              />
            </div>
          )}

          {mode === 'edit' && (
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Created by: <span className="text-gray-900 dark:text-gray-100">{initialData?.ownerName}</span>
            </div>
          )}

          <div className="pt-2 flex justify-between items-center w-full">
            {mode === 'edit' && canEdit ? (
              <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              {canEdit ? (
                <>
                  <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {mode === 'create' ? 'Save' : 'Update'}
                  </Button>
                </>
              ) : (
                <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPending}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
