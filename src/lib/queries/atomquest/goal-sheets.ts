import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import {
    GoalSheetStatus,
    type SelectGoal,
    type SelectGoalSheet,
    goalSheetsTable,
    goalsTable,
} from '@/lib/dbconfig/atomquest'

export async function findGoalSheetByUserAndCycle(
    userId: string,
    cycleId: string
): Promise<SelectGoalSheet | null> {
    const [sheet] = await db
        .select()
        .from(goalSheetsTable)
        .where(
            and(
                eq(goalSheetsTable.userId, userId),
                eq(goalSheetsTable.cycleId, cycleId)
            )
        )
        .limit(1)
    return sheet ?? null
}

export async function createGoalSheet(userId: string, cycleId: string) {
    const [sheet] = await db
        .insert(goalSheetsTable)
        .values({ userId, cycleId, status: GoalSheetStatus.DRAFT })
        .returning()
    return sheet
}

export async function getOrCreateGoalSheet(userId: string, cycleId: string) {
    const existing = await findGoalSheetByUserAndCycle(userId, cycleId)
    if (existing) return existing
    return createGoalSheet(userId, cycleId)
}

export async function listGoalsForSheet(goalSheetId: string): Promise<SelectGoal[]> {
    return db
        .select()
        .from(goalsTable)
        .where(eq(goalsTable.goalSheetId, goalSheetId))
        .orderBy(asc(goalsTable.sortOrder))
}

export async function findGoalSheetById(id: string) {
    const [sheet] = await db
        .select()
        .from(goalSheetsTable)
        .where(eq(goalSheetsTable.id, id))
        .limit(1)
    return sheet ?? null
}

export async function updateGoalSheet(
    id: string,
    data: Partial<typeof goalSheetsTable.$inferInsert>
) {
    const [updated] = await db
        .update(goalSheetsTable)
        .set(data)
        .where(eq(goalSheetsTable.id, id))
        .returning()
    return updated
}
