import { auth } from '@/auth'
import { handleApiError, jsonError, jsonOk } from '@/lib/atomquest/api'
import { UserRole } from '@/lib/dbconfig/schema'
import {
    getComplaintCountsByCategory,
    getComplaintCountsByStatus,
    getHighPriorityOpenComplaintsCount,
    getLatestComplaints,
    getOverdueComplaintsCount,
} from '@/lib/queries/society/dashboard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const adminCapableRoles = new Set<UserRole>([
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
])

function isAdminCapable(role: UserRole | undefined) {
    return role ? adminCapableRoles.has(role) : false
}

export async function GET() {
    try {
        const session = await auth()
        const user = session?.user
        if (!user?.id || !isAdminCapable(user.role)) {
            return jsonError('Forbidden', 403)
        }

        const [complaintCountsByStatus, complaintCountsByCategory, overdueCount, highPriorityOpenCount, latestComplaints] =
            await Promise.all([
                getComplaintCountsByStatus(),
                getComplaintCountsByCategory(),
                getOverdueComplaintsCount(),
                getHighPriorityOpenComplaintsCount(),
                getLatestComplaints(10),
            ])

        return jsonOk({
            ok: true,
            data: {
                complaintCountsByStatus,
                complaintCountsByCategory,
                overdueCount,
                highPriorityOpenCount,
                latestComplaints,
            },
        })
    } catch (error) {
        return handleApiError(error)
    }
}