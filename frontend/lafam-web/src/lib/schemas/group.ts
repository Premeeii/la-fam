import { z } from 'zod';

export const addGroupSchema = z.object({
    name: z.string().min(1, "กรุณาระบุชื่อกลุ่ม"),
})

export type AddGroupFormValues = z.infer<typeof addGroupSchema>;