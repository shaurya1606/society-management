// (legal) route group — no navbar or auth required.
// Pages inside inherit globals.css from the root layout.
export default function LegalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
