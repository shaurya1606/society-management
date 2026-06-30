import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'Terms of Service — PerformIQ',
    description: 'Terms of Service for the PerformIQ performance management platform.',
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50">

            {/* Sticky header */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.jpg"
                            alt="PerformIQ"
                            width={26}
                            height={26}
                            className="rounded-md object-contain"
                        />
                        <span className="text-sm font-semibold tracking-tight text-slate-900">
                            PerformIQ
                        </span>
                    </Link>
                    <span className="text-xs text-slate-400 font-medium">
                        Terms of Service
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">

                {/* Demo disclaimer banner */}
                <div className="mb-10 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                    <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                    <div>
                        <p className="text-sm font-semibold text-amber-800">
                            Demo Application — Not a real legal document
                        </p>
                        <p className="mt-1 text-sm text-amber-700 leading-relaxed">
                            PerformIQ is a hackathon demonstration project built for{' '}
                            <strong>Ignitia 2K26</strong>. These Terms of Service are fictitious
                            and for presentation purposes only. They have no legal standing and
                            do not constitute a binding agreement of any kind.
                        </p>
                    </div>
                </div>

                {/* Document */}
                <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-sm prose-container">

                    <div className="mb-8 pb-8 border-b border-slate-100">
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">
                            Terms of Service
                        </h1>
                        <p className="text-sm text-slate-500">
                            Last updated: May 2026 · Effective for demo purposes only
                        </p>
                    </div>

                    <div className="space-y-8 text-sm text-slate-700 leading-relaxed">

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                1. Acceptance of Terms
                            </h2>
                            <p>
                                By accessing or using the PerformIQ platform (&quot;Service&quot;), you agree
                                to be bound by these Terms of Service. If you do not agree to these terms,
                                you may not use the Service. These terms apply to all users, including
                                employees, managers, and administrators.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                2. Description of Service
                            </h2>
                            <p>
                                PerformIQ is an enterprise performance lifecycle management platform that
                                provides structured goal-setting, KPI governance, quarterly check-ins,
                                and manager approval workflows for organisations. The Service is provided
                                on an &quot;as-is&quot; basis for demonstration and evaluation purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                3. User Accounts &amp; Access
                            </h2>
                            <p className="mb-3">
                                Access to the Service is role-based. Users are assigned one of the
                                following roles by the system administrator:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong>Employee</strong> — May submit goal sheets, enter actuals
                                    during check-in windows, and view their own performance data.
                                </li>
                                <li>
                                    <strong>Manager</strong> — May review and approve or return
                                    subordinate goal sheets, provide feedback, and view team performance.
                                </li>
                                <li>
                                    <strong>Administrator</strong> — May configure shared KPIs, manage
                                    users, view organisation-wide analytics, and export reports.
                                </li>
                            </ul>
                            <p className="mt-3">
                                You are responsible for maintaining the confidentiality of your
                                credentials and for all activities under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                4. Acceptable Use
                            </h2>
                            <p className="mb-3">
                                You agree not to use the Service to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Enter false, misleading, or fraudulent performance data.</li>
                                <li>Attempt to gain unauthorised access to other user accounts or data.</li>
                                <li>Circumvent or tamper with approval workflows or audit trails.</li>
                                <li>Use the Service for any unlawful purpose.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                5. Data &amp; Privacy
                            </h2>
                            <p>
                                Your use of the Service is also governed by our{' '}
                                <Link
                                    href="/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                                >
                                    Privacy Policy
                                </Link>
                                , which is incorporated into these Terms by reference. Performance data,
                                goal records, and check-in history are stored and associated with your
                                account. Administrators may access aggregate organisation data for
                                reporting purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                6. Intellectual Property
                            </h2>
                            <p>
                                The Service and all associated content, branding, and technology are the
                                property of the PerformIQ development team. You are granted a limited,
                                non-exclusive, non-transferable licence to use the Service solely for
                                your organisation&apos;s internal performance management purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                7. Disclaimers &amp; Limitation of Liability
                            </h2>
                            <p className="mb-3">
                                The Service is provided &quot;as is&quot; without warranties of any kind,
                                express or implied. We do not guarantee uninterrupted, error-free operation.
                            </p>
                            <p>
                                To the maximum extent permitted by law, PerformIQ and its developers
                                shall not be liable for any indirect, incidental, special, or
                                consequential damages arising from your use of the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                8. Modifications
                            </h2>
                            <p>
                                We reserve the right to update these Terms at any time. Continued use
                                of the Service after changes constitutes acceptance of the revised Terms.
                                We will endeavour to notify users of material changes via in-app notice.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                9. Governing Law
                            </h2>
                            <p>
                                These Terms are governed by the laws of India. Any disputes shall be
                                subject to the exclusive jurisdiction of the courts located in India.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                10. Contact
                            </h2>
                            <p>
                                For questions regarding these Terms, please contact the PerformIQ team
                                through your organisation&apos;s HR administrator or system contact.
                            </p>
                        </section>

                    </div>

                    {/* Footer rule */}
                    <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-xs text-slate-400">
                            © 2026 PerformIQ · For demonstration purposes only
                        </p>
                        <Link
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            View Privacy Policy →
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    )
}
