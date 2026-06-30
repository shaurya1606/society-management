import { UomType } from '@/lib/dbconfig/atomquest'

export const GOAL_RULES = {
    maxGoals: 8,
    minWeightage: 10,
    totalWeightage: 100,
} as const

export type GoalInput = {
    id?: string
    title: string
    description?: string | null
    thrustAreaId: string
    uomType: UomType
    targetValue?: string | null
    targetDeadline?: Date | null
    weightage: number
    isSharedRecipient?: boolean
}

export function validateGoals(goals: GoalInput[]): {
    valid: boolean
    errors: string[]
} {
    const errors: string[] = []

    if (goals.length === 0) {
        errors.push('Add at least one goal before submitting.')
    }
    if (goals.length > GOAL_RULES.maxGoals) {
        errors.push(`Maximum ${GOAL_RULES.maxGoals} goals allowed.`)
    }

    const total = goals.reduce((sum, g) => sum + g.weightage, 0)
    if (total !== GOAL_RULES.totalWeightage) {
        errors.push(
            `Total weightage must equal ${GOAL_RULES.totalWeightage}% (currently ${total}%).`
        )
    }

    goals.forEach((g, i) => {
        if (g.weightage < GOAL_RULES.minWeightage) {
            errors.push(
                `Goal ${i + 1}: minimum weightage is ${GOAL_RULES.minWeightage}%.`
            )
        }
        if (!g.title.trim()) {
            errors.push(`Goal ${i + 1}: title is required.`)
        }
        if (!g.thrustAreaId) {
            errors.push(`Goal ${i + 1}: thrust area is required.`)
        }
        if (
            g.uomType !== UomType.TIMELINE &&
            g.uomType !== UomType.ZERO_BASED &&
            (g.targetValue === null ||
                g.targetValue === undefined ||
                g.targetValue === '')
        ) {
            errors.push(`Goal ${i + 1}: target value is required.`)
        }
        if (g.uomType === UomType.TIMELINE && !g.targetDeadline) {
            errors.push(`Goal ${i + 1}: deadline is required for timeline goals.`)
        }
    })

    return { valid: errors.length === 0, errors }
}

export function canEditGoalSheet(status: string) {
    return status === 'DRAFT' || status === 'RETURNED'
}
