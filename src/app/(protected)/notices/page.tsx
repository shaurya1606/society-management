'use client'

import { useCallback, useEffect, useState } from 'react'
import { PageShell } from '@/components/atomquest/page-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useCurrentUser from '@/lib/hooks/useCurrentUser'

type Notice = {
    id: string
    title: string
    body: string
    isImportant: boolean
    createdById: string
    createdAt: string
    updatedAt: string | null
}

export default function NoticesPage() {
    const user = useCurrentUser()
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

    const [notices, setNotices] = useState<Notice[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Notice Form states
    const [title, setTitle] = useState('')
    const [bodyContent, setBodyContent] = useState('')
    const [isImportant, setIsImportant] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState(false)

    const fetchNotices = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/notices')
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    setError('Unauthorized: Log in to view notices.')
                } else {
                    setError('Failed to fetch society notices.')
                }
                return
            }
            const result = await response.json()
            if (result.ok && result.data && Array.isArray(result.data.notices)) {
                setNotices(result.data.notices)
            } else {
                setError(result.error || 'Unexpected response format')
            }
        } catch {
            setError('An error occurred while loading notices.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchNotices()
        }, 0)
        return () => clearTimeout(timer)
    }, [fetchNotices])

    const handleCreateNotice = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormLoading(true)
        setFormError(null)
        setFormSuccess(false)

        if (!title.trim() || !bodyContent.trim()) {
            setFormError('Please fill in all required fields.')
            setFormLoading(false)
            return
        }

        try {
            const response = await fetch('/api/notices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    body: bodyContent.trim(),
                    isImportant,
                }),
            })
            const result = await response.json()
            if (response.ok && result.ok) {
                setFormSuccess(true)
                setTitle('')
                setBodyContent('')
                setIsImportant(false)
                // Refetch notices list
                await fetchNotices()
            } else {
                setFormError(result.error || 'Failed to publish notice. Access Denied.')
            }
        } catch {
            setFormError('Network error while publishing notice.')
        } finally {
            setFormLoading(false)
        }
    }

    return (
        <PageShell
            title="Society Announcements & Notices"
            description="View official statements, updates, and safety notices from society management."
        >
            <div className="grid gap-6 md:grid-cols-3 items-start">
                {/* Notices List Section */}
                <div className="md:col-span-2 space-y-4">
                    {loading && (
                        <div className="flex items-center justify-center p-8">
                            <div className="text-sm text-slate-500 animate-pulse">Loading notices board...</div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                            {error}
                        </div>
                    )}

                    {!loading && !error && notices.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-white">
                            <p className="text-sm text-slate-500">No announcements published yet.</p>
                        </div>
                    )}

                    {!loading && !error && notices.length > 0 && (
                        <div className="space-y-4">
                            {notices.map((notice) => (
                                <div
                                    key={notice.id}
                                    className={`rounded-xl border bg-white p-5 shadow-sm space-y-3 relative overflow-hidden ${
                                        notice.isImportant
                                            ? 'border-amber-400 bg-amber-50/10'
                                            : 'border-slate-200'
                                    }`}
                                >
                                    {notice.isImportant && (
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
                                    )}
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-semibold text-slate-900 text-base leading-tight">
                                            {notice.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {notice.isImportant && (
                                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-semibold text-2xs uppercase">
                                                    Important
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                                        {notice.body}
                                    </p>
                                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-400">
                                        Published on: {new Date(notice.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Notice Sidebar (Admin only) */}
                {isAdmin && (
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                            Publish New Notice
                        </h3>
                        <form onSubmit={handleCreateNotice} className="space-y-4">
                            {formError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                                    {formError}
                                </div>
                            )}

                            {formSuccess && (
                                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-800">
                                    Notice published successfully!
                                </div>
                            )}

                            <div className="space-y-1">
                                <Label htmlFor="notice-title" className="text-xs">Title <span className="text-red-500">*</span></Label>
                                <Input
                                    id="notice-title"
                                    placeholder="e.g. Scheduled Power Outage"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    disabled={formLoading}
                                    className="h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="notice-body" className="text-xs">Body Message <span className="text-red-500">*</span></Label>
                                <textarea
                                    id="notice-body"
                                    rows={5}
                                    placeholder="Announcement details..."
                                    value={bodyContent}
                                    onChange={(e) => setBodyContent(e.target.value)}
                                    required
                                    disabled={formLoading}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    id="notice-important"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={isImportant}
                                    onChange={(e) => setIsImportant(e.target.checked)}
                                    disabled={formLoading}
                                />
                                <Label htmlFor="notice-important" className="cursor-pointer text-xs">
                                    Mark as Important (Pins to top)
                                </Label>
                            </div>

                            <Button type="submit" className="w-full h-9 text-xs" disabled={formLoading}>
                                {formLoading ? 'Publishing...' : 'Publish Announcement'}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </PageShell>
    )
}
