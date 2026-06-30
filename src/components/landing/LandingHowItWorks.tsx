const steps = [
    {
        step: '01',
        title: 'Raise a complaint',
        description:
            'Residents submit a complaint with category, description, and optional photo. The request enters the tracking queue immediately.',
    },
    {
        step: '02',
        title: 'Admin review & priority',
        description:
            'Admins review complaints, assign priority, and move items through open, in progress, and resolved states.',
    },
    {
        step: '03',
        title: 'Status history',
        description:
            'Every status change is recorded with timestamp, actor, and optional note so residents can track the full history.',
    },
    {
        step: '04',
        title: 'Notices and alerts',
        description:
            'Admins post important notices, and residents can read pinned critical updates on the Notices Board.',
    },
]

export function LandingHowItWorks() {
    return (
        <section
            id="how-it-works"
            className="border-t border-slate-100 bg-white py-20 sm:py-28"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-3">
                        Process
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        How it works
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-slate-500 leading-relaxed">
                        A clear workflow for residents and admins across the
                        complaint lifecycle.
                    </p>
                </div>

                <ol className="mt-14 grid gap-8 md:grid-cols-4">
                    {steps.map((item, index) => (
                        <li key={item.step} className="relative">
                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <span
                                    className="absolute top-5 hidden h-px w-full bg-gradient-to-r from-slate-200 to-transparent md:block md:w-[calc(100%+2rem)] md:translate-x-4"
                                    aria-hidden
                                />
                            )}
                            {/* Step badge */}
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-200 bg-indigo-50 text-sm font-bold text-indigo-700">
                                {item.step}
                            </div>
                            <h3 className="text-base font-semibold text-slate-900">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                {item.description}
                            </p>
                        </li>
                    ))}
                </ol>

                {/* Enterprise CTA */}
                <div className="mt-20 rounded-2xl border border-indigo-100 bg-indigo-50 px-8 py-12 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-3">
                        Ready to get started?
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900">
                        Bring structure to your society management
                    </h3>
                    <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                        Society Maintenance Tracker provides the workflow layer
                        your housing team needs — from complaint intake to
                        resolution and important notices, all in one auditable
                        platform.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                            href="/signup"
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                        >
                            Sign Up
                        </a>
                        <a
                            href="/login"
                            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Login
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
