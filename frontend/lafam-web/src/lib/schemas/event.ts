import { z } from 'zod';

export const eventSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    color: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) > new Date(data.startDate);
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

export type EventFormValues = z.infer<typeof eventSchema>;
