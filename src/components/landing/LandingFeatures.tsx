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
        title: 'Resident Complaint Submission',
        description:
            'Residents can easily submit maintenance requests specifying the title, category, description, and optional photo reference URL.',
    },
    {
        icon: IconReportAnalytics,
        title: 'Complaint Status Tracking',
        description:
            'Residents track their issues in real time through clear visual badges: OPEN, IN_PROGRESS, or RESOLVED, with resolution timestamps.',
    },
    {
        icon: IconLock,
        title: 'Admin Workflow Governance',
        description:
            'Admins transition status values while attaching transition notes, and update complaint urgency levels: LOW, MEDIUM, or HIGH.',
    },
    {
        icon: IconShare,
        title: 'Notices Board Announcements',
        description:
            'Management can post circular announcements to all residents, pinning important updates at the top of the feed.',
    },
    {
        icon: IconShield,
        title: 'Computed Overdue SLAs',
        description:
            'Complaints that exceed the threshold are flagged dynamically as overdue, helping administrators resolve critical items first.',
    },
    {
        icon: IconUsers,
        title: 'Role-Based Access Control',
        description:
            'Residents and administrators each see only their authorized menus, fully enforced at the Page and API endpoint levels.',
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
                        Comprehensive Complaint Tracking
                    </h2>
                    <p className="mt-4 text-slate-500 leading-relaxed">
                        A structured workflow designed to streamline society maintenance requests, improve accountability, and keep residents updated.
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
