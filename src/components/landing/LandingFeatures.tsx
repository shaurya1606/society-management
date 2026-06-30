import {
    IconClipboardCheck,
    IconLock,
    IconReportAnalytics,
    IconShare,
    IconShield,
    IconUsers,
} from '@tabler/icons-react'

const features = [
    {
        icon: IconClipboardCheck,
        title: 'Structured goal sheets',
        description:
            'Employees define thrust areas, targets, and weightage with built-in validation — 100% total, max 8 goals, minimum 10% each.',
    },
    {
        icon: IconLock,
        title: 'Manager approval workflow',
        description:
            'L1 managers review, edit inline, approve, or return for rework. Approved goals lock until admin unlock.',
    },
    {
        icon: IconReportAnalytics,
        title: 'Quarterly check-ins',
        description:
            'Track planned vs actual each quarter with status updates, progress scores, and manager coaching notes.',
    },
    {
        icon: IconShare,
        title: 'Shared departmental KPIs',
        description:
            'Push common goals across teams. Recipients adjust weightage while title and targets stay aligned org-wide.',
    },
    {
        icon: IconShield,
        title: 'Full audit trail',
        description:
            'Every approval, return, and edit is logged with actor, timestamp, and change detail for governance and compliance.',
    },
    {
        icon: IconUsers,
        title: 'Role-based access control',
        description:
            'Employees, managers, and HR admins each see only what they need — enforced at every API layer.',
    },
]

export function LandingFeatures() {
    return (
        <section id="features" className="border-t border-slate-100 bg-slate-50 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-3">
                        Platform capabilities
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Built for the full performance lifecycle
                    </h2>
                    <p className="mt-4 text-slate-500 leading-relaxed">
                        From May goal-setting through Q4 achievement capture — every step of the
                        performance year, governed and auditable.
                    </p>
                </div>

                <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <article
                            key={feature.title}
                            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-indigo-200"
                        >
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100">
                                <feature.icon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                {feature.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
