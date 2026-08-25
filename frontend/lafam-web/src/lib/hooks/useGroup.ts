import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { components } from "@/types/api";
import { createGroup } from "../api/groups";
import type { AddGroupFormValues } from "../schemas/group";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCurrentGroup } from "../stores/currentGroup";

type GroupMemberResponse = components['schemas']['GroupMemberResponse'];

export function useGroup() {
    return useQuery<GroupMemberResponse[]>({
        queryKey: ['userGroups'],
        queryFn: () => apiClient.get('/api/groups').then((res) => res.data),
    });
}

export function useCreateGroup() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const setGroupId = useCurrentGroup(s => s.setGroupId);

    return useMutation({
        mutationFn: (data: AddGroupFormValues) => createGroup(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['userGroups'] });
            toast.success('สร้างกลุ่มสำเร็จ');
            if (data.groupId) {
                setGroupId(data.groupId);
                router.push(`/groups/${data.groupId}/dashboard`);
            }
        },
        onError: () => {
            toast.error('ไม่สามารถสร้างกลุ่มได้ กรุณาลองใหม่อีกครั้ง');
        }
    });
}
    