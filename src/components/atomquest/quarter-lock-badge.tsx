import type { QuarterLockState } from '@/lib/atomquest/cycle-utils'
import { cn } from '@/lib/utils'

const styles: Record<QuarterLockState, string> = {
    active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    past:   'border-slate-200  bg-slate-50  text-slate-500',
    future: 'border-amber-200  bg-amber-50  text-amber-700',
    closed: 'border-red-200    bg-red-50    text-red-700',
}

export function QuarterLockBadge({
    state,
    label,
    className,
}: {
    state: QuarterLockState
    label: string
    className?: string
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium',
                styles[state],
                className
            )}
        >
            {state === 'active' && (
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            )}
            {label}
        </span>
    )
}
