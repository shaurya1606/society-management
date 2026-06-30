import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageShellProps = {
    title: string
    description?: string
    actions?: ReactNode
    children: ReactNode
    className?: string
}

export function PageShell({
    title,
    description,
    actions,
    children,
    className,
}: PageShellProps) {
    return (
        <div className={cn('w-full space-y-6', className)}>
            {/* Page header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                        {title}
                    </h1>
                    {description ? (
                        <p className="mt-1 text-sm text-slate-500 max-w-2xl leading-relaxed">
                            {description}
                        </p>
                    ) : null}
                </div>
                {actions ? (
                    <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>
                ) : null}
            </div>
            {children}
        </div>
    )
}

export function Card({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <section
            className={cn(
                'rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm',
                className
            )}
        >
            {children}
        </section>
    )
}

export function CardTitle({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <h2 className={cn('text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4', className)}>
            {children}
        </h2>
    )
}
