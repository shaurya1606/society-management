import { eq } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import {
    CyclePhase,
    type UomType,
    goalsTable,
    sharedGoalsTable,
} from '@/lib/dbconfig/atomquest'
import { UserRole, usersTable } from '@/lib/dbconfig/schema'
import { isEmployeeRole } from '@/lib/atomquest/roles'
import {
    getOrCreateGoalSheet,
    listGoalsForSheet,
} from '@/lib/queries/atomquest/goal-sheets'
import { getCycleByPhase } from '@/services/atomquest/cycles'

export async function assignSharedGoal(input: {
    title: string
    description?: string | null
    thrustAreaId: string
    uomType: UomType
    targetValue?: string | null
    targetDeadline?: Date | null
    weightage: number
    primaryOwnerUserId: string
    employeeIds: string[]
    createdById: string
}) {
    const cycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)
    if (!cycle) throw new Error('Goal setting cycle not configured')

    const uniqueIds = [...new Set(input.employeeIds)]
    if (uniqueIds.length === 0) throw new Error('Select at least one employee')

    const [shared] = await db
        .insert(sharedGoalsTable)
        .values({
            title: input.title,
            description: input.description ?? null,
            thrustAreaId: input.thrustAreaId,
            uomType: input.uomType,
            targetValue: input.targetValue ?? null,
            targetDeadline: input.targetDeadline ?? null,
            primaryOwnerUserId: input.primaryOwnerUserId,
            createdById: input.createdById,
            cycleId: cycle.id,
        })
        .returning()

    const assigned: string[] = []

    for (const employeeId of uniqueIds) {
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, employeeId))
            .limit(1)
        if (!user || !isEmployeeRole((user.role ?? UserRole.EMPLOYEE) as UserRole)) {
            continue
        }

        const sheet = await getOrCreateGoalSheet(employeeId, cycle.id)
        const existing = await listGoalsForSheet(sheet.id)
        const isPrimary = employeeId === input.primaryOwnerUserId

        await db.insert(goalsTable).values({
            goalSheetId: sheet.id,
            thrustAreaId: input.thrustAreaId,
            title: input.title,
            description: input.description ?? null,
            uomType: input.uomType,
            targetValue: input.targetValue ?? null,
            targetDeadline: input.targetDeadline ?? null,
            weightage: input.weightage,
            sortOrder: existing.length,
            sharedGoalId: shared.id,
            isSharedRecipient: !isPrimary,
            isPrimaryOwner: isPrimary,
        })
        assigned.push(employeeId)
    }

    return { sharedGoal: shared, assignedCount: assigned.length }
}

export async function syncSharedGoalCheckIn(
    sharedGoalId: string,
    period: string,
    sourceGoalId: string,
    payload: {
        actualValue?: string | null
        actualCompletionDate?: Date | null
        achievementStatus: string
        progressScore: string
        notes?: string | null
        updatedById: string
    }
) {
    const linked = await db
        .select()
        .from(goalsTable)
        .where(eq(goalsTable.sharedGoalId, sharedGoalId))

    const { upsertQuarterlyUpdate } = await import('@/lib/queries/atomquest/check-ins')

    for (const goal of linked) {
        if (goal.id === sourceGoalId) continue
        await upsertQuarterlyUpdate({
            goalId: goal.id,
            period: period as import('@/lib/dbconfig/atomquest').CyclePhase,
            actualValue: payload.actualValue ?? null,
            actualCompletionDate: payload.actualCompletionDate ?? null,
            achievementStatus:
                payload.achievementStatus as import('@/lib/dbconfig/atomquest').AchievementStatus,
            progressScore: payload.progressScore,
            notes: payload.notes ?? null,
            updatedById: payload.updatedById,
        })
    }
}

