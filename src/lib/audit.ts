export function computeDiff(
    before: Record<string, unknown> | null | undefined,
    after: Record<string, unknown> | null | undefined
): Record<string, { before: unknown; after: unknown }> | null {
    if (!before && !after) return null
    const b = before ?? {}
    const a = after ?? {}
    const keys = new Set([...Object.keys(b), ...Object.keys(a)])
    const diff: Record<string, { before: unknown; after: unknown }> = {}
    for (const key of keys) {
        const bv = b[key]
        const av = a[key]
        if (JSON.stringify(bv) !== JSON.stringify(av)) {
            diff[key] = { before: bv ?? null, after: av ?? null }
        }
    }
    return Object.keys(diff).length > 0 ? diff : null
}

export function sheetAuditSnapshot(sheet: {
    status: string
    returnReason?: string | null
    submittedAt?: Date | null
    approvedAt?: Date | null
}) {
    return {
        status: sheet.status,
        returnReason: sheet.returnReason ?? null,
        submittedAt: sheet.submittedAt?.toISOString?.() ?? sheet.submittedAt ?? null,
        approvedAt: sheet.approvedAt?.toISOString?.() ?? sheet.approvedAt ?? null,
    }
}

export function goalsAuditSnapshot(
    goals: Array<{
        title: string
        weightage: number
        targetValue?: string | null
        uomType: string
    }>
) {
    return goals.map((g) => ({
        title: g.title,
        weightage: g.weightage,
        targetValue: g.targetValue ?? null,
        uomType: g.uomType,
    }))
}
