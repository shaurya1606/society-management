import { UomType } from '@/lib/dbconfig/atomquest'
import { computeProgressScore } from '@/services/atomquest/progress'

export function parseTargetNumber(targetValue: string | null | undefined): number | null {
    if (targetValue === null || targetValue === undefined) return null
    const trimmed = String(targetValue).trim()
    if (!trimmed) return null
    const n = Number(trimmed)
    return Number.isFinite(n) ? n : null
}

/** Parse employee-entered actual value for progress scoring. */
export function parseActualForScore(
    uomType: UomType,
    raw: string | null | undefined
): number | null {
    if (raw === null || raw === undefined) return null
    const trimmed = String(raw).trim()
    if (!trimmed) return null

    if (uomType === UomType.ZERO_BASED) {
        if (trimmed === '1' || trimmed.toLowerCase() === 'true' || trimmed === 'yes') {
            return 0
        }
        if (trimmed === '0' || trimmed.toLowerCase() === 'false' || trimmed === 'no') {
            return 1
        }
        return null
    }

    const n = Number(trimmed)
    return Number.isFinite(n) ? n : null
}

export function formatProgressScore(score: number): string {
    const safe = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0
    return safe.toFixed(2)
}

export function resolveProgressScore(input: {
    uomType: UomType
    targetValue: string | null | undefined
    actualValue: string | null | undefined
    targetDeadline?: Date | null
    actualCompletionDate?: Date | null
}): { score: number; formatted: string; error?: string } {
    const targetNum = parseTargetNumber(input.targetValue)
    const actualNum = parseActualForScore(input.uomType, input.actualValue)

    if (
        input.uomType !== UomType.TIMELINE &&
        input.uomType !== UomType.ZERO_BASED &&
        input.actualValue !== null &&
        input.actualValue !== undefined &&
        String(input.actualValue).trim() !== '' &&
        actualNum === null
    ) {
        return {
            score: 0,
            formatted: '0.00',
            error: 'Actual value must be a valid number',
        }
    }

    if (input.uomType === UomType.TIMELINE) {
        if (!input.actualCompletionDate) {
            return {
                score: 0,
                formatted: '0.00',
                error: 'Completion date is required for timeline goals',
            }
        }
    }

    if (input.uomType === UomType.ZERO_BASED) {
        if (actualNum === null && String(input.actualValue ?? '').trim() !== '') {
            return {
                score: 0,
                formatted: '0.00',
                error: 'Select whether the zero-defect target was met',
            }
        }
    }

    const score = computeProgressScore(
        input.uomType,
        targetNum,
        actualNum,
        input.targetDeadline ?? null,
        input.actualCompletionDate ?? null
    )

    return {
        score: Number.isFinite(score) ? score : 0,
        formatted: formatProgressScore(score),
    }
}
