'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/lib/schemas/auth';
import { useLogin } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { TurnstileWidget } from '@/components/auth/TurnstileWidget';

export default function LoginPage() {
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  return (
    <>
      <p className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
        Nice to meet you!
      </p>

      <form
        onSubmit={form.handleSubmit((data) => {
          if (!turnstileToken) {
            return; //don't notify user, just disable the button
          }
          // @ts-ignore
          loginMutation.mutate({ ...data, turnstileToken });
        })}
        className="flex flex-col gap-4"
      >
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
            className="mt-1 h-11 border-gray-200 bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-blue-100"
            placeholder="Email"
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-xs font-semibold text-gray-700"
          >
            Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="h-11 border-gray-200 bg-gray-50 pr-10 text-black placeholder:text-gray-400 focus-visible:ring-blue-100"
              placeholder="Enter password"
              {...form.register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="mt-1 mb-1 flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <TurnstileWidget
          onSuccess={(token) => {
            setTurnstileToken(token);
          }}
          onExpire={() => {
            setTurnstileToken(null);
          }}
        />

        <Button
          type="submit"
          className="h-11 rounded-lg bg-blue-600 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          disabled={loginMutation.isPending || !turnstileToken}
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign up now
        </Link>
      </p>
    </>
  );
}
