'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import {
    IconChartBar,
    IconShield,
    IconTarget,
    IconUsers,
} from '@tabler/icons-react'

type LandingHeroProps = {
    isAuthenticated: boolean
}

export function LandingHero({ isAuthenticated }: LandingHeroProps) {
    return (
        <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 bg-white">
            {/* Subtle enterprise background — no blobs, just a very faint grid */}
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                aria-hidden
            >
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                    }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    {/* Category badge */}
                    <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        Society Maintenance Tracker · Resident Complaint Platform
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
                        Structured complaint tracking.{' '}
                        <span className="text-indigo-600">
                            Efficient resolutions.
                        </span>
                    </h1>

                    <p className="mt-6 text-lg leading-relaxed text-slate-500 sm:text-xl max-w-2xl mx-auto">
                        Society Maintenance Tracker gives residents and
                        administrators a single system of record for complaints,
                        status history, and resolution updates.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        {isAuthenticated ? (
                            <Button
                                asChild
                                size="lg"
                                className="h-11 min-w-[180px] bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
                            >
                                <Link href="/dashboard">Go to Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-11 min-w-[180px] bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
                                >
                                    <Link href="/signup">Sign Up</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="h-11 min-w-[180px] border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium"
                                >
                                    <Link href="/login">Login</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Trust strip */}
                    <p className="mt-6 text-xs text-slate-400 font-medium">
                        Role-based access · Computed overdue SLA · Transactional status logs · Notices board
                    </p>
                </motion.div>

                {/* Stat cards */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-4"
                >
                    {[
                        {
                            icon: IconTarget,
                            label: 'Complaint Lifecycle',
                            value: 'OPEN to RESOLVED',
                        },
                        {
                            icon: IconChartBar,
                            label: 'Dashboard Analytics',
                            value: 'Real-time statistics',
                        },
                        {
                            icon: IconUsers,
                            label: 'Admin Workflow',
                            value: 'Priority & Status Notes',
                        },
                        {
                            icon: IconShield,
                            label: 'Governance',
                            value: 'Transactional logs',
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm"
                        >
                            <stat.icon className="mx-auto mb-3 h-5 w-5 text-indigo-600" />
                            <p className="text-xs text-slate-500 font-medium">
                                {stat.label}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
