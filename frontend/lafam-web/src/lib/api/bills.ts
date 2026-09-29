import { apiClient } from './client';
import type { components } from '@/types/api';

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export type BillResponse = components['schemas']['BillResponse'];
export type BillCategoryResponse = components['schemas']['BillCategoryResponse'];
type CreateBillRequest = components['schemas']['CreateBillRequest'];
type UpdateBillRequest = components['schemas']['UpdateBillRequest'];

export async function getGroupBills(groupId: string, page = 0, size = 5): Promise<PageResponse<BillResponse>> {
    const response = await apiClient.get(`/api/groups/${groupId}/bills`, {
        params: { page, size }
    });
    if (Array.isArray(response.data)) {
        return {
            content: response.data,
            totalPages: 1,
            totalElements: response.data.length,
            number: page,
            size: size
        };
    }
    return response.data;
}

export async function getMyBills(groupId: string): Promise<BillResponse[]> {
    const response = await apiClient.get(`/api/groups/${groupId}/bills/me`);
    return response.data;
}

export async function getBillsByCategory(groupId: string, categoryId: string): Promise<BillResponse[]> {
    const response = await apiClient.get(`/api/groups/${groupId}/bills/category/${categoryId}`);
    return response.data;
}

export async function createBill(groupId: string, data: CreateBillRequest): Promise<BillResponse> {
    const response = await apiClient.post(`/api/groups/${groupId}/bills`, data);
    return response.data;
}

export async function updateBill(groupId: string, billId: string, data: UpdateBillRequest): Promise<BillResponse> {
    const response = await apiClient.patch(`/api/groups/${groupId}/bills/${billId}`, data);
    return response.data;
}

export async function deleteBill(groupId: string, billId: string): Promise<void> {
    await apiClient.delete(`/api/groups/${groupId}/bills/${billId}`);
}

export async function getAllCategories(): Promise<BillCategoryResponse[]> {
    const response = await apiClient.get('/api/bills/categories');
    return response.data;
}
