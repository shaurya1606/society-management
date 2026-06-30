'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, PageShell } from '@/components/atomquest/page-shell'
import { Button } from '@/components/ui/button'
import { UserRole } from '@/lib/dbconfig/schema'
import { roleDisplayLabel } from '@/lib/atomquest/roles'

type Props = { userId: string }

export function UserDetailWorkspace({ userId }: Props) {
    const [data, setData] = useState<Record<string, unknown> | null>(null)
    const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const load = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/atomquest/admin/users/${userId}`)
            const json = await res.json()
            if (res.ok) {
                setData(json)
                setRole((json.employee?.role as UserRole) ?? UserRole.EMPLOYEE)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const loadUser = async () => {
            await load()
        }

        void loadUser()
    }, [userId])

    const saveRole = async () => {
        setSaving(true)
        try {
            const res = await fetch(`/api/atomquest/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            })
            if (res.ok) await load()
        } finally {
            setSaving(false)
        }
    }

    const employee = data?.employee as {
        name?: string | null
        email?: string
        department?: string | null
    } | null

    return (
        <PageShell
            title={employee?.name ?? 'User'}
            {...(employee?.email ? { description: employee.email } : {})}
            actions={
                <Link
                    href="/admin/users"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                    ← Back to users
                </Link>
            }
        >
            {loading ? (
                <p className="text-sm text-slate-500">Loading…</p>
            ) : (
                <div className="space-y-4">
                    <Card>
                        <h2 className="text-sm font-semibold text-slate-900 mb-3">Role</h2>
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as UserRole)}
                                className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                            >
                                {[
                                    UserRole.EMPLOYEE,
                                    UserRole.MANAGER,
                                    UserRole.ADMIN,
                                ].map((r) => (
                                    <option key={r} value={r}>
                                        {roleDisplayLabel(r)}
                                    </option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                onClick={() => void saveRole()}
                                disabled={saving}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                {saving ? 'Saving…' : 'Update role'}
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Department: {employee?.department ?? '—'}
                        </p>
                    </Card>
                    <Card>
                        <h2 className="text-sm font-semibold text-slate-900 mb-2">
                            Recent audit
                        </h2>
                        <ul className="text-sm text-slate-600 space-y-1">
                            {((data?.audit as { action: string; createdAt: Date }[]) ?? []).map(
                                (a, i) => (
                                    <li key={i}>
                                        {a.action} · {new Date(a.createdAt).toLocaleString()}
                                    </li>
                                )
                            )}
                        </ul>
                    </Card>
                </div>
            )}
        </PageShell>
    )
}

