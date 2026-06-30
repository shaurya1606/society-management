import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'Privacy Policy — PerformIQ',
    description: 'Privacy Policy for the PerformIQ performance management platform.',
}

export default function PrivacyPage() {
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
                        Privacy Policy
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
                            <strong>Ignitia 2K26</strong>. This Privacy Policy is fictitious and
                            for presentation purposes only. No real user data is collected,
                            processed, or shared in any production capacity.
                        </p>
                    </div>
                </div>

                {/* Document */}
                <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-sm">

                    <div className="mb-8 pb-8 border-b border-slate-100">
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">
                            Privacy Policy
                        </h1>
                        <p className="text-sm text-slate-500">
                            Last updated: May 2026 · Effective for demo purposes only
                        </p>
                    </div>

                    <div className="space-y-8 text-sm text-slate-700 leading-relaxed">

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                1. Introduction
                            </h2>
                            <p>
                                PerformIQ (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting the privacy
                                and security of personal information handled through the platform.
                                This Privacy Policy explains what data we collect, how we use it,
                                and your rights in relation to your data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                2. Information We Collect
                            </h2>
                            <p className="mb-3">
                                We collect the following categories of information when you use PerformIQ:
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="py-2.5 pr-6 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-1/3">
                                                Category
                                            </th>
                                            <th className="py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Examples
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[
                                            ['Account information', 'Full name, work email address, role assignment'],
                                            ['Performance data', 'Goal titles, KPI targets, actual values, weightages, achievement status'],
                                            ['Check-in records', 'Quarterly actuals, completion dates, manager feedback notes'],
                                            ['Usage data', 'Page visits, actions taken, timestamps of approvals and submissions'],
                                            ['Authentication data', 'Hashed passwords, session tokens, OAuth provider identifiers'],
                                        ].map(([cat, ex]) => (
                                            <tr key={cat} className="hover:bg-slate-50">
                                                <td className="py-3 pr-6 font-medium text-slate-800 align-top">
                                                    {cat}
                                                </td>
                                                <td className="py-3 text-slate-600 align-top">
                                                    {ex}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                3. How We Use Your Information
                            </h2>
                            <p className="mb-3">
                                Information collected through PerformIQ is used exclusively for:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Providing and operating the performance management platform.</li>
                                <li>Enabling goal-setting, check-in, and approval workflows.</li>
                                <li>Generating performance reports and analytics for administrators.</li>
                                <li>Maintaining an audit trail of all actions for governance purposes.</li>
                                <li>Authenticating users and maintaining session security.</li>
                                <li>Sending email notifications related to account actions (e.g. password reset, goal submission confirmation).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                4. Data Sharing &amp; Disclosure
                            </h2>
                            <p className="mb-3">
                                We do not sell or rent your personal data. We may share data only in
                                the following limited circumstances:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong>Within your organisation</strong> — Managers can view
                                    their direct reports&apos; goal sheets and check-in data. Administrators
                                    can access aggregate organisation-wide data.
                                </li>
                                <li>
                                    <strong>Service providers</strong> — We may engage third-party
                                    providers (e.g., database hosting, email delivery) who process
                                    data solely on our behalf under strict confidentiality obligations.
                                </li>
                                <li>
                                    <strong>Legal requirements</strong> — Where required by law,
                                    regulation, or valid legal process.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                5. Data Retention
                            </h2>
                            <p>
                                Performance data (goal sheets, check-ins, audit logs) is retained
                                for the duration of the performance year plus a rolling 36-month
                                archive period to support year-over-year benchmarking. Account data
                                is retained while your account is active. Upon account deletion,
                                personal identifiers are removed within 30 days, though anonymised
                                aggregate data may be retained indefinitely.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                6. Data Security
                            </h2>
                            <p>
                                We implement appropriate technical and organisational measures to
                                protect your data, including password hashing, encrypted data
                                transmission (TLS), role-based access controls, and session
                                token management. While we strive to use commercially acceptable
                                means to protect your data, no method of transmission over the
                                internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                7. Cookies &amp; Tracking
                            </h2>
                            <p>
                                PerformIQ uses session cookies necessary for authentication and
                                platform operation. We do not use advertising or cross-site
                                tracking cookies. You may configure your browser to block all
                                cookies, though this may affect platform functionality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                8. Your Rights
                            </h2>
                            <p className="mb-3">
                                Depending on your jurisdiction, you may have the following rights
                                with respect to your personal data:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Access</strong> — Request a copy of the data we hold about you.</li>
                                <li><strong>Correction</strong> — Request correction of inaccurate data.</li>
                                <li><strong>Erasure</strong> — Request deletion of your personal data where legally permissible.</li>
                                <li><strong>Portability</strong> — Request your data in a structured, machine-readable format.</li>
                                <li><strong>Objection</strong> — Object to certain processing activities.</li>
                            </ul>
                            <p className="mt-3">
                                To exercise any of these rights, contact your HR administrator or
                                the PerformIQ system administrator within your organisation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                9. Third-Party Services
                            </h2>
                            <p>
                                PerformIQ supports optional sign-in via Google, GitHub, and LinkedIn
                                OAuth. If you choose to authenticate through these services, their
                                respective privacy policies also apply. We only receive the profile
                                information (name, email) necessary to create your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                10. Changes to This Policy
                            </h2>
                            <p>
                                We may update this Privacy Policy periodically. Material changes
                                will be notified via in-app banner or email. Continued use of the
                                Service following notice of changes constitutes acceptance of the
                                updated policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-3">
                                11. Contact
                            </h2>
                            <p>
                                For privacy-related enquiries, please contact your organisation&apos;s
                                HR administrator or the PerformIQ system administrator. For the
                                demo application, contact the development team through the Ignitia
                                2K26 hackathon channels.
                            </p>
                        </section>

                    </div>

                    {/* Footer rule */}
                    <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-xs text-slate-400">
                            © 2026 PerformIQ · For demonstration purposes only
                        </p>
                        <Link
                            href="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            View Terms of Service →
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    )
}
