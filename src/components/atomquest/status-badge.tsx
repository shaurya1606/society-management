import { Badge } from '@/components/ui/badge'
import type { GoalSheetStatus } from '@/lib/dbconfig/atomquest'
import { cn } from '@/lib/utils'

const statusStyles: Record<GoalSheetStatus, string> = {
    DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
    SUBMITTED: 'bg-amber-50 text-amber-800 border-amber-200',
    RETURNED: 'bg-orange-50 text-orange-800 border-orange-200',
    LOCKED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
}

const statusLabels: Record<GoalSheetStatus, string> = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    RETURNED: 'Returned for revision',
    LOCKED: 'Approved',
}

export function SheetStatusBadge({
    status,
    className,
}: {
    status: GoalSheetStatus
    className?: string
}) {
    return (
        <Badge
            variant="outline"
            className={cn('text-xs font-medium', statusStyles[status], className)}
        >
            {statusLabels[status]}
        </Badge>
    )
}
