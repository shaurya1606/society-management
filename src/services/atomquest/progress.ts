import { UomType } from '@/lib/dbconfig/atomquest'

export function computeProgressScore(
    uomType: UomType,
    targetValue: number | null,
    actualValue: number | null,
    targetDeadline?: Date | null,
    actualCompletionDate?: Date | null
): number {
    const safeTarget =
        targetValue !== null && Number.isFinite(targetValue) ? targetValue : null
    const safeActual =
        actualValue !== null && Number.isFinite(actualValue) ? actualValue : null

    switch (uomType) {
        case UomType.NUMERIC_MIN:
        case UomType.PERCENT_MIN: {
            if (!safeTarget || safeTarget === 0) return 0
            const actual = safeActual ?? 0
            const pct = (actual / safeTarget) * 100
            return Number.isFinite(pct) ? Math.min(100, pct) : 0
        }
        case UomType.NUMERIC_MAX:
        case UomType.PERCENT_MAX: {
            if (!safeActual || safeActual === 0) return 100
            const target = safeTarget ?? 0
            const pct = (target / safeActual) * 100
            return Number.isFinite(pct) ? Math.min(100, pct) : 0
        }
        case UomType.TIMELINE: {
            if (!targetDeadline || !actualCompletionDate) return 0
            return actualCompletionDate <= targetDeadline ? 100 : 0
        }
        case UomType.ZERO_BASED:
            return safeActual === 0 ? 100 : 0
        default:
            return 0
    }
}
