'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { billSchema, type BillFormValues } from '@/lib/schemas/bill';
import {
  useCreateBill,
  useUpdateBill,
  useDeleteBill,
  useBillCategories,
} from '@/lib/hooks/useBills';
import type { BillResponse } from '@/lib/api/bills';
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

interface BillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  mode: 'create' | 'edit';
  initialData?: BillResponse;
}

export function BillDialog({
  isOpen,
  onClose,
  groupId,
  mode,
  initialData,
}: BillDialogProps) {
  const createMutation = useCreateBill(groupId);
  const updateMutation = useUpdateBill(groupId);
  const deleteMutation = useDeleteBill(groupId);
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
      if (mode === 'edit' && initialData) {
        form.reset({
          billCategoryId: initialData.billCategoryId || '',
          title: initialData.title || '',
          amount: initialData.amount || 0,
          billMonth:
            initialData.billMonth || new Date().toISOString().slice(0, 10),
        });
      } else {
        form.reset({
          billCategoryId: '',
          title: '',
          amount: 0,
          billMonth: new Date().toISOString().slice(0, 10),
        });
      }
    }
  }, [isOpen, mode, initialData, form]);

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const onSubmit = (data: BillFormValues) => {
    if (mode === 'create') {
      createMutation.mutate(data, { onSuccess: onClose });
    } else if (initialData?.id) {
      updateMutation.mutate(
        { billId: initialData.id, data },
        { onSuccess: onClose },
      );
    }
  };

  const handleDelete = () => {
    if (initialData?.id) {
      deleteMutation.mutate(initialData.id, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add Bill' : 'Edit Bill'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="billCategoryId">Category</Label>
            <select
              id="billCategoryId"
              className="border-input bg-background h-10 w-full rounded-md border px-3 py-2 text-sm"
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

          <div className="space-y-2">
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

          <div className="space-y-2">
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

          <div className="space-y-2">
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

          <DialogFooter className="flex w-full items-center justify-between pt-4 sm:justify-between">
            {mode === 'edit' ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {mode === 'create' ? 'Save' : 'Update'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
