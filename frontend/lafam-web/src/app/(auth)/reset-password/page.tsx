import ResetPasswordContent from '@/components/auth/ResetPasswordContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your LaFam account.',
  alternates: {
    canonical: '/reset-password',
  },
};

export default function ResetPasswordPage() {
  return (
    <ResetPasswordContent />
  );
}
