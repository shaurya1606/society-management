'use client'

import { useCallback, useEffect, useState } from 'react'
import { PageShell } from '@/components/atomquest/page-shell'
import { StatusBadge } from '@/components/society/status-badge'
import { PriorityBadge } from '@/components/society/priority-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useCurrentUser from '@/lib/hooks/useCurrentUser'

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

export default function AdminComplaintsPage() {
    const user = useCurrentUser()
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filter states
    const [filterStatus, setFilterStatus] = useState('')
    const [filterPriority, setFilterPriority] = useState('')
    const [filterCategory, setFilterCategory] = useState('')
    const [filterOverdueFirst, setFilterOverdueFirst] = useState(false)

    // Action execution states (per complaint id)
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
    const [actionMessage, setActionMessage] = useState<{ id: string; type: 'success' | 'error'; text: string } | null>(null)

    // Input states for updates per complaint
    const [updateStatusVal, setUpdateStatusVal] = useState<Record<string, string>>({})
    const [updateNoteVal, setUpdateNoteVal] = useState<Record<string, string>>({})
    const [updatePriorityVal, setUpdatePriorityVal] = useState<Record<string, string>>({})

    const fetchComplaints = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()
            if (filterStatus) params.append('status', filterStatus)
            if (filterPriority) params.append('priority', filterPriority)
            if (filterCategory.trim()) params.append('category', filterCategory.trim())
            if (filterOverdueFirst) params.append('overdueFirst', 'true')

            const url = `/api/complaints?${params.toString()}`
            const response = await fetch(url)
            if (!response.ok) {
                if (response.status === 403 || response.status === 401) {
                    setError('Unauthorized: Admin access required.')
                } else {
                    setError('Failed to fetch complaints from server.')
                }
                return
            }
            const result = await response.json()
            if (result.ok && result.data && Array.isArray(result.data.complaints)) {
                setComplaints(result.data.complaints)
                
                // Initialize update dropdown values for each complaint
                const initialStatus: Record<string, string> = {}
                const initialPriority: Record<string, string> = {}
                const initialNote: Record<string, string> = {}
                result.data.complaints.forEach((c: Complaint) => {
                    initialStatus[c.id] = c.status
                    initialPriority[c.id] = c.priority
                    initialNote[c.id] = ''
                })
                setUpdateStatusVal(prev => ({ ...initialStatus, ...prev }))
                setUpdatePriorityVal(prev => ({ ...initialPriority, ...prev }))
                setUpdateNoteVal(prev => ({ ...initialNote, ...prev }))
            } else {
                setError(result.error || 'Unexpected response format')
            }
        } catch {
            setError('An error occurred while loading complaints.')
        } finally {
            setLoading(false)
        }
    }, [filterStatus, filterPriority, filterCategory, filterOverdueFirst])

    useEffect(() => {
        if (isAdmin) {
            const timer = setTimeout(() => {
                fetchComplaints()
            }, 0)
            return () => clearTimeout(timer)
        }
        return
    }, [isAdmin, fetchComplaints])

    const handleUpdateStatus = async (id: string) => {
        const toStatus = updateStatusVal[id]
        const note = updateNoteVal[id] || ''
        if (!toStatus) return

        setActionLoading(prev => ({ ...prev, [id]: true }))
        setActionMessage(null)

        try {
            const response = await fetch(`/api/complaints/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: toStatus, note: note.trim() || undefined })
            })
            const result = await response.json()
            if (response.ok && result.ok) {
                setActionMessage({ id, type: 'success', text: 'Status updated successfully!' })
                setUpdateNoteVal(prev => ({ ...prev, [id]: '' }))
                // Refetch to see changes
                await fetchComplaints()
            } else {
                setActionMessage({ id, type: 'error', text: result.error || 'Failed to update status.' })
            }
        } catch {
            setActionMessage({ id, type: 'error', text: 'Network error while updating status.' })
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: false }))
        }
    }

    const handleUpdatePriority = async (id: string) => {
        const toPriority = updatePriorityVal[id]
        if (!toPriority) return

        setActionLoading(prev => ({ ...prev, [id]: true }))
        setActionMessage(null)

        try {
            const response = await fetch(`/api/complaints/${id}/priority`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priority: toPriority })
            })
            const result = await response.json()
            if (response.ok && result.ok) {
                setActionMessage({ id, type: 'success', text: 'Priority updated successfully!' })
                // Refetch to see changes
                await fetchComplaints()
            } else {
                setActionMessage({ id, type: 'error', text: result.error || 'Failed to update priority.' })
            }
        } catch {
            setActionMessage({ id, type: 'error', text: 'Network error while updating priority.' })
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: false }))
        }
    }

    const clearFilters = () => {
        setFilterStatus('')
        setFilterPriority('')
        setFilterCategory('')
        setFilterOverdueFirst(false)
    }

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

    return (
        <PageShell
            title="Admin Complaints Management"
            description="Review, search, and update status/priority on all complaints filed by society residents."
        >
            {/* Filters panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                    Filters
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="filter-status">Status</Label>
                        <select
                            id="filter-status"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filter-priority">Priority</Label>
                        <select
                            id="filter-priority"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="">All Priorities</option>
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filter-category">Category</Label>
                        <Input
                            id="filter-category"
                            type="text"
                            placeholder="e.g. Plumbing"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-2 h-10">
                        <input
                            id="filter-overdue"
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            checked={filterOverdueFirst}
                            onChange={(e) => setFilterOverdueFirst(e.target.checked)}
                        />
                        <Label htmlFor="filter-overdue" className="cursor-pointer">
                            Show Overdue First
                        </Label>
                    </div>
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                    <Button onClick={fetchComplaints}>Apply Filters</Button>
                    <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                </div>
            </div>

            {/* Complaints list */}
            {loading && (
                <div className="flex items-center justify-center p-12">
                    <div className="text-sm text-slate-500 animate-pulse">Loading complaints data...</div>
                </div>
            )}

            {!loading && error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            )}

            {!loading && !error && complaints.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">No complaints found</h3>
                    <p className="text-sm text-slate-500">
                        No maintenance requests match the selected filters or there are no complaints at all.
                    </p>
                </div>
            )}

            {!loading && !error && complaints.length > 0 && (
                <div className="space-y-6">
                    {complaints.map((complaint) => (
                        <div
                            key={complaint.id}
                            className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
                        >
                            {/* Card Header */}
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-base font-semibold text-slate-900 leading-snug">
                                            {complaint.title}
                                        </h3>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                            {complaint.category}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 space-y-0.5">
                                        <div>
                                            <span className="font-medium">Resident ID:</span> {complaint.residentId}
                                        </div>
                                        <div>
                                            <span className="font-medium">Complaint ID:</span> {complaint.id}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center shrink-0">
                                    <StatusBadge status={complaint.status} />
                                    <PriorityBadge priority={complaint.priority} />
                                </div>
                            </div>

                            {/* Description & Attachments */}
                            <div className="space-y-2">
                                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                    {complaint.description}
                                </p>
                                {complaint.photoUrl && (
                                    <div className="text-xs">
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
                            </div>

                            {/* Action feedback message */}
                            {actionMessage && actionMessage.id === complaint.id && (
                                <div
                                    className={`rounded-lg p-3 text-xs font-medium ${
                                        actionMessage.type === 'success'
                                            ? 'bg-green-50 text-green-800 border border-green-200'
                                            : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}
                                >
                                    {actionMessage.text}
                                </div>
                            )}

                            {/* Card Actions Panel */}
                            <div className="pt-4 border-t border-slate-100 grid gap-4 md:grid-cols-2">
                                {/* Status update flow */}
                                <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Update Status
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <select
                                                className="flex h-9 rounded-md border border-input bg-white px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex-1"
                                                value={updateStatusVal[complaint.id] || ''}
                                                onChange={(e) =>
                                                    setUpdateStatusVal(prev => ({
                                                        ...prev,
                                                        [complaint.id]: e.target.value
                                                    }))
                                                }
                                                disabled={actionLoading[complaint.id]}
                                            >
                                                <option value="OPEN">OPEN</option>
                                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                                <option value="RESOLVED">RESOLVED</option>
                                            </select>
                                            <Button
                                                size="sm"
                                                onClick={() => handleUpdateStatus(complaint.id)}
                                                disabled={actionLoading[complaint.id]}
                                            >
                                                {actionLoading[complaint.id] ? 'Updating...' : 'Update'}
                                            </Button>
                                        </div>
                                        <Input
                                            placeholder="Optional update note (e.g. Assigned to plumber)"
                                            className="text-xs h-8 bg-white"
                                            value={updateNoteVal[complaint.id] || ''}
                                            onChange={(e) =>
                                                setUpdateNoteVal(prev => ({
                                                    ...prev,
                                                    [complaint.id]: e.target.value
                                                }))
                                            }
                                            disabled={actionLoading[complaint.id]}
                                        />
                                    </div>
                                </div>

                                {/* Priority update flow */}
                                <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                                            Update Priority
                                        </h4>
                                        <div className="flex gap-2">
                                            <select
                                                className="flex h-9 rounded-md border border-input bg-white px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex-1"
                                                value={updatePriorityVal[complaint.id] || ''}
                                                onChange={(e) =>
                                                    setUpdatePriorityVal(prev => ({
                                                        ...prev,
                                                        [complaint.id]: e.target.value
                                                    }))
                                                }
                                                disabled={actionLoading[complaint.id]}
                                            >
                                                <option value="LOW">LOW</option>
                                                <option value="MEDIUM">MEDIUM</option>
                                                <option value="HIGH">HIGH</option>
                                            </select>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleUpdatePriority(complaint.id)}
                                                disabled={actionLoading[complaint.id]}
                                            >
                                                {actionLoading[complaint.id] ? 'Updating...' : 'Update'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-between text-xs text-slate-400 gap-2">
                                <span>Created: {new Date(complaint.createdAt).toLocaleString()}</span>
                                {complaint.resolvedAt && (
                                    <span className="text-green-600 font-medium">
                                        Resolved: {new Date(complaint.resolvedAt).toLocaleString()}
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
