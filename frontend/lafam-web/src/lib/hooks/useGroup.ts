import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { components } from "@/types/api";

type GroupMemberResponse = components['schemas']['GroupMemberResponse'];

export function useGroup() {
    return useQuery<GroupMemberResponse[]>({
        queryKey: ['userGroups'],
        queryFn: () => apiClient.get('/api/groups').then((res) => res.data),
      });
}

    