import Image from 'next/image'

export default function Loading() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 z-50">
            <div className="flex flex-col items-center gap-5">
                {/* Spinner */}
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-600" />
                </div>

                {/* Wordmark */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.jpg"
                        alt="Society Maintenance Tracker"
                        width={24}
                        height={24}
                        className="rounded-md object-contain"
                        priority
                    />
                    <span className="text-sm font-semibold text-slate-700 tracking-tight">
                        Society Maintenance Tracker
                    </span>
                </div>

                <p className="text-xs text-slate-400 font-medium tracking-wide">
                    Loading…
                </p>
            </div>
        </div>
    )
}
