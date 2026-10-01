import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getGroupBills,
    getMyBills,
    getBillsByCategory,
    createBill,
    updateBill,
    deleteBill,
    getAllCategories,
    type BillResponse,
    type BillCategoryResponse,
    type PageResponse,
} from "../api/bills";
import type { components } from "@/types/api";
import { toast } from "sonner";

type CreateBillRequest = components['schemas']['CreateBillRequest'];
type UpdateBillRequest = components['schemas']['UpdateBillRequest'];

export function useGroupBills(groupId: string, page = 0, size = 5) {
    return useQuery<PageResponse<BillResponse>>({
        queryKey: ['bills', groupId, page, size],
        queryFn: () => getGroupBills(groupId, page, size),
        enabled: !!groupId,
        staleTime: 0,
        refetchOnMount: 'always',
    });
}

export function useMyBills(groupId: string) {
    return useQuery<BillResponse[]>({
        queryKey: ['bills', groupId, 'me'],
        queryFn: () => getMyBills(groupId),
        enabled: !!groupId,
        staleTime: 0,
        refetchOnMount: 'always',
    });
}

export function useBillsByCategory(groupId: string, categoryId: string | null) {
    return useQuery<BillResponse[]>({
        queryKey: ['bills', groupId, 'category', categoryId],
        queryFn: () => getBillsByCategory(groupId, categoryId!),
        enabled: !!groupId && !!categoryId,
        staleTime: 0,
        refetchOnMount: 'always',
    });
}

export function useBillCategories() {
    return useQuery<BillCategoryResponse[]>({
        queryKey: ['billCategories'],
        queryFn: () => getAllCategories(),
    });
}

export function useCreateBill(groupId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBillRequest) => createBill(groupId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bills', groupId] });
            toast.success('Bill created successfully');
        },
        onError: () => {
            toast.error('Failed to create bill');
        }
    });
}

export function useUpdateBill(groupId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ billId, data }: { billId: string, data: UpdateBillRequest }) => updateBill(groupId, billId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bills', groupId] });
            toast.success('Bill updated successfully');
        },
        onError: () => {
            toast.error('Failed to update bill');
        }
    });
}

export function useDeleteBill(groupId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (billId: string) => deleteBill(groupId, billId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bills', groupId] });
            toast.success('Bill deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete bill');
        }
    });
}
