import { Card, PageShell } from '@/components/atomquest/page-shell'

export default function TeamPage() {
    return (
        <PageShell
            title="Legacy workspace disabled"
            description="Society Maintenance Tracker module setup in progress. This legacy workspace has been disabled while the complaint-management domain is being implemented."
        >
            <Card>
                <p className="text-sm text-slate-600">
                    The team review workspace has been retired for this cleanup
                    phase.
                </p>
            </Card>
        </PageShell>
    )
}
