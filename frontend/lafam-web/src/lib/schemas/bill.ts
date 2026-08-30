import { z } from 'zod';

export const billSchema = z.object({
  billCategoryId: z.string().min(1, 'Please select a category'),

  title: z.string().min(1, 'Title is required'),

  amount: z.number().positive('Amount must be greater than 0'),

  billMonth: z.string().min(1, 'Date is required'),
});

export type BillFormValues = z.infer<typeof billSchema>;
