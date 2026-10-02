'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventFormValues } from '@/lib/schemas/event';
import {
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from '@/lib/hooks/useEvents';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import type { EventResponse } from '@/lib/api/events';
import { Popover, PopoverContent } from '@/components/ui/popover';
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

  const canEdit =
    mode === 'create' ||
    (mode === 'edit' && initialData?.ownerId === currentUser?.id);

  const baseDate = selectedDate
    ? new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000,
      )
    : new Date();

  const defaultStartDate = baseDate.toISOString().slice(0, 16);
  const defaultEndDate = new Date(baseDate.getTime() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

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
          startDate: initialData.startDate
            ? new Date(initialData.startDate).toISOString().slice(0, 16)
            : defaultStartDate,
          endDate: initialData.endDate
            ? new Date(initialData.endDate).toISOString().slice(0, 16)
            : defaultEndDate,
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
        { onSuccess: () => onClose() },
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

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const validAnchor =
    anchorEl && anchorEl.isConnected ? anchorEl : undefined;

  const isMobile =
    typeof window !== 'undefined' ? window.innerWidth < 640 : false; //set mobile viewport width
  const isLowerHalf = validAnchor
    ? validAnchor.getBoundingClientRect().top >
      (typeof window !== 'undefined' ? window.innerHeight / 2 : 300) //set lower half of viewport
    : false;

  const popoverSide = isMobile ? 'top' : isLowerHalf ? 'top' : 'bottom'; //set side of popover

  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverContent
        anchor={validAnchor}
        side={popoverSide}
        align="center"
        sideOffset={isMobile ? 12 : 6} //set side offset of popover
        className="bg-popover z-50 max-h-[75vh] w-[calc(100vw-2rem)] max-w-[340px] overflow-y-auto rounded-2xl border border-gray-200 p-3.5 shadow-xl sm:max-h-[85vh] sm:max-w-[400px] sm:p-5 dark:border-gray-700"
      >
        <div className="mb-1.5">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Add Event' : 'Edit Event'}
          </h3>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5 sm:space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-xs sm:text-sm">Title</Label>
            <Input
              className="h-8 sm:h-10 text-xs sm:text-sm w-full"
              id="title"
              placeholder="Event Title"
              {...form.register('title')}
              disabled={!canEdit}
            />
            {form.formState.errors.title && (
              <p className="text-[11px] text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs sm:text-sm">Description</Label>
            <Input
              className="h-8 sm:h-10 text-xs sm:text-sm w-full"
              id="description"
              placeholder="Description (optional)"
              {...form.register('description')}
              disabled={!canEdit}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="space-y-1">
              <Label htmlFor="startDate" className="text-xs sm:text-sm">Start Date</Label>
              <Input
                className="h-8 sm:h-10 w-full text-[11px] sm:text-xs"
                id="startDate"
                type="datetime-local"
                {...form.register('startDate')}
                disabled={!canEdit}
              />
              {form.formState.errors.startDate && (
                <p className="text-[11px] text-red-500">
                  {form.formState.errors.startDate.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="endDate" className="text-xs sm:text-sm">End Date</Label>
              <Input
                className="h-8 sm:h-10 w-full text-[11px] sm:text-xs"
                id="endDate"
                type="datetime-local"
                {...form.register('endDate')}
                disabled={!canEdit}
              />
              {form.formState.errors.endDate && (
                <p className="text-[11px] text-red-500">
                  {form.formState.errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="flex items-center gap-2 sm:gap-3 space-y-1">
              <Label htmlFor="color" className="text-xs sm:text-sm">Color</Label>
              <Input
                id="color"
                type="color"
                className="h-8 w-12 sm:h-10 sm:w-14 cursor-pointer border-none bg-transparent p-1"
                {...form.register('color')}
              />
            </div>
          )}

          {mode === 'edit' && (
            <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
              Created by:{' '}
              <span className="text-gray-900 dark:text-gray-100">
                {initialData?.ownerName}
              </span>
            </div>
          )}

          <div className="flex w-full items-center justify-between pt-1.5 sm:pt-2">
            {mode === 'edit' && canEdit ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-8 text-xs sm:h-9"
                onClick={handleDelete}
                disabled={isPending}
              >
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              {canEdit ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs sm:h-9"
                    onClick={onClose}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isPending}
                    className="h-8 text-xs sm:h-9 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {mode === 'create' ? 'Save' : 'Update'}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs sm:h-9"
                  onClick={onClose}
                  disabled={isPending}
                >
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
