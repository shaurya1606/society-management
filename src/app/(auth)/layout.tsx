import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    IconChartBar,
    IconShieldCheck,
    IconTarget,
    IconUsers,
} from '@tabler/icons-react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex">
            {/* Left — enterprise branding panel */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 flex-col justify-between bg-indigo-700 px-12 py-10 relative overflow-hidden">
                {/* Subtle background texture */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                    aria-hidden
                />

                {/* Logo */}
                <div className="relative">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex items-center justify-center rounded-md bg-white p-0.5">
                            <Image
                                src="/logo.jpg"
                                alt="Society Maintenance Tracker"
                                width={28}
                                height={28}
                                className="rounded-sm object-contain"
                                priority
                            />
                        </span>
                        <span className="text-lg font-semibold text-white tracking-tight">
                            Society Maintenance Tracker
                        </span>
                    </Link>
                </div>

                {/* Main content */}
                <div className="relative space-y-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-3">
                            Enterprise HRTech
                        </p>
                        <h2 className="text-3xl font-bold text-white leading-snug">
                            Performance lifecycle management for modern
                            organisations
                        </h2>
                        <p className="mt-4 text-indigo-200 text-sm leading-relaxed">
                            Structured goal-setting, manager approval workflows,
                            quarterly check-ins, and full audit trail — all in
                            one governed platform.
                        </p>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-3 pt-2">
                        {[
                            {
                                icon: IconTarget,
                                text: 'Annual KPI goal-setting with weightage validation',
                            },
                            {
                                icon: IconChartBar,
                                text: 'Q1–Q4 check-in tracking with progress scores',
                            },
                            {
                                icon: IconUsers,
                                text: 'Manager approval & inline review workflow',
                            },
                            {
                                icon: IconShieldCheck,
                                text: 'Role-based access · Full audit trail',
                            },
                        ].map((item) => (
                            <div
                                key={item.text}
                                className="flex items-start gap-3"
                            >
                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/15">
                                    <item.icon className="h-3.5 w-3.5 text-white" />
                                </div>
                                <p className="text-sm text-indigo-100">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative">
                    <p className="text-xs text-indigo-400">
                        © {new Date().getFullYear()} Society Maintenance Tracker
                        · Resident complaint platform
                    </p>
                </div>
            </div>

            {/* Right — auth form panel */}
            <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12 sm:px-12">
                {/* Mobile logo */}
                <div className="mb-8 lg:hidden">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.jpg"
                            alt="Society Maintenance Tracker"
                            width={32}
                            height={32}
                            className="rounded-md object-contain"
                            priority
                        />
                        <span className="text-lg font-semibold text-slate-900 tracking-tight">
                            Society Maintenance Tracker
                        </span>
                    </Link>
                </div>

                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    )
}

export default AuthLayout
