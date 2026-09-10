'use client'

import { Turnstile } from '@marsidev/react-turnstile'

interface TurnstileWidgetProps {
    onSuccess: (token: string) => void;
    onExpire?: () => void;
}

export function TurnstileWidget({onSuccess, onExpire}: TurnstileWidgetProps) {
    return (
        <Turnstile 
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={onSuccess}
        onExpire={onExpire}
        className='flex w-full justify-center'
        />
    )
}