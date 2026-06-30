import { AuditEntityType, CyclePhase, GoalSheetStatus } from '@/lib/dbconfig/atomquest'

import { handleApiError, jsonError, jsonOk } from '@/lib/atomquest/api'

import { isEmployeeRole } from '@/lib/atomquest/roles'

import {

    requireAtomquestUser,

    resolveUserRole,

} from '@/lib/atomquest/session'

import { computeDiff, goalsAuditSnapshot, sheetAuditSnapshot } from '@/lib/audit'

import { parseGoalsPayload, toGoalInputs } from '@/lib/schema/goalSchema'

import { writeAuditLog } from '@/lib/queries/atomquest/audit'

import {

    getOrCreateGoalSheet,

    listGoalsForSheet,

    updateGoalSheet,

} from '@/lib/queries/atomquest/goal-sheets'

import { replaceGoalsForSheet } from '@/lib/queries/atomquest/goals'

import { findUserById } from '@/lib/queries/users/select'

import {

    notifyGoalSubmitted,

} from '@/services/atomquest/notifications'

import { assertCycleOpen, getCycleByPhase } from '@/services/atomquest/cycles'

import { canEditGoalSheet } from '@/services/atomquest/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {

    try {

        const user = await requireAtomquestUser()

        const { searchParams } = new URL(request.url)

        const phase =

            (searchParams.get('phase') as CyclePhase) || CyclePhase.GOAL_SETTING



        const cycle = await getCycleByPhase(phase)

        if (!cycle) {

            return jsonError(`No cycle found for ${phase}`, 404)

        }



        const sheet = await getOrCreateGoalSheet(user.id, cycle.id)

        const goals = await listGoalsForSheet(sheet.id)



        return jsonOk({

            cycle,

            sheet,

            goals: goals.map((g) => ({

                id: g.id,

                title: g.title,

                description: g.description,

                thrustAreaId: g.thrustAreaId,

                uomType: g.uomType,

                targetValue: g.targetValue,

                targetDeadline: g.targetDeadline,

                weightage: g.weightage,

                isSharedRecipient: g.isSharedRecipient,

                isPrimaryOwner: g.isPrimaryOwner,

                sharedGoalId: g.sharedGoalId,

            })),

            canEdit: canEditGoalSheet(sheet.status),

        })

    } catch (e) {

        return handleApiError(e)

    }

}



export async function PUT(request: Request) {

    try {

        const user = await requireAtomquestUser()

        const role = resolveUserRole(user)

        if (!isEmployeeRole(role)) {

            throw new Error('FORBIDDEN')

        }



        await assertCycleOpen(CyclePhase.GOAL_SETTING)

        const cycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)

        if (!cycle) return jsonError('Goal setting cycle not configured', 404)



        const sheet = await getOrCreateGoalSheet(user.id, cycle.id)

        if (!canEditGoalSheet(sheet.status)) {

            return jsonError('Goal sheet is locked and cannot be edited.', 403)

        }



        const body = (await request.json()) as { goals?: unknown }

        const parsed = parseGoalsPayload(body.goals ?? [])

        if (!parsed.valid) {

            return jsonError(parsed.errors.join(' '), 400)

        }



        const beforeGoals = await listGoalsForSheet(sheet.id)

        const goals = await replaceGoalsForSheet(sheet.id, toGoalInputs(parsed.goals), {
            title: true,
            target: true,
            weightage: true,
        })



        const diff = computeDiff(

            { goals: goalsAuditSnapshot(beforeGoals) },

            { goals: goalsAuditSnapshot(goals) }

        )

        if (diff) {

            await writeAuditLog({

                entityType: AuditEntityType.GOAL_SHEET,

                entityId: sheet.id,

                action: 'SAVED_DRAFT',

                changes: diff,

                changedById: user.id,

            })

        }



        return jsonOk({ sheet, goals })

    } catch (e) {

        return handleApiError(e)

    }

}



export async function POST(request: Request) {

    try {

        const user = await requireAtomquestUser()

        const role = resolveUserRole(user)

        if (!isEmployeeRole(role)) {

            throw new Error('FORBIDDEN')

        }



        const body = (await request.json()) as { action?: string }

        if (body.action !== 'submit') {

            return jsonError('Invalid action', 400)

        }



        await assertCycleOpen(CyclePhase.GOAL_SETTING)

        const cycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)

        if (!cycle) return jsonError('Goal setting cycle not configured', 404)



        const sheet = await getOrCreateGoalSheet(user.id, cycle.id)

        if (!canEditGoalSheet(sheet.status)) {

            return jsonError('Goal sheet cannot be submitted in its current state.', 403)

        }



        const goals = await listGoalsForSheet(sheet.id)

        const parsed = parseGoalsPayload(

            goals.map((g) => ({

                id: g.id,

                title: g.title,

                description: g.description,

                thrustAreaId: g.thrustAreaId,

                uomType: g.uomType,

                targetValue: g.targetValue,

                targetDeadline: g.targetDeadline,

                weightage: g.weightage,

                isSharedRecipient: g.isSharedRecipient,

            }))

        )

        if (!parsed.valid) {

            return jsonError(parsed.errors.join(' '), 400)

        }



        const before = sheetAuditSnapshot(sheet)

        const updated = await updateGoalSheet(sheet.id, {

            status: GoalSheetStatus.SUBMITTED,

            submittedAt: new Date(),

        })



        const after = sheetAuditSnapshot(updated)

        await writeAuditLog({

            entityType: AuditEntityType.GOAL_SHEET,

            entityId: sheet.id,

            action: 'SUBMITTED',

            changes: computeDiff(before, after) ?? { status: { before: before.status, after: after.status } },

            changedById: user.id,

        })



        if (user.managerId) {

            const manager = await findUserById(user.managerId)

            if (manager?.email) {

                void notifyGoalSubmitted({

                    employeeName: user.name ?? user.email,

                    employeeEmail: user.email,

                    managerEmail: manager.email,

                })

            }

        }



        return jsonOk({ sheet: updated })

    } catch (e) {

        return handleApiError(e)

    }

}


