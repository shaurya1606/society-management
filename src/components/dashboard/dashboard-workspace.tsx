import { Card, PageShell } from '@/components/atomquest/page-shell'

export function DashboardWorkspace() {
    return (
        <PageShell
            title="Dashboard"
            description="Society Maintenance Tracker setup is in progress. The legacy workspace is temporarily replaced with neutral placeholders."
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Complaints" value="Coming soon" />
                <StatCard label="Open Complaints" value="Coming soon" />
                <StatCard label="Overdue Complaints" value="Coming soon" />
                <StatCard label="Important Notices" value="Coming soon" />
            </div>

            <Card>
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                    Setup in progress
                </h2>
                <p className="text-sm text-slate-600">
                    The legacy workspace has been neutralized while the complaint-management
                    domain is implemented.
                </p>
            </Card>
        </PageShell>
    )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>
        </div>
    )
}
