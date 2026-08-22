import { apiClient } from "./client";
import type {components} from '@/types/api';

type LoginRequest = components['schemas']['LoginRequest'];
type RegisterRequest = components['schemas']['RegisterRequest'];

export const login = (data:LoginRequest) =>
    apiClient.post('api/auth/login', data).then((res) => res.data);

export const register = (data:RegisterRequest) =>
    apiClient.post('api/auth/register', data).then((res) => res.data);

export const joinGroup = (token: string) =>
    apiClient.post(`api/groups/join?token=${token}`);