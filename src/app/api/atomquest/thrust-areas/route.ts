import { handleApiError, jsonOk } from '@/lib/atomquest/api'
import { requireAtomquestUser } from '@/lib/atomquest/session'
import { listActiveThrustAreas } from '@/lib/queries/atomquest/catalog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        await requireAtomquestUser()
        const areas = await listActiveThrustAreas()
        return jsonOk({ thrustAreas: areas })
    } catch (e) {
        return handleApiError(e)
    }
}
