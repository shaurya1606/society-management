import { handleApiError, jsonError, jsonOk } from '@/lib/atomquest/api'
import { isAdminRole } from '@/lib/atomquest/roles'
import { requireAtomquestUser, resolveUserRole } from '@/lib/atomquest/session'
import { findUserById } from '@/lib/queries/users/select'
import {
    findGoalSheetByUserAndCycle,
    listGoalsForSheet,
} from '@/lib/queries/atomquest/goal-sheets'
import { listAuditLogs } from '@/lib/queries/atomquest/audit'
import { getCycleByPhase } from '@/services/atomquest/cycles'
import { CyclePhase } from '@/lib/dbconfig/atomquest'
import { UserRole } from '@/lib/dbconfig/schema'
import { updateUserById } from '@/lib/queries/users/update'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ userId: string }> }

export async function GET(_req: Request, context: RouteContext) {
    try {
        const admin = await requireAtomquestUser()
        if (!isAdminRole(resolveUserRole(admin))) throw new Error('FORBIDDEN')

        const { userId } = await context.params
        const employee = await findUserById(userId)
        if (!employee) return jsonError('User not found', 404)

        const cycle = await getCycleByPhase(CyclePhase.GOAL_SETTING)
        const sheet = cycle
            ? await findGoalSheetByUserAndCycle(userId, cycle.id)
            : null
        const goals = sheet ? await listGoalsForSheet(sheet.id) : []
        const logs = (await listAuditLogs(80)).filter(
            (l) => l.changedById === userId || l.entityId === sheet?.id
        )

        return jsonOk({ employee, sheet, goals, audit: logs.slice(0, 15) })
    } catch (e) {
        return handleApiError(e)
    }
}

const patchSchema = z.object({
    role: z.enum([
        UserRole.EMPLOYEE,
        UserRole.MANAGER,
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
    ]),
})

export async function PATCH(request: Request, context: RouteContext) {
    try {
        const admin = await requireAtomquestUser()
        if (!isAdminRole(resolveUserRole(admin))) throw new Error('FORBIDDEN')

        const { userId } = await context.params
        const body = patchSchema.safeParse(await request.json())
        if (!body.success) return jsonError('Invalid role', 400)

        await updateUserById(userId, { role: body.data.role })
        const employee = await findUserById(userId)
        return jsonOk({ employee })
    } catch (e) {
        return handleApiError(e)
    }
}
