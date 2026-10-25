import RegisterContent from '@/components/auth/RegisterContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a new LaFam account to start managing group appointments and shared expenses with your family and friends.',
  alternates: {
    canonical: '/register',
  },
};

export default function RegisterPage() {
  return (
    <RegisterContent/>
  );
}