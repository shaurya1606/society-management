import { Badge } from '@/components/ui/badge'

export function StatusBadge({ status }: { status: string }) {
    let classes = ''
    switch (status) {
        case 'OPEN':
            classes = 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100'
            break
        case 'IN_PROGRESS':
            classes = 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100'
            break
        case 'RESOLVED':
            classes = 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100'
            break
        default:
            classes = 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100'
    }
    return (
        <Badge variant="outline" className={classes}>
            {status}
        </Badge>
    )
}
