'use client';

import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useMutation } from '@tanstack/react-query';
import { requestEmailChange } from '@/lib/api/user';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = Math.max(1, Math.min(2, local.length - 2));
  const masked = local.slice(0, visible) + '*'.repeat(Math.max(0, local.length - visible));
  return `${masked}@${domain}`;
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const [showEmail, setShowEmail] = useState(false);

  const requestChangeMutation = useMutation({
    mutationFn: requestEmailChange,
    onSuccess: () => {
      toast.success('Sending verification link to your email', {
        description: 'Please check your email to continue',
      });
    },
    onError: () => {
      toast.error('Failed to send verification link. Please try again.');
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-8 h-24 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  const email = user?.email || '';

  return (
    <div className="mx-auto w-full max-w-2xl p-6 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/groups')}
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Settings
        </h1>
      </div>

      {/* Accounts Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Accounts
        </h2>

        <div className="mt-4 divide-y divide-gray-200 rounded-lg dark:divide-gray-800">
          {/* Email Row */}
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Email
            </span>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {showEmail ? email : maskEmail(email)}
              </span>

              <button
                onClick={() => setShowEmail(!showEmail)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {showEmail ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>

              <Button
                size="sm"
                onClick={() => requestChangeMutation.mutate()}
                disabled={requestChangeMutation.isPending}
                className="bg-blue-600 px-4 text-white hover:bg-blue-700 dark:text-gray-100"
              >
                {requestChangeMutation.isPending ? 'Sending...' : 'Edit'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
