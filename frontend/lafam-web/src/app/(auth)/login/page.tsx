import LoginContent from '@/components/auth/LoginContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your LaFam account to manage your groups, appointments, and shared expenses.',
  alternates: {
    canonical: '/login',
  },
};

export default function LoginPage() {
  return (
    <LoginContent/>
  );
}
