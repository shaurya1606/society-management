import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type LandingHeaderProps = {
    isAuthenticated: boolean
}

export function LandingHeader({ isAuthenticated }: LandingHeaderProps) {
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.jpg"
                        alt="Society Maintenance Tracker"
                        width={28}
                        height={28}
                        className="rounded-md object-contain"
                        priority
                    />
                    <span className="text-sm font-semibold tracking-tight text-slate-900">
                        Society Maintenance Tracker
                    </span>
                </Link>

                {/* Nav */}
                <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
                    <a href="#features" className="transition hover:text-slate-900">
                        Features
                    </a>
                    <a href="#how-it-works" className="transition hover:text-slate-900">
                        How it works
                    </a>
                </nav>

                {/* CTA */}
                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <Button
                            asChild
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm h-9 px-4"
                        >
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="ghost"
                                className="text-slate-600 hover:text-slate-900 text-sm h-9"
                            >
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm h-9 px-4"
                            >
                                <Link href="/signup">Get started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
