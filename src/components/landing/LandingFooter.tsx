import Link from 'next/link'
import Image from 'next/image'

export function LandingFooter() {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-slate-200 bg-slate-900 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center rounded-md bg-white p-0.5">
                            <Image
                                src="/logo.jpg"
                                alt="Society Maintenance Tracker"
                                width={24}
                                height={24}
                                className="rounded-sm object-contain"
                            />
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                Society Maintenance Tracker
                            </p>
                            <p className="text-xs text-slate-400">
                                Resident complaint platform
                            </p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-6 text-sm text-slate-400">
                        <Link
                            href="/login"
                            className="hover:text-white transition-colors"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/signup"
                            className="hover:text-white transition-colors"
                        >
                            Get started
                        </Link>
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-800 pt-6 text-center">
                    <p className="text-xs text-slate-500">
                        © {year} Society Maintenance Tracker · Built for
                        resident service operations
                    </p>
                </div>
            </div>
        </footer>
    )
}
