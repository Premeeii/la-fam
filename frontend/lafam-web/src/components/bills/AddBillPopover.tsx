'use client';

import { useState, useEffect } from 'react';
import { useBillCategories, useCreateBill } from '@/lib/hooks/useBills';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BillFormValues, billSchema } from '@/lib/schemas/bill';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddBillPopoverProps {
  groupId: string;
}

export function AddBillPopover({ groupId }: AddBillPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const createMutation = useCreateBill(groupId);
  const { data: categories } = useBillCategories();

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      billCategoryId: '',
      title: '',
      amount: 0,
      billMonth: new Date().toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        billCategoryId: '',
        title: '',
        amount: 0,
        billMonth: new Date().toISOString().slice(0, 10),
      });
    }
  }, [isOpen, form]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const onSubmit = (data: BillFormValues) => {
    createMutation.mutate(data, { onSuccess: handleClose });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button className="h-10 bg-blue-600 px-5 font-medium text-white hover:bg-blue-700">
            Add Bill
          </Button>
        }
      />
      <PopoverContent
        className="w-[340px] rounded-2xl border-gray-200 p-5 shadow-xl"
        align="end"
        sideOffset={12}
      >
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Add Bill
          </h3>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="billCategoryId">Category</Label>
            <select
              id="billCategoryId"
              className="border-input bg-background h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...form.register('billCategoryId')}
            >
              <option value="">Select category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id!}>
                  {cat.name}
                </option>
              ))}
            </select>
            {form.formState.errors.billCategoryId && (
              <p className="text-xs text-red-500">
                {form.formState.errors.billCategoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              className="h-10 w-full"
              id="title"
              placeholder="Bill Title"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount (THB)</Label>
            <Input
              className="h-10 w-full"
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register('amount', {
                valueAsNumber: true,
              })}
            />
            {form.formState.errors.amount && (
              <p className="text-xs text-red-500">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="billMonth">Date</Label>
            <Input
              className="h-10 w-full"
              id="billMonth"
              type="date"
              {...form.register('billMonth')}
            />
            {form.formState.errors.billMonth && (
              <p className="text-xs text-red-500">
                {form.formState.errors.billMonth.message}
              </p>
            )}
          </div>

          <div className="flex w-full items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
