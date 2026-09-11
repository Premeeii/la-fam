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
        mutationFn: (data: LoginFormValues & { turnstileToken: string }) => login(data as any),
        onSuccess: async (data: any) => { // when login success
            if (data?.accessToken) {
                Cookies.set('access_token', data.accessToken, { expires: 1 }); //set access token in js-cookie
            }
            Cookies.remove('refresh_token'); // remove the legacy JavaScript-readable cookie
            const pendingToken = sessionStorage.getItem(PENDING_INVITE_KEY);
            if (pendingToken) {
                try {
                    const res = await joinGroup(pendingToken);
                    sessionStorage.removeItem(PENDING_INVITE_KEY);
                    toast.success('เข้าร่วมกลุ่มสำเร็จ');
                    if (res?.data?.groupId) {
                        router.push(`/groups/${res.data.groupId}/dashboard`);
                        return;
                    }
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
        mutationFn: (data: RegisterFormValues & { turnstileToken: string }) => register(data as any),
        onSuccess: async (data: any) => {
            if (data?.accessToken) {
                Cookies.set('access_token', data.accessToken, { expires: 1 });
            }
            Cookies.remove('refresh_token');
            const pendingToken = sessionStorage.getItem(PENDING_INVITE_KEY);
            if (pendingToken) {
                try {
                    const res = await joinGroup(pendingToken);
                    sessionStorage.removeItem(PENDING_INVITE_KEY);
                    toast.success('Sign up Success!');
                    if (res?.data?.groupId) {
                        router.push(`/groups/${res.data.groupId}/dashboard`);
                        return;
                    }
                }catch{
                    toast.error('Sign up Success! But Invalid Invite Link');
                }
            } else {
                toast.success('Sign up Success!');
            }
            router.push('/groups');
        },
        onError: (error: any) => {
            if(error.response?.status === 409) {
                toast.error('Email is already used');
            }else {
                toast.error('Something went wrong. Please try again');
            }
        },
    });
}
