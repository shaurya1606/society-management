import { z } from 'zod'
import { UomType } from '@/lib/dbconfig/atomquest'
import { GOAL_RULES, type GoalInput } from '@/services/atomquest/validation'

const uomEnum = z.enum([
    UomType.NUMERIC_MIN,
    UomType.PERCENT_MIN,
    UomType.NUMERIC_MAX,
    UomType.PERCENT_MAX,
    UomType.TIMELINE,
    UomType.ZERO_BASED,
])

export const goalInputSchema = z
    .object({
        id: z.string().optional(),
        title: z.string().trim().min(1, 'Title is required'),
        description: z.string().nullable().optional(),
        thrustAreaId: z.string().min(1, 'Thrust area is required'),
        uomType: uomEnum,
        targetValue: z.string().nullable().optional(),
        targetDeadline: z
            .union([z.string(), z.date(), z.null()])
            .optional()
            .transform((v) => {
                if (!v) return null
                if (v instanceof Date) return v
                const s = String(v).trim()
                return s ? new Date(s) : null
            }),
        weightage: z.coerce
            .number()
            .int()
            .min(GOAL_RULES.minWeightage, `Minimum weightage is ${GOAL_RULES.minWeightage}%`),
        isSharedRecipient: z.boolean().optional(),
    })
    .superRefine((g, ctx) => {
        if (g.isSharedRecipient) return
        if (
            g.uomType !== UomType.TIMELINE &&
            g.uomType !== UomType.ZERO_BASED &&
            (g.targetValue === null ||
                g.targetValue === undefined ||
                String(g.targetValue).trim() === '')
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Target value is required',
                path: ['targetValue'],
            })
        }
        if (g.uomType === UomType.TIMELINE && !g.targetDeadline) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Deadline is required for timeline goals',
                path: ['targetDeadline'],
            })
        }
    })

export const goalsPayloadSchema = z
    .array(goalInputSchema)
    .min(1, 'Add at least one goal')
    .max(GOAL_RULES.maxGoals, `Maximum ${GOAL_RULES.maxGoals} goals allowed`)
    .superRefine((goals, ctx) => {
        const total = goals.reduce((sum, g) => sum + g.weightage, 0)
        if (total !== GOAL_RULES.totalWeightage) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Total weightage must equal ${GOAL_RULES.totalWeightage}% (currently ${total}%)`,
            })
        }
    })

export type ParsedGoalInput = z.infer<typeof goalInputSchema>

export function toGoalInputs(goals: ParsedGoalInput[]): GoalInput[] {
    return goals.map((g) => {
        const row: GoalInput = {
            title: g.title,
            description: g.description ?? null,
            thrustAreaId: g.thrustAreaId,
            uomType: g.uomType,
            targetValue: g.targetValue != null ? String(g.targetValue) : null,
            targetDeadline: g.targetDeadline,
            weightage: g.weightage,
            isSharedRecipient: g.isSharedRecipient ?? false,
        }
        if (g.id) row.id = g.id
        return row
    })
}

export function parseGoalsPayload(data: unknown) {
    const result = goalsPayloadSchema.safeParse(data)
    if (result.success) {
        return { valid: true as const, goals: result.data, errors: [] as string[] }
    }
    const errors = result.error.issues.map((i) => i.message)
    return { valid: false as const, goals: null, errors: [...new Set(errors)] }
}
