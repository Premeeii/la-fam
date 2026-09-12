'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // ดึง token จาก URL

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // 2. เรียก API เปลี่ยนรหัสผ่าน
      await apiClient.post('/api/auth/reset-password', {
        token,
        newPassword: data.newPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to reset password. The token might be expired.',
      );
    } finally {
      setLoading(false);
    }
  };

  // หากไม่มี Token ใน URL ให้แจ้งเตือนเลย
  if (!token) {
    return (
      <div className="flex flex-col items-center text-center">
        <p className="mb-2 text-xl font-semibold text-red-600">Invalid Link</p>
        <p className="mb-6 text-sm text-gray-500">
          The password reset link is invalid or missing the security token.
        </p>
        <Link href="/forgot-password" className="text-blue-600 hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  // 3. หน้าจอเมื่อเปลี่ยนรหัสผ่านสำเร็จ
  if (success) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <p className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
          Password Reset Successfully
        </p>
        <p className="mb-6 text-sm text-gray-500">
          Your password has been successfully updated. You can now sign in with
          your new password.
        </p>
        <Link href="/login">
          <Button className="h-11 w-full bg-blue-600 hover:bg-blue-700">
            Continue to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  // 4. หน้าจอ Form กรอกรหัสผ่านใหม่
  return (
    <>
      <p className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
        Reset your password
      </p>
      <p className="mb-6 text-sm text-gray-500">
        Please enter your new password below.
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div>
          <Label className="text-xs font-semibold text-gray-700">
            New Password
          </Label>
          <div className="relative mt-1">
            <Input
              type={showPassword ? 'text' : 'password'}
              className="h-11 bg-gray-50 pr-10 text-black placeholder:text-gray-400 focus-visible:ring-blue-100"
              placeholder="Enter new password"
              {...form.register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.newPassword && (
            <p className="mt-1 text-xs text-red-500">
              {form.formState.errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs font-semibold text-gray-700">
            Confirm Password
          </Label>
          <div className="relative mt-1">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              className="h-11 bg-gray-50 pr-10 text-black placeholder:text-gray-400 focus-visible:ring-blue-100"
              placeholder="Confirm new password"
              {...form.register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <Button
          type="submit"
          className="h-11 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </>
  );
}

// Wrap ด้วย Suspense เพราะเราใช้งาน useSearchParams()
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<div className="text-center text-gray-500">Loading...</div>}
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
