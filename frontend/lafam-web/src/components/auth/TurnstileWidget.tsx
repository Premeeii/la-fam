'use client';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { forwardRef } from 'react';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: (error?: any) => void;
  onExpire?: () => void;
}

export const TurnstileWidget = forwardRef<
  TurnstileInstance,
  TurnstileWidgetProps
>(({ onSuccess, onError, onExpire }, ref) => {
  return (
    <Turnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={onSuccess}
      onExpire={onExpire}
      className="flex w-full justify-center"
      options={{ theme: 'light' }}
      ref={ref}
      onError={(error) => {
        console.error('[Turnstile Error]:', error);
        if (onError) onError(error);
        else onExpire?.(); // clear token if error
      }}
    />
  );
});

TurnstileWidget.displayName = 'TurnstileWidget';
