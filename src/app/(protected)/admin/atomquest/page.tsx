import { Card, PageShell } from '@/components/atomquest/page-shell'

export default async function AdminAtomquestPage() {
    return (
        <PageShell
            title="Legacy workspace disabled"
            description="Society Maintenance Tracker module setup in progress. This legacy workspace has been disabled while the complaint-management domain is being implemented."
        >
            <Card>
                <p className="text-sm text-slate-600">
                    The legacy admin workspace is intentionally inactive for this phase.
                </p>
            </Card>
        </PageShell>
    )
}
