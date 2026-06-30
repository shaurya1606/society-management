import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function EmptyState({
    title,
    description,
    action,
    className,
}: {
    title: string
    description?: string
    action?: ReactNode
    className?: string
}) {
    return (
        <div
            className={cn(
                'rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center',
                className
            )}
        >
            <p className="text-sm font-semibold text-slate-700">{title}</p>
            {description ? (
                <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    {description}
                </p>
            ) : null}
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    )
}
