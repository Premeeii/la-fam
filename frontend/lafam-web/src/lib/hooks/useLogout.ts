import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useRouter } from "next/navigation";
import { useCurrentGroup } from "../stores/currentGroup";

export function useLogout() {
    const router = useRouter();
    return useMutation({
        mutationFn: () => apiClient.post('/api/auth/logout'),
        onSuccess: () => {
            useCurrentGroup.getState().setGroupId('');
            router.push('/login');
        },
    });
}