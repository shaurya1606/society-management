import { Card, PageShell } from '@/components/atomquest/page-shell'

type PageProps = {
    params: Promise<{ userId: string }>
}

export default async function TeamMemberPage({ params }: PageProps) {
    const { userId } = await params
    return (
        <PageShell
            title="Legacy workspace disabled"
            description="Society Maintenance Tracker module setup in progress. This legacy workspace has been disabled while the complaint-management domain is being implemented."
        >
            <Card>
                <p className="text-sm text-slate-600">
                    Legacy member workspace for {userId} has been disabled during cleanup.
                </p>
            </Card>
        </PageShell>
    )
}
