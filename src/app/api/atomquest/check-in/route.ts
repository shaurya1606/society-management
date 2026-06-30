import {
    AchievementStatus,
    AuditEntityType,
    CyclePhase,
    GoalSheetStatus,
    type UomType,
} from '@/lib/dbconfig/atomquest'
import { resolveProgressScore } from '@/lib/atomquest/check-in-parse'
import { handleApiError, jsonError, jsonOk } from '@/lib/atomquest/api'
import { isEmployeeRole } from '@/lib/atomquest/roles'
import {
    requireAtomquestUser,
    resolveUserRole,
} from '@/lib/atomquest/session'
import { writeAuditLog } from '@/lib/queries/atomquest/audit'
import {
    listQuarterlyUpdatesForGoals,
    upsertQuarterlyUpdate,
} from '@/lib/queries/atomquest/check-ins'
import {
    findGoalSheetByUserAndCycle,
    listGoalsForSheet,
} from '@/lib/queries/atomquest/goal-sheets'
import {
    assertCycleOpen,
    getCycleByPhase,
    resolveActiveCheckInPhase,
} from '@/services/atomquest/cycles'
import { getQuarterLockState, isCycleWindowOpen } from '@/lib/atomquest/cycle-utils'

const CHECK_IN_PHASES = [
    CyclePhase.Q1,
    CyclePhase.Q2,
    CyclePhase.Q3,
    CyclePhase.Q4,
] as const

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const user = await requireAtomquestUser()
        const role = resolveUserRole(user)
        if (!isEmployeeRole(role)) throw new Error('FORBIDDEN')

        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') as CyclePhase | null
        if (!period || !CHECK_IN_PHASES.includes(period as (typeof CHECK_IN_PHASES)[number])) {
            return jsonError('Invalid check-in period', 400)
        }

        const goalCycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)
        if (!goalCycle) return jsonError('Goal sheet cycle not found', 404)

        const sheet = await findGoalSheetByUserAndCycle(user.id, goalCycle.id)
        if (!sheet) return jsonOk({ updates: [] })

        const goals = await listGoalsForSheet(sheet.id)
        const all = await listQuarterlyUpdatesForGoals(goals.map((g) => g.id))
        const updates = all
            .filter((u) => u.period === period)
            .map((u) => ({
                goalId: u.goalId,
                actualValue: u.actualValue,
                actualCompletionDate: u.actualCompletionDate,
                achievementStatus: u.achievementStatus,
                progressScore: u.progressScore,
                notes: u.notes,
            }))

        return jsonOk({ updates })
    } catch (e) {
        return handleApiError(e)
    }
}

export async function POST(request: Request) {
    try {
        const user = await requireAtomquestUser()
        const role = resolveUserRole(user)
        if (!isEmployeeRole(role)) throw new Error('FORBIDDEN')

        const body = (await request.json()) as {
            period: CyclePhase
            updates: Array<{
                goalId: string
                actualValue?: string | null
                actualCompletionDate?: string | null
                achievementStatus: AchievementStatus
                notes?: string | null
            }>
        }

        if (
            !CHECK_IN_PHASES.includes(
                body.period as (typeof CHECK_IN_PHASES)[number]
            )
        ) {
            return jsonError('Invalid check-in period', 400)
        }

        const activeQuarter = await resolveActiveCheckInPhase()
        const periodCycle = await getCycleByPhase(body.period)
        const lockState = getQuarterLockState(
            body.period,
            activeQuarter,
            periodCycle ? isCycleWindowOpen(periodCycle) : false
        )
        if (lockState !== 'active') {
            return jsonError(
                `Only ${activeQuarter} check-ins can be edited (${lockState.replace('_', ' ')}).`,
                403
            )
        }

        await assertCycleOpen(body.period)

        const goalCycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)
        if (!goalCycle) return jsonError('Goal sheet cycle not found', 404)

        const sheet = await findGoalSheetByUserAndCycle(user.id, goalCycle.id)
        if (!sheet || sheet.status !== GoalSheetStatus.LOCKED) {
            return jsonError('You need an approved (locked) goal sheet first.', 403)
        }

        const goals = await listGoalsForSheet(sheet.id)
        const goalIds = new Set(goals.map((g) => g.id))

        for (const update of body.updates) {
            if (!goalIds.has(update.goalId)) continue

            const goal = goals.find((g) => g.id === update.goalId)!
            const resolved = resolveProgressScore({
                uomType: goal.uomType as UomType,
                targetValue: goal.targetValue,
                actualValue: update.actualValue ?? null,
                targetDeadline: goal.targetDeadline,
                actualCompletionDate: update.actualCompletionDate
                    ? new Date(update.actualCompletionDate)
                    : null,
            })

            if (resolved.error) {
                return jsonError(
                    `${goal.title}: ${resolved.error}`,
                    400
                )
            }

            const payload = {
                actualValue: update.actualValue ?? null,
                actualCompletionDate: update.actualCompletionDate
                    ? new Date(update.actualCompletionDate)
                    : null,
                achievementStatus: update.achievementStatus,
                progressScore: resolved.formatted,
                notes: update.notes ?? null,
                updatedById: user.id,
            }

            await upsertQuarterlyUpdate({
                goalId: update.goalId,
                period: body.period,
                ...payload,
            })

            if (goal.isPrimaryOwner && goal.sharedGoalId) {
                const { syncSharedGoalCheckIn } = await import(
                    '@/lib/queries/atomquest/shared-goals'
                )
                await syncSharedGoalCheckIn(
                    goal.sharedGoalId,
                    body.period,
                    update.goalId,
                    payload
                )
            }
        }

        await writeAuditLog({
            entityType: AuditEntityType.QUARTERLY_UPDATE,
            entityId: sheet.id,
            action: `CHECK_IN_${body.period}`,
            changedById: user.id,
        })

        return jsonOk({ success: true })
    } catch (e) {
        return handleApiError(e)
    }
}
