import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {login, register, joinGroup} from "@/lib/api/auth";
import type { LoginFormValues, RegisterFormValues } from "../schemas/auth";
import Cookies from 'js-cookie';

const PENDING_INVITE_KEY = 'pendingInviteToken';

export function useLogin() {
    const router = useRouter();
    return useMutation({
        mutationFn: (data: LoginFormValues) => login(data),
        onSuccess: async (data: any) => { // when login success
            if (data?.accessToken) {
                Cookies.set('access_token', data.accessToken, { expires: 1 }); //set access token in js-cookie
            }
            Cookies.remove('refresh_token'); // remove the legacy JavaScript-readable cookie
            const pendingToken = sessionStorage.getItem(PENDING_INVITE_KEY);
            if (pendingToken) {
                try {
                    await joinGroup(pendingToken);
                    sessionStorage.removeItem(PENDING_INVITE_KEY);
                    toast.success('เข้าร่วมกลุ่มสำเร็จ');
                }catch{
                    toast.error('Link เชิญไม่ถูกต้องหรือถูกใช้ไปแล้ว');
                }
            }
            router.push('/groups');
        },
        onError: () => toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง'),
    });
}

export function useRegister() {
    const router = useRouter();
    return useMutation({
        mutationFn: (data: RegisterFormValues) => register(data),
        onSuccess: async () => {
            toast.success('สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ');
            router.push('/login');
        },
        onError: (error: any) => {
            if(error.response?.status === 409) {
                toast.error('อีเมลนี้ถูกใช้งานแล้ว');
            }else {
                toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            }
        },
    });
}
