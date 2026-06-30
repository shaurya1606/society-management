import {
    AchievementStatus,
    CyclePhase,
    GoalSheetStatus,
    goalSheetsTable,
    goalsTable,
    quarterlyUpdatesTable,
} from '@/lib/dbconfig/atomquest'
import { UserRole, usersTable } from '@/lib/dbconfig/schema'
import { and, eq, inArray } from 'drizzle-orm'
import { handleApiError, jsonOk } from '@/lib/atomquest/api'
import { isAdminRole, isEmployeeRole, isManagerRole } from '@/lib/atomquest/roles'
import {
    requireAtomquestUser,
    resolveUserRole,
} from '@/lib/atomquest/session'
import { db } from '@/lib/dbconfig/db'
import {
    getCycleByPhase,
    resolveActiveCheckInPhase,
} from '@/services/atomquest/cycles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const user = await requireAtomquestUser()
        const role = resolveUserRole(user)
        if (!isAdminRole(role)) throw new Error('FORBIDDEN')

        const activeQuarter = await resolveActiveCheckInPhase()
        const cycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)
        const allUsers = await db.select().from(usersTable)
        const employees = allUsers.filter((u) =>
            isEmployeeRole((u.role ?? UserRole.EMPLOYEE) as UserRole)
        )
        const managers = allUsers.filter((u) =>
            isManagerRole((u.role ?? UserRole.EMPLOYEE) as UserRole)
        )

        let submitted = 0
        let approved = 0
        const sheetByUser = new Map<string, (typeof goalSheetsTable.$inferSelect)>()

        if (cycle) {
            const sheets = await db
                .select()
                .from(goalSheetsTable)
                .where(eq(goalSheetsTable.cycleId, cycle.id))

            for (const s of sheets) {
                sheetByUser.set(s.userId, s)
            }

            submitted = sheets.filter(
                (s) =>
                    s.status === GoalSheetStatus.SUBMITTED ||
                    s.status === GoalSheetStatus.LOCKED
            ).length
            approved = sheets.filter(
                (s) => s.status === GoalSheetStatus.LOCKED
            ).length
        }

        const lockedEmployees = employees.filter(
            (e) => sheetByUser.get(e.id)?.status === GoalSheetStatus.LOCKED
        )
        const lockedIds = lockedEmployees.map((e) => e.id)

        let quarterCheckInCompleted = 0
        const achievementCounts: Record<string, number> = {
            [AchievementStatus.NOT_STARTED]: 0,
            [AchievementStatus.ON_TRACK]: 0,
            [AchievementStatus.COMPLETED]: 0,
        }

        if (lockedIds.length > 0 && cycle) {
            const sheets = lockedIds
                .map((id) => sheetByUser.get(id))
                .filter(Boolean) as (typeof goalSheetsTable.$inferSelect)[]
            const sheetIds = sheets.map((s) => s.id)

            if (sheetIds.length > 0) {
                const goals = await db
                    .select({ id: goalsTable.id, goalSheetId: goalsTable.goalSheetId })
                    .from(goalsTable)
                    .where(inArray(goalsTable.goalSheetId, sheetIds))

                const goalIds = goals.map((g) => g.id)
                const sheetIdByGoal = new Map(
                    goals.map((g) => [g.id, g.goalSheetId])
                )
                const userBySheet = new Map(
                    sheets.map((s) => [s.id, s.userId])
                )

                if (goalIds.length > 0) {
                    const updates = await db
                        .select()
                        .from(quarterlyUpdatesTable)
                        .where(
                            and(
                                eq(quarterlyUpdatesTable.period, activeQuarter),
                                inArray(quarterlyUpdatesTable.goalId, goalIds)
                            )
                        )

                    const usersWithCheckIn = new Set<string>()
                    for (const u of updates) {
                        achievementCounts[u.achievementStatus] =
                            (achievementCounts[u.achievementStatus] ?? 0) + 1
                        const sheetId = sheetIdByGoal.get(u.goalId)
                        const uid = sheetId ? userBySheet.get(sheetId) : undefined
                        if (uid) usersWithCheckIn.add(uid)
                    }
                    quarterCheckInCompleted = usersWithCheckIn.size
                }
            }
        }

        const quarterCheckInPct =
            lockedEmployees.length > 0
                ? Math.round(
                      (quarterCheckInCompleted / lockedEmployees.length) * 100
                  )
                : 0

        const employeeRows = employees.map((e) => {
            const sheet = sheetByUser.get(e.id)
            return {
                id: e.id,
                name: e.name,
                email: e.email,
                department: e.department,
                status: (sheet?.status ?? 'NONE') as GoalSheetStatus | 'NONE',
            }
        })

        const managerRows = managers.map((mgr) => {
            const reports = employees.filter((e) => e.managerId === mgr.id)
            let mgrApproved = 0
            let mgrPending = 0
            for (const r of reports) {
                const sheet = sheetByUser.get(r.id)
                if (!sheet) continue
                if (sheet.status === GoalSheetStatus.LOCKED) mgrApproved++
                else if (sheet.status === GoalSheetStatus.SUBMITTED) mgrPending++
            }
            return {
                id: mgr.id,
                name: mgr.name,
                email: mgr.email,
                directReports: reports.length,
                approved: mgrApproved,
                pending: mgrPending,
            }
        })

        const achievementLabels: Record<string, string> = {
            [AchievementStatus.NOT_STARTED]: 'Not started',
            [AchievementStatus.ON_TRACK]: 'On track',
            [AchievementStatus.COMPLETED]: 'Completed',
        }
        const achievementDistribution = Object.entries(achievementCounts)
            .filter(([, v]) => v > 0)
            .map(([key, value]) => ({
                name: achievementLabels[key] ?? key,
                value,
            }))

        return jsonOk({
            totalEmployees: employees.length,
            submitted,
            approved,
            pendingApproval: submitted - approved,
            completionRate:
                employees.length > 0
                    ? Math.round((approved / employees.length) * 100)
                    : 0,
            employees: employeeRows,
            activeQuarter,
            quarterCheckInCompleted,
            quarterCheckInPct,
            pendingReviews: submitted - approved,
            achievementDistribution,
            managers: managerRows,
        })
    } catch (e) {
        return handleApiError(e)
    }
}
