import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useRouter } from "next/navigation";
import { useCurrentGroup } from "../stores/currentGroup";
import Cookies from 'js-cookie';

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: () => apiClient.post('/api/auth/logout'),
        onSuccess: () => {
            Cookies.remove('access_token');
            useCurrentGroup.getState().setGroupId('');
            queryClient.clear();
            router.push('/login');
        },
        onError: () => {
            // Even if the backend fails, we should clear the local state to force logout
            Cookies.remove('access_token');
            useCurrentGroup.getState().setGroupId('');
            queryClient.clear();
            router.push('/login');
        }
    });
}