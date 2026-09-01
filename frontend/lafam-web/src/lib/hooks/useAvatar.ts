import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { requestAvatarUploadUrl, uploadFileToR2, confirmAvatarUpload } from '@/lib/api/user';
import { toast } from 'sonner';


const MAX_FILE_SIZE = 2 * 1024 * 1024; //2MB

export function useAvatarUpload() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ file }: { file: File }) => {
            //check file size
            if(file.size > MAX_FILE_SIZE) {
                throw new Error('File too large');
            }

            //get presigned url from backend
            const {uploadUrl, objectKey} = await requestAvatarUploadUrl(file.type);

            //upload file to R2
            await uploadFileToR2(uploadUrl, file);

            //confirm upload with backend
            return await confirmAvatarUpload(objectKey);
        },

        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['currentUser']});
            toast.success('uploadSuccess');
        },
        
        onError: (error: Error) => {
            toast.error(error.message || 'uploadFaild');
        },
    });
}