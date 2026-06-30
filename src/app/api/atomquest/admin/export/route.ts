import { and, eq } from 'drizzle-orm'
import {
    CyclePhase,
    goalSheetsTable,
    goalsTable,
    quarterlyUpdatesTable,
} from '@/lib/dbconfig/atomquest'
import { usersTable } from '@/lib/dbconfig/schema'
import { UserRole } from '@/lib/dbconfig/schema'
import { handleApiError } from '@/lib/atomquest/api'
import { isAdminRole, isEmployeeRole } from '@/lib/atomquest/roles'
import {
    requireAtomquestUser,
    resolveUserRole,
} from '@/lib/atomquest/session'
import { db } from '@/lib/dbconfig/db'
import { getCycleByPhase } from '@/services/atomquest/cycles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const user = await requireAtomquestUser()
        const role = resolveUserRole(user)
        if (!isAdminRole(role)) throw new Error('FORBIDDEN')

        const goalCycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)
        const checkInPhase = CyclePhase.Q1

        const allUsers = await db.select().from(usersTable)
        const employees = allUsers.filter((u) =>
            isEmployeeRole((u.role ?? UserRole.EMPLOYEE) as UserRole)
        )

        const rows: string[][] = [
            [
                'Employee',
                'Email',
                'Goal',
                'Planned Target',
                'Actual',
                'Progress %',
                'Status',
            ],
        ]

        if (goalCycle) {
            for (const emp of employees) {
                const [empSheet] = await db
                    .select()
                    .from(goalSheetsTable)
                    .where(
                        and(
                            eq(goalSheetsTable.userId, emp.id),
                            eq(goalSheetsTable.cycleId, goalCycle.id)
                        )
                    )
                    .limit(1)

                if (!empSheet) continue

                const goals = await db
                    .select()
                    .from(goalsTable)
                    .where(eq(goalsTable.goalSheetId, empSheet.id))

                for (const goal of goals) {
                    const [update] = await db
                        .select()
                        .from(quarterlyUpdatesTable)
                        .where(
                            and(
                                eq(quarterlyUpdatesTable.goalId, goal.id),
                                eq(quarterlyUpdatesTable.period, checkInPhase)
                            )
                        )
                        .limit(1)

                    rows.push([
                        emp.name ?? '',
                        emp.email,
                        goal.title,
                        goal.targetValue ?? '',
                        update?.actualValue ?? '',
                        update?.progressScore ?? '',
                        update?.achievementStatus ?? 'NOT_STARTED',
                    ])
                }
            }
        }

        const csv = rows
            .map((r) =>
                r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')
            )
            .join('\n')

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition':
                    'attachment; filename="atomquest-achievement-report.csv"',
            },
        })
    } catch (e) {
        return handleApiError(e)
    }
}
