import './globals.css'
import { Poppins } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
    title: '404 — Page not found · Society Maintenance Tracker',
    description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
    return (
        <html lang="en" className={poppins.variable}>
            <body className="font-[family-name:var(--font-poppins)] antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col items-center justify-center px-4 py-16">
                {/* Society Maintenance Tracker logo */}
                <Link href="/" className="flex items-center gap-2 mb-12">
                    <Image
                        src="/logo.jpg"
                        alt="Society Maintenance Tracker"
                        width={32}
                        height={32}
                        className="rounded-md object-contain"
                        priority
                    />
                    <span className="text-sm font-semibold tracking-tight text-slate-900">
                        Society Maintenance Tracker
                    </span>
                </Link>

                {/* Main card */}
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
                    {/* 404 badge */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 mb-6">
                        <span className="text-2xl font-bold text-indigo-600 leading-none">
                            404
                        </span>
                    </div>

                    <h1 className="text-xl font-semibold text-slate-900 mb-2">
                        Page not found
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-xs mx-auto">
                        The page you&apos;re looking for doesn&apos;t exist or
                        has been moved. Check the URL or navigate back.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/"
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                        >
                            Go to home
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                            Go to dashboard
                        </Link>
                    </div>
                </div>

                {/* Help text */}
                <p className="mt-8 text-xs text-slate-400">
                    If you believe this is an error, please contact your
                    administrator.
                </p>
            </body>
        </html>
    )
}
