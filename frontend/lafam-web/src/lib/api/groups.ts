import { apiClient } from './client';
import { AddGroupFormValues } from '../schemas/group';

export async function createGroup(data: AddGroupFormValues) {
    const response = await apiClient.post('/api/groups', data);
    return response.data;
}
