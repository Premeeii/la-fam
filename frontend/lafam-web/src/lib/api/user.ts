import { apiClient } from "./client";

interface AvatarUploadResponse {
    uploadUrl: string;
    publicUrl: string;
    objectKey: string;
}

//request preSignedUrl for upload avatar
export async function requestAvatarUploadUrl(contentType: string): Promise<AvatarUploadResponse> {
    const res = await apiClient.post(`/api/users/me/avatar/upload-url?contentType=${encodeURIComponent(contentType)}`);
    return res.data;
}

export async function uploadFileToR2(preSignedUrl: string, file: File): Promise<void> {
    const res = await fetch(preSignedUrl, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
        },
    });
    if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
    }
}

export async function confirmAvatarUpload(objectKey: string) {
    const res = await apiClient.patch('/api/users/me/avatar/confirm', { objectKey });
    return res.data;
}