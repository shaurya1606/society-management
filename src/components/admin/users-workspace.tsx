'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, PageShell } from '@/components/atomquest/page-shell'
import { roleDisplayLabel } from '@/lib/atomquest/roles'
import { UserRole } from '@/lib/dbconfig/schema'

type UserRow = {
    id: string
    name: string | null
    email: string
    role: UserRole
    department: string | null
    sheetStatus: string
}

export function UsersWorkspace() {
    const [users, setUsers] = useState<UserRow[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        void (async () => {
            try {
                const res = await fetch('/api/atomquest/admin/users')
                const json = await res.json()
                if (res.ok) setUsers(json.users ?? [])
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <PageShell
            title="User management"
            description="Directory of portal users, roles, and goal sheet status."
        >
            {loading ? (
                <p className="text-sm text-slate-500">Loading users…</p>
            ) : (
                <Card className="overflow-x-auto !p-0">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">
                                    Name
                                </th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">
                                    Email
                                </th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">
                                    Role
                                </th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">
                                    Department
                                </th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">
                                    Sheet
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr
                                    key={u.id}
                                    className="border-b border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/admin/users/${u.id}`}
                                            className="font-medium text-indigo-600 hover:text-indigo-800"
                                        >
                                            {u.name ?? '—'}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                                    <td className="px-4 py-3">{roleDisplayLabel(u.role)}</td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {u.department ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{u.sheetStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}
        </PageShell>
    )
}
