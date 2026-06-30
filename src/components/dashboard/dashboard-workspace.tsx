'use client'

import Link from 'next/link'
import { Card, PageShell } from '@/components/atomquest/page-shell'
import { Button } from '@/components/ui/button'
import useCurrentUser from '@/lib/hooks/useCurrentUser'

export function DashboardWorkspace() {
    const user = useCurrentUser()
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

    return (
        <PageShell
            title="Welcome to Society Maintenance Tracker"
            description="Quickly report, manage, and track maintenance complaints for your housing society."
        >
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <h2 className="text-base font-semibold text-slate-900 mb-2">
                        Get Started
                    </h2>
                    <p className="text-sm text-slate-600 mb-6">
                        Need something fixed? Submit a complaint to inform the society administration. You can attach pictures and track progress live.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/complaints/new">
                            <Button>File a New Complaint</Button>
                        </Link>
                        <Link href="/complaints">
                            <Button variant="outline">My Complaints</Button>
                        </Link>
                    </div>
                </Card>

                <Card className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 mb-2">
                            Society Notices & Announcements
                        </h2>
                        <p className="text-sm text-slate-600 mb-6">
                            Stay up-to-date with society circulars, scheduled maintenance schedules, and important management updates.
                        </p>
                    </div>
                    <div>
                        <Link href="/notices">
                            <Button variant="outline" className="w-full sm:w-auto">
                                View Notices Board
                            </Button>
                        </Link>
                    </div>
                </Card>

                {isAdmin && (
                    <Card className="md:col-span-2 border-indigo-200 bg-indigo-50/20">
                        <h2 className="text-base font-semibold text-indigo-900 mb-2">
                            Administrative Overview
                        </h2>
                        <p className="text-sm text-indigo-800 mb-6">
                            You are logged in as an Administrator. Access complaints dashboard analytics, filter complaints, update statuses, and publish official announcements.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/admin/dashboard">
                                <Button>Admin Dashboard</Button>
                            </Link>
                            <Link href="/admin/complaints">
                                <Button variant="secondary">Manage All Complaints</Button>
                            </Link>
                        </div>
                    </Card>
                )}
            </div>
        </PageShell>
    )
}
