'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api/client';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiClient.post('/api/auth/forgot-password', { email });
      setSubmitted(true);
    } catch {
      // API always returns 200 (even if email doesn't exist)
      // but handle network errors
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>

          <p className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
            Check your email
          </p>

          <p className="mb-6 text-sm text-gray-500">
            If <span className="font-medium text-gray-700">{email}</span> is
            registered, we&apos;ve sent a password reset link. The link will
            expire in 15 minutes.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
        Forgot password?
      </p>

      <p className="mb-6 text-sm text-gray-500">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label
            htmlFor="email"
            className="text-xs font-semibold text-gray-700"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 h-11 border-gray-200 bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-blue-100"
            placeholder="Enter your email"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Button
          type="submit"
          className="h-11 rounded-lg bg-blue-600 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          disabled={loading || !email}
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </p>
    </>
  );
}
