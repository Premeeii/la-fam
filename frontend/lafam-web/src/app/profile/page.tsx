'use client';

import { useRef, useState } from 'react';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useAvatarUpload } from '@/lib/hooks/useAvatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

export default function ProfilePage() {
  const { data: user } = useCurrentUser();
  const uploadMutation = useAvatarUpload();

  // เก็บ preview URL สำหรับแสดงรูปที่เลือกไว้ก่อนอัปโหลด
  const [preview, setPreview] = useState<string | null>(null);

  // เก็บ File object ไว้รอจนกว่าผู้ใช้จะกด Save
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * เมื่อผู้ใช้เลือกไฟล์:
   * แค่สร้าง preview แล้วเก็บ file ไว้ — ยังไม่อัปโหลด
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ลบ preview เก่า (ถ้ามี) เพื่อกัน memory leak
    if (preview) URL.revokeObjectURL(preview);

    // สร้าง preview URL ใหม่ + เก็บ file ไว้รอ
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  /**
   * เมื่อกด Save: เริ่มอัปโหลดจริง
   */
  const handleSave = () => {
    if (!selectedFile) return;

    uploadMutation.mutate({ file: selectedFile }, {
      onSuccess: () => {
        // อัปโหลดสำเร็จ → ล้าง preview กับ file ออก
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setSelectedFile(null);
      },
      onError: () => {
        // อัปโหลดไม่สำเร็จ → ยังเก็บ preview ไว้ให้กด Save ลองใหม่ได้
      },
    });
  };

  /**
   * เมื่อกด Cancel: ยกเลิกการเลือกรูป กลับไปแสดงรูปเดิม
   */
  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setSelectedFile(null);
    // reset input เพื่อให้เลือกไฟล์เดิมซ้ำได้
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const initials = user?.displayName?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar พร้อมปุ่มกดเพื่อเลือกไฟล์ */}
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={preview || user?.avatarUrl || undefined} />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* ปุ่มกล้องเล็กๆ มุมล่างขวาของ Avatar */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-1.5 text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      {/* Input file ที่ซ่อนไว้ */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ปุ่ม Save / Cancel — แสดงเฉพาะเมื่อมีรูปที่เลือกไว้ */}
      {selectedFile && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={uploadMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={uploadMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {uploadMutation.isPending ? 'กำลังอัปโหลด...' : 'Save'}
          </Button>
        </div>
      )}
    </div>
  );
}
