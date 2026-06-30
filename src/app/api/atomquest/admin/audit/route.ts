import { handleApiError, jsonOk } from '@/lib/atomquest/api'
import { isAdminRole } from '@/lib/atomquest/roles'
import {
    requireAtomquestUser,
    resolveUserRole,
} from '@/lib/atomquest/session'
import { listAuditLogs } from '@/lib/queries/atomquest/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const user = await requireAtomquestUser()
        const role = resolveUserRole(user)
        if (!isAdminRole(role)) throw new Error('FORBIDDEN')

        const logs = await listAuditLogs(150)
        return jsonOk({ logs })
    } catch (e) {
        return handleApiError(e)
    }
}
