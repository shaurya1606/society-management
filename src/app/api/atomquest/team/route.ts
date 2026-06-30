import { CyclePhase } from '@/lib/dbconfig/atomquest'
import { handleApiError, jsonError, jsonOk } from '@/lib/atomquest/api'
import { isAdminRole, isEmployeeRole, isManagerRole } from '@/lib/atomquest/roles'
import { UserRole, usersTable } from '@/lib/dbconfig/schema'
import { db } from '@/lib/dbconfig/db'
import {
    requireAtomquestUser,
    resolveUserRole,
} from '@/lib/atomquest/session'
import { findGoalSheetByUserAndCycle } from '@/lib/queries/atomquest/goal-sheets'
import { listDirectReports } from '@/lib/queries/atomquest/users'
import { getCycleByPhase } from '@/services/atomquest/cycles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const user = await requireAtomquestUser()
        const role = resolveUserRole(user)
        if (!isManagerRole(role) && !isAdminRole(role)) {
            throw new Error('FORBIDDEN')
        }

        const cycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)
        if (!cycle) {
            return jsonError('Goal setting cycle not configured', 404)
        }

        const reports = isAdminRole(role)
            ? (
                  await db.select().from(usersTable)
              ).filter((u) =>
                  isEmployeeRole((u.role ?? UserRole.EMPLOYEE) as UserRole)
              )
            : await listDirectReports(user.id)
        const team = await Promise.all(
            reports.map(async (report) => {
                const sheet = await findGoalSheetByUserAndCycle(
                    report.id,
                    cycle.id
                )
                return {
                    user: {
                        id: report.id,
                        name: report.name,
                        email: report.email,
                        department: report.department,
                    },
                    sheet: sheet
                        ? {
                              id: sheet.id,
                              status: sheet.status,
                              submittedAt: sheet.submittedAt,
                          }
                        : null,
                }
            })
        )

        return jsonOk({
            cycle,
            team,
            viewMode: isAdminRole(role) ? 'admin' : 'manager',
        })
    } catch (e) {
        return handleApiError(e)
    }
}
