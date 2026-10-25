import ForgotPasswordContent from '@/components/auth/ForgotPasswordContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your LaFam account password by entering your registered email address.',
  alternates: {
    canonical: '/forgot-password',
  },
};

export default function ForgotPasswordPage() {
  return (
    <ForgotPasswordContent />
  );
}
