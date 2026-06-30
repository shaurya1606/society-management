'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/atomquest/page-shell'
import { StatusBadge } from '@/components/society/status-badge'
import { PriorityBadge } from '@/components/society/priority-badge'
import { Button } from '@/components/ui/button'

type Complaint = {
    id: string
    residentId: string
    title: string
    category: string
    description: string
    photoUrl: string | null
    status: string
    priority: string
    resolvedAt: string | null
    createdAt: string
    updatedAt: string | null
}

export default function ComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchComplaints() {
            try {
                const response = await fetch('/api/complaints')
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        setError('You are not authorized to view this page.')
                    } else {
                        setError('Failed to load complaints. Please try again.')
                    }
                    return
                }
                const result = await response.json()
                if (result.ok && result.data && Array.isArray(result.data.complaints)) {
                    setComplaints(result.data.complaints)
                } else {
                    setError(result.error || 'Unexpected response format')
                }
            } catch {
                setError('An error occurred while fetching complaints.')
            } finally {
                setLoading(false)
            }
        }

        fetchComplaints()
    }, [])

    return (
        <PageShell
            title="My Complaints"
            description="Manage and track your filed maintenance requests."
            actions={
                <Link href="/complaints/new">
                    <Button>New Complaint</Button>
                </Link>
            }
        >
            {loading && (
                <div className="flex items-center justify-center p-8">
                    <div className="text-sm text-slate-500 animate-pulse">Loading complaints...</div>
                </div>
            )}

            {!loading && error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            )}

            {!loading && !error && complaints.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-white">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">No complaints raised yet</h3>
                    <p className="text-sm text-slate-500 mb-4">Create your first maintenance request to get started.</p>
                    <Link href="/complaints/new">
                        <Button>Create Complaint</Button>
                    </Link>
                </div>
            )}

            {!loading && !error && complaints.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                    {complaints.map((complaint) => (
                        <div
                            key={complaint.id}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-slate-900 leading-snug">
                                        {complaint.title}
                                    </h3>
                                    <span className="inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                        {complaint.category}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1.5 items-end shrink-0">
                                    <StatusBadge status={complaint.status} />
                                    <PriorityBadge priority={complaint.priority} />
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 line-clamp-3">
                                {complaint.description}
                            </p>

                            {complaint.photoUrl && (
                                <div className="text-xs text-slate-500">
                                    <a
                                        href={complaint.photoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        View Attachment File
                                    </a>
                                </div>
                            )}

                            <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-between text-xs text-slate-400 gap-2">
                                <span>Filed on: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                                {complaint.resolvedAt && (
                                    <span className="text-green-600 font-medium">
                                        Resolved on: {new Date(complaint.resolvedAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageShell>
    )
}
