import { handleApiError, jsonOk } from '@/lib/atomquest/api'
import { isAdminRole } from '@/lib/atomquest/roles'
import { requireAtomquestUser, resolveUserRole } from '@/lib/atomquest/session'
import { db } from '@/lib/dbconfig/db'
import { usersTable } from '@/lib/dbconfig/schema'
import { CyclePhase, GoalSheetStatus, goalSheetsTable } from '@/lib/dbconfig/atomquest'
import { and, eq } from 'drizzle-orm'
import { getCycleByPhase } from '@/services/atomquest/cycles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const user = await requireAtomquestUser()
        const role = resolveUserRole(user)
        if (!isAdminRole(role)) throw new Error('FORBIDDEN')

        const cycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)
        const allUsers = await db.select().from(usersTable)

        const rows = await Promise.all(
            allUsers.map(async (u) => {
                let sheetStatus: GoalSheetStatus | 'NONE' = 'NONE'
                if (cycle) {
                    const [sheet] = await db
                        .select({ status: goalSheetsTable.status })
                        .from(goalSheetsTable)
                        .where(
                            and(
                                eq(goalSheetsTable.userId, u.id),
                                eq(goalSheetsTable.cycleId, cycle.id)
                            )
                        )
                        .limit(1)
                    if (sheet) sheetStatus = sheet.status as GoalSheetStatus
                }
                return {
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    department: u.department,
                    sheetStatus,
                }
            })
        )

        return jsonOk({ users: rows })
    } catch (e) {
        return handleApiError(e)
    }
}
