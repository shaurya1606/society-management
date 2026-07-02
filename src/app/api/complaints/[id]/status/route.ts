import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { handleApiError, jsonError, jsonOk } from '@/lib/api/response'
import { UserRole } from '@/lib/dbconfig/schema'
import { getComplaintById } from '@/lib/queries/society/complaints'
import { transitionComplaintStatus } from '@/services/society/status-history'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ id: string }> }

const statusSchema = z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
    note: z.string().trim().optional(),
})

const adminCapableRoles = new Set<UserRole>([
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
])

function isAdminCapable(role: UserRole | undefined) {
    return role ? adminCapableRoles.has(role) : false
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const session = await auth()
        const user = session?.user
        if (!user?.id || !isAdminCapable(user.role)) {
            return jsonError('Forbidden', 403)
        }

        const body = statusSchema.safeParse(await request.json())
        if (!body.success) {
            return jsonError('Invalid fields', 400)
        }

        const { id } = await context.params
        const existing = await getComplaintById(id)
        if (!existing) {
            return jsonError('Not found', 404)
        }

        const complaint = await transitionComplaintStatus({
            complaintId: id,
            toStatus: body.data.status,
            actorId: user.id,
            note: body.data.note ?? null,
        })

        return jsonOk({ ok: true, data: { complaint } })
    } catch (error) {
        return handleApiError(error)
    }
}