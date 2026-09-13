import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useRouter } from "next/navigation";
import { useCurrentGroup } from "../stores/currentGroup";

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: () => {
            return apiClient.post('/api/auth/logout');
        },
        onSuccess: () => {
            useCurrentGroup.getState().setGroupId('');
            queryClient.clear();
            router.push('/login');
        },
        onError: () => {
            // Even if the backend fails, we should clear the local state to force logout
            useCurrentGroup.getState().setGroupId('');
            queryClient.clear();
            router.push('/login');
        }
    });
}
