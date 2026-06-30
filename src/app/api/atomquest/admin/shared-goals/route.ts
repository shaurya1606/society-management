import { UomType } from '@/lib/dbconfig/atomquest'
import { handleApiError, jsonError, jsonOk } from '@/lib/atomquest/api'
import { isAdminRole } from '@/lib/atomquest/roles'
import {
    requireAtomquestUser,
    resolveUserRole,
} from '@/lib/atomquest/session'
import { assignSharedGoal } from '@/lib/queries/atomquest/shared-goals'
import { z } from 'zod'

const assignSchema = z.object({
    title: z.string().trim().min(1),
    description: z.string().optional(),
    thrustAreaId: z.string().min(1),
    uomType: z.nativeEnum(UomType),
    targetValue: z.string().optional(),
    targetDeadline: z.string().optional(),
    weightage: z.coerce.number().int().min(10).max(100),
    primaryOwnerUserId: z.string().min(1),
    employeeIds: z.array(z.string()).min(1),
})

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const user = await requireAtomquestUser()
        const role = resolveUserRole(user)
        if (!isAdminRole(role)) throw new Error('FORBIDDEN')

        const body = assignSchema.safeParse(await request.json())
        if (!body.success) {
            return jsonError(body.error.issues[0]?.message ?? 'Invalid payload', 400)
        }

        const data = body.data
        const result = await assignSharedGoal({
            title: data.title,
            description: data.description ?? null,
            thrustAreaId: data.thrustAreaId,
            uomType: data.uomType,
            targetValue: data.targetValue ?? null,
            targetDeadline: data.targetDeadline
                ? new Date(data.targetDeadline)
                : null,
            weightage: data.weightage,
            primaryOwnerUserId: data.primaryOwnerUserId,
            employeeIds: data.employeeIds,
            createdById: user.id,
        })

        return jsonOk(result)
    } catch (e) {
        return handleApiError(e)
    }
}
