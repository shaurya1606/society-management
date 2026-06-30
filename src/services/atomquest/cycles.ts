import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import {
    CHECK_IN_PHASE_ORDER,
    getCalendarCheckInPhase,
    getPerformanceYear,
    isCycleWindowOpen,
} from '@/lib/atomquest/cycle-utils'
import {
    CyclePhase,
    type SelectPerformanceCycle,
    performanceCyclesTable,
} from '@/lib/dbconfig/atomquest'

export { getPerformanceYear, isCycleWindowOpen } from '@/lib/atomquest/cycle-utils'

function resolveYearCandidates(explicitYear?: number): number[] {
    if (explicitYear !== undefined) return [explicitYear]
    const now = new Date()
    return [...new Set([getPerformanceYear(now), now.getFullYear()])]
}

export async function getCycleByPhase(
    phase: CyclePhase,
    year?: number
): Promise<SelectPerformanceCycle | null> {
    for (const y of resolveYearCandidates(year)) {
        const [cycle] = await db
            .select()
            .from(performanceCyclesTable)
            .where(
                and(
                    eq(performanceCyclesTable.phase, phase),
                    eq(performanceCyclesTable.year, y)
                )
            )
            .limit(1)
        if (cycle) return cycle
    }
    return null
}

export async function listPerformanceCycles(year?: number) {
    const y = year ?? getPerformanceYear()
    return db
        .select()
        .from(performanceCyclesTable)
        .where(eq(performanceCyclesTable.year, y))
        .orderBy(asc(performanceCyclesTable.phase))
}

export async function assertCycleOpen(phase: CyclePhase) {
    const cycle = await getCycleByPhase(phase)
    if (!cycle) {
        throw new Error(`No active cycle configured for ${phase}.`)
    }
    if (!isCycleWindowOpen(cycle)) {
        throw new Error(`The ${phase} window is not open.`)
    }
    return cycle
}

/** Active check-in quarter: single open window, else calendar quarter (demo seed). */
export async function resolveActiveCheckInPhase(
    year?: number
): Promise<CyclePhase> {
    const open: CyclePhase[] = []
    for (const phase of CHECK_IN_PHASE_ORDER) {
        const cycle = await getCycleByPhase(phase, year)
        if (cycle && isCycleWindowOpen(cycle)) {
            open.push(phase)
        }
    }
    if (open.length === 1) return open[0]!
    return getCalendarCheckInPhase()
}

export async function getCheckInQuarterStatuses(year?: number) {
    const activePhase = await resolveActiveCheckInPhase(year)
    const quarters = await Promise.all(
        CHECK_IN_PHASE_ORDER.map(async (phase) => {
            const cycle = await getCycleByPhase(phase, year)
            const isOpen = cycle ? isCycleWindowOpen(cycle) : false
            return {
                phase,
                isOpen,
                isActive: phase === activePhase,
                opensAt: cycle?.opensAt ?? null,
                closesAt: cycle?.closesAt ?? null,
            }
        })
    )
    return { activePhase, quarters }
}
