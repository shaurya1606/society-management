'use client'

import { cn } from '@/lib/utils'

type AlertBannerProps = {
    variant: 'success' | 'error' | 'info'
    children: React.ReactNode
    className?: string
}

export function AlertBanner({ variant, children, className }: AlertBannerProps) {
    return (
        <div
            role="alert"
            className={cn(
                'rounded-lg border px-4 py-3 text-sm font-medium flex items-start gap-2',
                variant === 'success' &&
                    'border-emerald-200 bg-emerald-50 text-emerald-800',
                variant === 'error' &&
                    'border-red-200 bg-red-50 text-red-800',
                variant === 'info' &&
                    'border-indigo-200 bg-indigo-50 text-indigo-800',
                className
            )}
        >
            <span
                className={cn(
                    'mt-0.5 h-4 w-4 shrink-0 rounded-full inline-block',
                    variant === 'success' && 'bg-emerald-500',
                    variant === 'error' && 'bg-red-500',
                    variant === 'info' && 'bg-indigo-500'
                )}
            />
            <span>{children}</span>
        </div>
    )
}
