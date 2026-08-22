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

export default function RegisterPage() {
  const form = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold text-gray-900 tracking-tight mb-5">Sign up to Get Started</h1>

      <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="displayName" className="text-xs font-semibold text-gray-700">Name</Label>
          <Input 
            id="displayName" 
            className="h-11 mt-1 bg-gray-50 border-gray-200 focus-visible:ring-blue-100 placeholder:text-gray-400" 
            placeholder="example..Robert Pattinson"
            {...form.register('displayName')} 
          />
          {form.formState.errors.displayName && (
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.displayName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-xs font-semibold text-gray-700">Email</Label>
          <Input 
            id="email" 
            type="email" 
            className="h-11 mt-1 bg-gray-50 border-gray-200 focus-visible:ring-blue-100 placeholder:text-gray-400" 
            placeholder="example @gmail.com"
            {...form.register('email')} 
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="text-xs font-semibold text-gray-700">Password</Label>
          <div className="relative mt-1">
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'} 
              className="h-11 pr-10 bg-gray-50 border-gray-200 focus-visible:ring-blue-100 placeholder:text-gray-400" 
              placeholder="Enter password"
              {...form.register('password')} 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors rounded-lg" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}