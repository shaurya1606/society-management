import { Card, PageShell } from '@/components/atomquest/page-shell'

export function NotificationsWorkspace() {
    return (
        <PageShell
            title="Notifications"
            description="Notifications will appear here once the new complaint workflow is connected."
        >
            <Card>
                <p className="text-sm text-slate-500">
                    This area is reserved for future complaint status updates and reminders.
                </p>
            </Card>
        </PageShell>
    )
}

