import { eq } from 'drizzle-orm'

import { db } from '@/lib/dbconfig/db'

import { goalsTable } from '@/lib/dbconfig/atomquest'

import type { GoalInput } from '@/services/atomquest/validation'

import { listGoalsForSheet } from '@/lib/queries/atomquest/goal-sheets'



export async function replaceGoalsForSheet(

    goalSheetId: string,

    goals: GoalInput[],

    _editableFields: { title: boolean; target: boolean; weightage: boolean }

) {

    const existing = await listGoalsForSheet(goalSheetId)

    const existingById = new Map(existing.map((g) => [g.id, g]))



    await db.delete(goalsTable).where(eq(goalsTable.goalSheetId, goalSheetId))



    if (goals.length === 0) return []



    const rows = goals.map((g, index) => {

        const prev = g.id ? existingById.get(g.id) : undefined

        const isShared = prev?.isSharedRecipient ?? g.isSharedRecipient ?? false



        return {

            goalSheetId,

            thrustAreaId: isShared && prev ? prev.thrustAreaId : g.thrustAreaId,

            title: isShared && prev ? prev.title : g.title,

            description: isShared && prev ? prev.description : (g.description ?? null),

            uomType: isShared && prev ? prev.uomType : g.uomType,

            targetValue: isShared && prev ? prev.targetValue : (g.targetValue ?? null),

            targetDeadline:

                isShared && prev ? prev.targetDeadline : (g.targetDeadline ?? null),

            weightage: g.weightage,

            sortOrder: index,

            sharedGoalId: prev?.sharedGoalId ?? null,

            isSharedRecipient: isShared,

            isPrimaryOwner: prev?.isPrimaryOwner ?? !isShared,

        }

    })



    return db.insert(goalsTable).values(rows).returning()

}


