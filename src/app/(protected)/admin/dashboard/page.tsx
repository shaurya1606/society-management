'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/atomquest/page-shell'
import { StatusBadge } from '@/components/society/status-badge'
import { PriorityBadge } from '@/components/society/priority-badge'
import { Button } from '@/components/ui/button'
import useCurrentUser from '@/lib/hooks/useCurrentUser'

type StatusCount = {
    status: string
    count: number
}

type CategoryCount = {
    category: string
    count: number
}

type LatestComplaint = {
    id: string
    title: string
    category: string
    status: string
    priority: string
    residentId: string
    residentName: string | null
    residentEmail: string | null
    createdAt: string
    resolvedAt: string | null
}

type DashboardData = {
    complaintCountsByStatus: StatusCount[]
    complaintCountsByCategory: CategoryCount[]
    overdueCount: number
    highPriorityOpenCount: number
    latestComplaints: LatestComplaint[]
}

export default function AdminDashboardPage() {
    const user = useCurrentUser()
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDashboardData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/admin/dashboard')
            if (!response.ok) {
                if (response.status === 403 || response.status === 401) {
                    setError('Unauthorized: Admin access required.')
                } else {
                    setError('Failed to fetch dashboard metrics.')
                }
                return
            }
            const result = await response.json()
            if (result.ok && result.data) {
                setData(result.data)
            } else {
                setError(result.error || 'Unexpected response format')
            }
        } catch {
            setError('An error occurred while loading dashboard metrics.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (isAdmin) {
            const timer = setTimeout(() => {
                fetchDashboardData()
            }, 0)
            return () => clearTimeout(timer)
        }
        return
    }, [isAdmin, fetchDashboardData])

    if (!user) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-sm text-slate-500 animate-pulse">Checking authentication...</div>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center max-w-xl mx-auto mt-8">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                <p className="text-sm text-red-700">
                    You do not have the required administrative permissions to access this page.
                </p>
            </div>
        )
    }

    // Get count helpers
    const getStatusCount = (status: string) => {
        if (!data) return 0
        return data.complaintCountsByStatus.find((item) => item.status === status)?.count ?? 0
    }

    return (
        <PageShell
            title="Admin Dashboard"
            description="Operational metrics and statistics for society complaint management."
            actions={
                <Link href="/admin/complaints">
                    <Button>Manage Complaints</Button>
                </Link>
            }
        >
            {loading && (
                <div className="flex items-center justify-center p-12">
                    <div className="text-sm text-slate-500 animate-pulse">Loading metrics...</div>
                </div>
            )}

            {!loading && error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            )}

            {!loading && !error && data && (
                <div className="space-y-6">
                    {/* Stat Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-sm">
                            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                                Overdue Complaints
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-red-900 tabular-nums">
                                {data.overdueCount}
                            </p>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
                            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                                High Priority Open
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-amber-900 tabular-nums">
                                {data.highPriorityOpenCount}
                            </p>
                        </div>

                        <div className="rounded-xl border border-yellow-200 bg-yellow-50/35 p-4 shadow-sm">
                            <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">
                                Open Status
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-yellow-900 tabular-nums">
                                {getStatusCount('OPEN')}
                            </p>
                        </div>

                        <div className="rounded-xl border border-blue-200 bg-blue-50/35 p-4 shadow-sm">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                                In Progress
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-blue-900 tabular-nums">
                                {getStatusCount('IN_PROGRESS')}
                            </p>
                        </div>

                        <div className="rounded-xl border border-green-200 bg-green-50/35 p-4 shadow-sm">
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">
                                Resolved
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-green-900 tabular-nums">
                                {getStatusCount('RESOLVED')}
                            </p>
                        </div>
                    </div>

                    {/* Middle Section: Category breakdown & Quick Links */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                                Complaints by Category
                            </h3>
                            {data.complaintCountsByCategory.length === 0 ? (
                                <p className="text-sm text-slate-500 py-4">No categories recorded yet.</p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {data.complaintCountsByCategory.map((cat) => (
                                        <div
                                            key={cat.category}
                                            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50"
                                        >
                                            <span className="text-sm font-medium text-slate-700">
                                                {cat.category}
                                            </span>
                                            <span className="text-sm font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-100 shadow-xs tabular-nums">
                                                {cat.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                                Quick Links
                            </h3>
                            <div className="flex flex-col gap-2">
                                <Link href="/admin/complaints?status=OPEN">
                                    <Button variant="outline" className="w-full justify-start text-left">
                                        View Open Complaints
                                    </Button>
                                </Link>
                                <Link href="/admin/complaints?overdueFirst=true">
                                    <Button variant="outline" className="w-full justify-start text-left">
                                        View Overdue Complaints
                                    </Button>
                                </Link>
                                <Link href="/notices">
                                    <Button variant="outline" className="w-full justify-start text-left">
                                        Create Notice Announcement
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Latest Complaints list */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                            Latest Complaints Activity
                        </h3>
                        {data.latestComplaints.length === 0 ? (
                            <p className="text-sm text-slate-500 py-4 text-center">No complaints recorded yet.</p>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {data.latestComplaints.map((complaint) => (
                                    <div
                                        key={complaint.id}
                                        className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-semibold text-slate-900 text-sm">
                                                    {complaint.title}
                                                </span>
                                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
                                                    {complaint.category}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                By:{' '}
                                                <span className="text-slate-600 font-medium">
                                                    {complaint.residentName || 'Unknown Resident'}
                                                </span>{' '}
                                                ({complaint.residentEmail || complaint.residentId}) • Filed on:{' '}
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center shrink-0 sm:justify-end">
                                            <StatusBadge status={complaint.status} />
                                            <PriorityBadge priority={complaint.priority} />
                                            <Link href="/admin/complaints">
                                                <Button size="sm" variant="ghost" className="text-xs">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </PageShell>
    )
}
