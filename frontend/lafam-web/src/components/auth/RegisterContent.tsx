'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '@/lib/schemas/auth';
import { useRegister } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

import { TurnstileWidget } from '@/components/auth/TurnstileWidget';

export default function RegisterContent() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  return (
    <>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight text-gray-900">
        Sign up to Get Started
      </h1>

      <form
        onSubmit={form.handleSubmit((data) => {
          if (!turnstileToken) return;
          registerMutation.mutate({ ...data, turnstileToken });
        })}
        className="flex flex-col gap-4"
      >
        <div>
          <Label
            htmlFor="displayName"
            className="text-xs font-semibold text-gray-700"
          >
            Name
          </Label>
          <Input
            id="displayName"
            className="mt-1 h-11 border-gray-200 bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-blue-100"
            placeholder=""
            {...form.register('displayName')}
          />
          {form.formState.errors.displayName && (
            <p className="mt-1 text-xs text-red-500">
              {form.formState.errors.displayName.message}
            </p>
          )}
        </div>

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
            placeholder=""
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
              placeholder=""
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

        <TurnstileWidget
          onSuccess={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken(null)}
        />

        <Button
          type="submit"
          className="mt-2 h-11 rounded-lg bg-blue-600 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          disabled={registerMutation.isPending || !turnstileToken}
        >
          {registerMutation.isPending ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
