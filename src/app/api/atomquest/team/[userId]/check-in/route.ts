import { CyclePhase } from '@/lib/dbconfig/atomquest'
import { handleApiError, jsonError, jsonOk } from '@/lib/atomquest/api'
import { isAdminRole, isManagerRole } from '@/lib/atomquest/roles'
import { canAccessTeamMember } from '@/lib/atomquest/team-access'
import {
    requireAtomquestUser,
    resolveUserRole,
} from '@/lib/atomquest/session'
import { upsertManagerCheckIn } from '@/lib/queries/atomquest/check-ins'
import { getCycleByPhase } from '@/services/atomquest/cycles'
import { assertCycleOpen } from '@/services/atomquest/cycles'
import { findUserById } from '@/lib/queries/users/select'

type RouteContext = { params: Promise<{ userId: string }> }

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
            period: CyclePhase
            comment: string
        }

        if (!body.comment?.trim()) {
            return jsonError('Check-in comment is required.', 400)
        }

        await assertCycleOpen(body.period)
        const cycle = await getCycleByPhase(body.period)
        if (!cycle) return jsonError('Cycle not found', 404)

        const checkIn = await upsertManagerCheckIn({
            employeeId: userId,
            managerId: manager.id,
            cycleId: cycle.id,
            period: body.period,
            comment: body.comment.trim(),
        })

        return jsonOk({ checkIn })
    } catch (e) {
        return handleApiError(e)
    }
}
