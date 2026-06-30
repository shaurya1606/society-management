import {

    AuditEntityType,

    CyclePhase,

    GoalSheetStatus,

} from '@/lib/dbconfig/atomquest'

import { handleApiError, jsonError, jsonOk } from '@/lib/atomquest/api'

import { isAdminRole, isManagerRole } from '@/lib/atomquest/roles'
import { canAccessTeamMember } from '@/lib/atomquest/team-access'

import {

    requireAtomquestUser,

    resolveUserRole,

} from '@/lib/atomquest/session'

import { computeDiff, goalsAuditSnapshot, sheetAuditSnapshot } from '@/lib/audit'

import { parseGoalsPayload, toGoalInputs } from '@/lib/schema/goalSchema'

import { writeAuditLog } from '@/lib/queries/atomquest/audit'

import {

    findGoalSheetByUserAndCycle,

    listGoalsForSheet,

    updateGoalSheet,

} from '@/lib/queries/atomquest/goal-sheets'

import { replaceGoalsForSheet } from '@/lib/queries/atomquest/goals'

import { findUserById } from '@/lib/queries/users/select'

import {

    notifyGoalApproved,

    notifyGoalReturned,

} from '@/services/atomquest/notifications'

import { getCycleByPhase } from '@/services/atomquest/cycles'



type RouteContext = { params: Promise<{ userId: string }> }

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, context: RouteContext) {

    try {

        const manager = await requireAtomquestUser()

        const role = resolveUserRole(manager)

        if (!isManagerRole(role) && !isAdminRole(role)) {
            throw new Error('FORBIDDEN')
        }

        const { userId } = await context.params
        const employee = await findUserById(userId)
        if (!employee || !canAccessTeamMember(role, manager.id, employee)) {
            throw new Error('FORBIDDEN')
        }

        const cycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)

        if (!cycle) return jsonError('Cycle not found', 404)

        const sheet = await findGoalSheetByUserAndCycle(userId, cycle.id)

        if (!sheet) return jsonOk({ employee, sheet: null, goals: [] })



        const goals = await listGoalsForSheet(sheet.id)

        return jsonOk({

            employee,

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

        })

    } catch (e) {

        return handleApiError(e)

    }

}



export async function POST(request: Request, context: RouteContext) {

    try {

        const manager = await requireAtomquestUser()

        const role = resolveUserRole(manager)

        if (!isManagerRole(role) && !isAdminRole(role)) {
            throw new Error('FORBIDDEN')
        }

        const { userId } = await context.params
        const employee = await findUserById(userId)
        if (!employee || !canAccessTeamMember(role, manager.id, employee)) {
            throw new Error('FORBIDDEN')
        }

        const body = (await request.json()) as {

            action: 'approve' | 'return' | 'save'

            returnReason?: string

            goals?: unknown

        }



        const cycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)

        if (!cycle) return jsonError('Cycle not found', 404)



        const sheet = await findGoalSheetByUserAndCycle(userId, cycle.id)

        if (!sheet) return jsonError('No goal sheet found for this employee.', 404)



        if (body.action === 'save' && body.goals) {

            const parsed = parseGoalsPayload(body.goals)

            if (!parsed.valid) {

                return jsonError(parsed.errors.join(' '), 400)

            }

            const beforeGoals = await listGoalsForSheet(sheet.id)

            const goals = await replaceGoalsForSheet(
                sheet.id,
                toGoalInputs(parsed.goals),
                { title: true, target: true, weightage: true }
            )

            const diff = computeDiff(

                { goals: goalsAuditSnapshot(beforeGoals) },

                { goals: goalsAuditSnapshot(goals) }

            )

            if (diff) {

                await writeAuditLog({

                    entityType: AuditEntityType.GOAL_SHEET,

                    entityId: sheet.id,

                    action: 'MANAGER_EDIT',

                    changes: diff,

                    changedById: manager.id,

                })

            }

            return jsonOk({ sheet, goals })

        }



        if (body.action === 'return') {

            const reason = body.returnReason ?? 'Please revise your goals.'

            const before = sheetAuditSnapshot(sheet)

            const updated = await updateGoalSheet(sheet.id, {

                status: GoalSheetStatus.RETURNED,

                returnedAt: new Date(),

                returnReason: reason,

            })

            await writeAuditLog({

                entityType: AuditEntityType.GOAL_SHEET,

                entityId: sheet.id,

                action: 'RETURNED',

                changes: computeDiff(before, sheetAuditSnapshot(updated)) ?? {

                    returnReason: { before: null, after: reason },

                },

                changedById: manager.id,

            })

            void notifyGoalReturned({

                employeeName: employee.name ?? employee.email,

                employeeEmail: employee.email,

                reason,

            })

            return jsonOk({ sheet: updated })

        }



        if (body.action === 'approve') {

            if (sheet.status !== GoalSheetStatus.SUBMITTED) {

                return jsonError('Only submitted sheets can be approved.', 400)

            }

            const before = sheetAuditSnapshot(sheet)

            const updated = await updateGoalSheet(sheet.id, {

                status: GoalSheetStatus.LOCKED,

                approvedAt: new Date(),

                approvedById: manager.id,

            })

            await writeAuditLog({

                entityType: AuditEntityType.GOAL_SHEET,

                entityId: sheet.id,

                action: 'LOCKED',

                changes: computeDiff(before, sheetAuditSnapshot(updated)) ?? {

                    status: { before: before.status, after: 'LOCKED' },

                },

                changedById: manager.id,

            })

            void notifyGoalApproved({

                employeeName: employee.name ?? employee.email,

                employeeEmail: employee.email,

            })

            return jsonOk({ sheet: updated })

        }



        return jsonError('Invalid action', 400)

    } catch (e) {

        return handleApiError(e)

    }

}


