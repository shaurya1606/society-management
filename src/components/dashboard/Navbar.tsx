'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signOutUser } from '@/lib/helpers/signOut'
import { UserButton } from '../../lib/helpers/log-out-button'
import { cn } from '@/lib/utils'

function navLinkClass(active: boolean) {
    return cn(
        'text-sm transition-colors px-3 py-2 rounded-md font-medium',
        active
            ? 'text-indigo-700 bg-indigo-50'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    )
}

const Navbar = () => {
    const { data: session } = useSession()
    const pathname = usePathname()
    const home = '/dashboard'

    return (
        <nav className="w-full sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href={session ? home : '/'}
                            className="flex items-center gap-2 shrink-0"
                        >
                            <Image
                                src="/logo.jpg"
                                alt="Society Maintenance Tracker"
                                width={28}
                                height={28}
                                className="rounded-md object-contain"
                                priority
                            />
                            <span className="text-sm font-semibold text-slate-900 tracking-tight">
                                Society Maintenance Tracker
                            </span>
                        </Link>
                    </div>

                    {/* Nav links */}
                    <div className="flex items-center gap-1">
                        <Link
                            href="/dashboard"
                            className={navLinkClass(pathname === '/dashboard')}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/complaints"
                            className={navLinkClass(pathname === '/complaints')}
                        >
                            My Complaints
                        </Link>
                        <Link
                            href="/complaints/new"
                            className={navLinkClass(pathname === '/complaints/new')}
                        >
                            New Complaint
                        </Link>
                        {session?.user?.role &&
                            (session.user.role === 'ADMIN' ||
                                session.user.role === 'SUPER_ADMIN') && (
                                <Link
                                    href="/admin/complaints"
                                    className={navLinkClass(
                                        pathname === '/admin/complaints'
                                    )}
                                >
                                    Admin Complaints
                                </Link>
                            )}
                        <Link
                            href="/settings"
                            className={navLinkClass(pathname === '/settings')}
                        >
                            Settings
                        </Link>
                    </div>

                    {/* User actions */}
                    <div className="flex items-center gap-2">
                        <UserButton />
                        <button
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-md px-3 py-1.5 transition-colors bg-white hover:bg-slate-50"
                            onClick={signOutUser}
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
