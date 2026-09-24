'use client';

import { Button } from '../ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { EventResponse } from '@/lib/api/events';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventFormValues } from '@/lib/schemas/event';
import { useCreateEvent } from '@/lib/hooks/useEvents';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverTitle,
} from '../ui/popover';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onToday: () => void;
  onNext: () => void;
  onAddEvent: () => void;
}

export function CalendarHeader({
  currentDate,
  onPrev,
  onToday,
  onNext,
  onAddEvent,
}: CalendarHeaderProps) {
  const params = useParams();
  const groupId = params.groupId as string;
  const createMutation = useCreateEvent(groupId);
  
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const defaultStartDate = new Date().toISOString().slice(0, 16);
  const defaultEndDate = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

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

  const onSubmit = (data: EventFormValues) => {
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };
    createMutation.mutate(formattedData, {
      onSuccess: () => {
        setIsPopoverOpen(false);
        form.reset();
      },
    });
  };

  return (
    <div className="flex items-start justify-between gap-2 border-b border-gray-200 p-4 sm:items-center sm:p-6 dark:border-gray-700">
      <h1 className="w-24 min-w-0 shrink text-xl leading-tight font-semibold wrap-break-word text-gray-900 sm:w-auto sm:text-2xl dark:text-gray-100">
        {format(currentDate, 'MMMM yyyy')}
      </h1>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            onClick={onPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-medium text-gray-700 sm:px-3 sm:text-sm dark:text-gray-300"
            onClick={onToday}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Popover open={isPopoverOpen} onOpenChange={(open) => {
          setIsPopoverOpen(open);
          if (open) {
            form.reset({
              title: '',
              description: '',
              startDate: new Date().toISOString().slice(0, 16),
              endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
              color: '#3b82f6',
            });
          }
        }}>
          <PopoverTrigger
            render={
              <Button
                className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-3 text-white hover:bg-blue-700 sm:px-4"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add event</span>
                <span className="sm:hidden">Add</span>
              </Button>
            }
          />
          <PopoverContent
            className="w-[340px] rounded-2xl border-gray-200 p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900"
            align="end"
            sideOffset={12}
          >
            <PopoverHeader>
              <PopoverTitle>Add Event</PopoverTitle>
            </PopoverHeader>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  className="h-9 w-full"
                  id="title"
                  placeholder="Event Title"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  className="h-9 w-full"
                  id="description"
                  placeholder="Description (optional)"
                  {...form.register('description')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    className="h-9 w-full"
                    id="startDate"
                    type="datetime-local"
                    {...form.register('startDate')}
                  />
                  {form.formState.errors.startDate && (
                    <p className="text-xs text-red-500">{form.formState.errors.startDate.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    className="h-9 w-full"
                    id="endDate"
                    type="datetime-local"
                    {...form.register('endDate')}
                  />
                  {form.formState.errors.endDate && (
                    <p className="text-xs text-red-500">{form.formState.errors.endDate.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  className="h-9 w-16 border-none bg-transparent p-1 cursor-pointer"
                  {...form.register('color')}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPopoverOpen(false)}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
