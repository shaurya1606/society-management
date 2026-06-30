export function formatAuditChanges(
    changes: Record<string, unknown> | null
): string {
    if (!changes) return '—'

    const diff = changes as Record<
        string,
        { before?: unknown; after?: unknown }
    >

    const lines: string[] = []
    for (const [key, value] of Object.entries(diff)) {
        if (
            value &&
            typeof value === 'object' &&
            ('before' in value || 'after' in value)
        ) {
            const before = JSON.stringify(value.before ?? null)
            const after = JSON.stringify(value.after ?? null)
            lines.push(`${key}: ${before} → ${after}`)
        } else {
            lines.push(`${key}: ${JSON.stringify(value)}`)
        }
    }

    return lines.length > 0 ? lines.join('\n') : '—'
}
