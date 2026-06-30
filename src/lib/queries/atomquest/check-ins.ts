import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import {
    CyclePhase,
    managerCheckInsTable,
    quarterlyUpdatesTable,
} from '@/lib/dbconfig/atomquest'
import type { AchievementStatus } from '@/lib/dbconfig/atomquest'

export async function upsertQuarterlyUpdate(input: {
    goalId: string
    period: CyclePhase
    actualValue?: string | null
    actualCompletionDate?: Date | null
    achievementStatus: AchievementStatus
    progressScore: string
    notes?: string | null
    updatedById: string
}) {
    const existing = await db
        .select()
        .from(quarterlyUpdatesTable)
        .where(
            and(
                eq(quarterlyUpdatesTable.goalId, input.goalId),
                eq(quarterlyUpdatesTable.period, input.period)
            )
        )
        .limit(1)

    if (existing[0]) {
        const [row] = await db
            .update(quarterlyUpdatesTable)
            .set({
                actualValue: input.actualValue ?? null,
                actualCompletionDate: input.actualCompletionDate ?? null,
                achievementStatus: input.achievementStatus,
                progressScore: input.progressScore,
                notes: input.notes ?? null,
                updatedById: input.updatedById,
            })
            .where(eq(quarterlyUpdatesTable.id, existing[0].id))
            .returning()
        return row
    }

    const [row] = await db
        .insert(quarterlyUpdatesTable)
        .values({
            goalId: input.goalId,
            period: input.period,
            actualValue: input.actualValue ?? null,
            actualCompletionDate: input.actualCompletionDate ?? null,
            achievementStatus: input.achievementStatus,
            progressScore: input.progressScore,
            notes: input.notes ?? null,
            updatedById: input.updatedById,
        })
        .returning()
    return row
}

export async function upsertManagerCheckIn(input: {
    employeeId: string
    managerId: string
    cycleId: string
    period: CyclePhase
    comment: string
}) {
    const existing = await db
        .select()
        .from(managerCheckInsTable)
        .where(
            and(
                eq(managerCheckInsTable.employeeId, input.employeeId),
                eq(managerCheckInsTable.cycleId, input.cycleId),
                eq(managerCheckInsTable.period, input.period)
            )
        )
        .limit(1)

    if (existing[0]) {
        const [row] = await db
            .update(managerCheckInsTable)
            .set({ comment: input.comment, managerId: input.managerId })
            .where(eq(managerCheckInsTable.id, existing[0].id))
            .returning()
        return row
    }

    const [row] = await db
        .insert(managerCheckInsTable)
        .values(input)
        .returning()
    return row
}

export async function listQuarterlyUpdatesForGoals(goalIds: string[]) {
    if (goalIds.length === 0) return []
    return db
        .select()
        .from(quarterlyUpdatesTable)
        .where(inArray(quarterlyUpdatesTable.goalId, goalIds))
}
