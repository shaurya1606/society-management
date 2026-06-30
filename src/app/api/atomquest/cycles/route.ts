import { handleApiError, jsonOk } from '@/lib/atomquest/api'
import {
    getQuarterLockState,
    quarterLockLabel,
} from '@/lib/atomquest/cycle-utils'
import { requireAtomquestUser } from '@/lib/atomquest/session'
import { getCheckInQuarterStatuses } from '@/services/atomquest/cycles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        await requireAtomquestUser()
        const { activePhase, quarters } = await getCheckInQuarterStatuses()

        return jsonOk({
            activeQuarter: activePhase,
            quarters: quarters.map((q) => {
                const lockState = getQuarterLockState(
                    q.phase,
                    activePhase,
                    q.isOpen
                )
                return {
                    phase: q.phase,
                    isOpen: q.isOpen,
                    isActive: q.isActive,
                    lockState,
                    lockLabel: quarterLockLabel(lockState),
                    opensAt: q.opensAt,
                    closesAt: q.closesAt,
                    editable: lockState === 'active',
                }
            }),
        })
    } catch (e) {
        return handleApiError(e)
    }
}
