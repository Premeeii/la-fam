import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login, register, joinGroup } from "@/lib/api/auth";
import type { LoginFormValues, RegisterFormValues } from "../schemas/auth";

const PENDING_INVITE_KEY = 'pendingInviteToken';

export function useLogin(options?: { onError?: () => void }) {
    return useMutation({
        mutationFn: (data: LoginFormValues & { turnstileToken: string }) => login(data),
        onSuccess: async () => {
            const pendingToken = sessionStorage.getItem(PENDING_INVITE_KEY);
            if (pendingToken) {
                try {
                    const res = await joinGroup(pendingToken);
                    sessionStorage.removeItem(PENDING_INVITE_KEY);
                    toast.success('เข้าร่วมกลุ่มสำเร็จ');
                    if (res?.data?.groupId) {
                        window.location.href = `/groups/${res.data.groupId}/dashboard`;
                        return;
                    }
                } catch {
                    toast.error('Link เชิญไม่ถูกต้องหรือถูกใช้ไปแล้ว');
                }
            }
            window.location.href = '/groups';
        },
        onError: () => {
            toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            options?.onError?.(); // let component reset turnstile + clear token
        }
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: (data: RegisterFormValues & { turnstileToken: string }) => register(data),
        onSuccess: async () => {
            const pendingToken = sessionStorage.getItem(PENDING_INVITE_KEY);
            if (pendingToken) {
                try {
                    const res = await joinGroup(pendingToken);
                    sessionStorage.removeItem(PENDING_INVITE_KEY);
                    toast.success('Sign up Success!');
                    if (res?.data?.groupId) {
                        window.location.href = `/groups/${res.data.groupId}/dashboard`;
                        return;
                    }
                } catch {
                    toast.error('Sign up Success! But Invalid Invite Link');
                }
            } else {
                toast.success('Sign up Success!');
            }
            window.location.href = '/groups';
        },
        onError: (error: unknown) => {
            const err = error as { response?: { status?: number } };
            if (err.response?.status === 409) {
                toast.error('Email is already used');
            } else {
                toast.error('Something went wrong. Please try again');
            }
        },
    });
}
