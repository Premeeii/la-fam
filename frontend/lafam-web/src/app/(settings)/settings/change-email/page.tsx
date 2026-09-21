'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { verifyEmailChangeToken, confirmEmailChange } from '@/lib/api/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';

type TokenStatus = 'loading' | 'valid' | 'invalid';

export default function ChangeEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('loading');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  // Step 2: Validate token on page load
  useEffect(() => {
    if (!token) {
      setTokenStatus('invalid');
      return;
    }

    verifyEmailChangeToken(token)
      .then(() => setTokenStatus('valid'))
      .catch(() => setTokenStatus('invalid'));
  }, [token]);

  // Step 3: Confirm email change
  const confirmMutation = useMutation({
    mutationFn: () => confirmEmailChange({ token, newEmail, password }),
    onSuccess: () => {
      setSuccess(true);
      toast.success('Change Email Success!');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const msg = error.response?.data?.message || 'Error. Please try again';
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !password.trim()) return;
    confirmMutation.mutate();
  };

  // Loading state
  if (tokenStatus === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Verifying link...
          </p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (tokenStatus === 'invalid') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
            Invalid or expired link
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please request a new link from Settings
          </p>
          <Button
            onClick={() => router.push('/settings')}
            className="mt-6 bg-blue-600 px-6 hover:bg-blue-700 dark:text-gray-100"
          >
            Go to Settings
          </Button>
        </div>
      </div>
    );
  }

  // Success
  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
            Change Email Success!
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Your email has been changed successfully!
          </p>
          <Button
            onClick={() => router.push('/settings')}
            className="mt-6 bg-blue-600 px-6 hover:bg-blue-700 dark:text-gray-100"
          >
            Go to Settings
          </Button>
        </div>
      </div>
    );
  }

  // Valid token → show form
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
            Change Email
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your new email and current password to confirm
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="newEmail"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New Email
            </Label>
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="your-new-email@example.com"
              className="h-11 rounded-lg border-gray-200 bg-gray-50 px-4 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Current Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-lg border-gray-200 bg-gray-50 px-4 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={confirmMutation.isPending || !newEmail.trim() || !password.trim()}
            className="mt-2 h-11 w-full bg-blue-600 hover:bg-blue-700 dark:text-gray-100"
          >
            {confirmMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Change Email'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
