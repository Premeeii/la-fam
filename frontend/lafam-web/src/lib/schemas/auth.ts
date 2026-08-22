import { z } from 'zod';

export const loginSchema = z.object ({
    email: z.string().email('อีเมลไม่ถูกต้อง'),
    password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
});


export const registerSchema = z.object({
    email: z.string().email('อีเมลไม่ถูกต้อง'),
    password: z.string().min(8, 'รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร'),
    displayName: z.string().min(1, 'กรุณากรอกชื่อ'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
