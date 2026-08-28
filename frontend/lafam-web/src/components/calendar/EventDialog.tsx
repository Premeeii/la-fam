'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventFormValues } from '@/lib/schemas/event';
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/lib/hooks/useEvents';
import { EventResponse } from '@/lib/api/events';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  mode: 'create' | 'edit';
  initialData?: EventResponse; //old event when edit
  selectedDate?: Date; //date when click in calendar
}

export function EventDialog({ //get props
  isOpen,
  onClose,
  groupId,
  mode,
  initialData,
  selectedDate,
}: EventDialogProps) {
  //api hook from events.ts
  const createMutation = useCreateEvent(groupId);
  const updateMutation = useUpdateEvent(groupId);
  const deleteMutation = useDeleteEvent(groupId);

  //date when click in calendar
  const defaultStartDate = selectedDate
    ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16);

  const defaultEndDate = selectedDate
    ? new Date(selectedDate.getTime() + 60 * 60 * 1000 - selectedDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    : new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

  //create event form with react hook form
  const form = useForm<EventFormValues>({ 
    resolver: zodResolver(eventSchema), //schema for validation
    defaultValues: { //default values when open form
      title: '',
      description: '',
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      color: '#3b82f6', 
    },
  });

  useEffect(() => { //when dialog open
    if (isOpen) {
      if (mode === 'edit' && initialData) { //when edit
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
    // Format dates to ISO with timezone for backend
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Event' : 'Edit Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Event Title" {...form.register('title')} />
            {form.formState.errors.title && (
              <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Description (optional)" {...form.register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="datetime-local" {...form.register('startDate')} />
              {form.formState.errors.startDate && (
                <p className="text-xs text-red-500">{form.formState.errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="datetime-local" {...form.register('endDate')} />
              {form.formState.errors.endDate && (
                <p className="text-xs text-red-500">{form.formState.errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-2">
              <Input id="color" type="color" className="w-15 h-10 p-1" {...form.register('color')} />
            </div>
          </div>

          <DialogFooter className="pt-4 flex justify-between sm:justify-between items-center w-full">
            {mode === 'edit' ? (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
                Delete
              </Button>
            ) : (
                <div /> // placeholder for flex space-between
            )}
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                {mode === 'create' ? 'Save' : 'Update'}
                </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
