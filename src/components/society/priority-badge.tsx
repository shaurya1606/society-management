import { Badge } from '@/components/ui/badge'

export function PriorityBadge({ priority }: { priority: string }) {
    let classes = ''
    switch (priority) {
        case 'LOW':
            classes = 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100'
            break
        case 'MEDIUM':
            classes = 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100'
            break
        case 'HIGH':
            classes = 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100'
            break
        default:
            classes = 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100'
    }
    return (
        <Badge variant="outline" className={classes}>
            {priority}
        </Badge>
    )
}
