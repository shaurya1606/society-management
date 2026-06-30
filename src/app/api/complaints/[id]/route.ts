import { auth } from '@/auth'
import { handleApiError, jsonError, jsonOk } from '@/lib/atomquest/api'
import { UserRole } from '@/lib/dbconfig/schema'
import { getComplaintById } from '@/lib/queries/society/complaints'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ id: string }> }

const adminCapableRoles = new Set<UserRole>([
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
])

function isAdminCapable(role: UserRole | undefined) {
    return role ? adminCapableRoles.has(role) : false
}

export async function GET(_request: Request, context: RouteContext) {
    try {
        const session = await auth()
        const user = session?.user
        if (!user?.id) {
            return jsonError('Unauthorized', 401)
        }

        const { id } = await context.params
        const complaint = await getComplaintById(id)

        if (!complaint) {
            return jsonError('Not found', 404)
        }

        if (!isAdminCapable(user.role) && complaint.residentId !== user.id) {
            return jsonError('Forbidden', 403)
        }

        return jsonOk({ ok: true, data: { complaint } })
    } catch (error) {
        return handleApiError(error)
    }
}