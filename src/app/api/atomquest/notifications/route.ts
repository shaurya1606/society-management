import { handleApiError, jsonOk } from '@/lib/atomquest/api'
import { requireAtomquestUser, resolveUserRole } from '@/lib/atomquest/session'
import { listAuditLogs } from '@/lib/queries/atomquest/audit'
import { isAdminRole } from '@/lib/atomquest/roles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const user = await requireAtomquestUser()
        const role = resolveUserRole(user)

        const logs = await listAuditLogs(40)
        const items = logs
            .filter((log) => {
                if (isAdminRole(role)) return true
                return log.changedById === user.id
            })
            .slice(0, 25)
            .map((log) => ({
                id: log.id,
                title: log.action.replace(/_/g, ' '),
                body: `${log.entityType} · ${log.entityId.slice(0, 8)}…`,
                createdAt: log.createdAt,
                actor: log.changedByName ?? log.changedByEmail ?? 'System',
            }))

        return jsonOk({ items })
    } catch (e) {
        return handleApiError(e)
    }
}
