import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { components } from "@/types/api";

type UserResponse = components['schemas']['UserResponse'];

export function useCurrentUser() {
    return useQuery<UserResponse>({
        queryKey: ['currentUser'],
        queryFn: () => apiClient.get('/api/users/me').then(res => res.data),
        retry: false,
        staleTime: 1000 * 60 * 15,
    })
}