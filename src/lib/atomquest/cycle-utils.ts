import { CyclePhase, type SelectPerformanceCycle } from '@/lib/dbconfig/atomquest'

export const CHECK_IN_PHASE_ORDER: CyclePhase[] = [
    CyclePhase.Q1,
    CyclePhase.Q2,
    CyclePhase.Q3,
    CyclePhase.Q4,
]

export type QuarterLockState = 'active' | 'past' | 'future' | 'closed'

/** April–March fiscal year label stored in performance_cycle.year */
export function getPerformanceYear(date = new Date()): number {
    const month = date.getMonth()
    const calendarYear = date.getFullYear()
    return month >= 3 ? calendarYear : calendarYear - 1
}

/** Demo-friendly: cycle is open if now is within window OR isActive. */
export function isCycleWindowOpen(
    cycle: SelectPerformanceCycle,
    now = new Date()
) {
    return (
        cycle.isActive &&
        now >= new Date(cycle.opensAt) &&
        now <= new Date(cycle.closesAt)
    )
}

/** Format cycle window dates without local timezone shifting calendar days. */
/** Calendar quarter for demo when multiple check-in windows overlap in seed data. */
export function getCalendarCheckInPhase(now = new Date()): CyclePhase {
    const month = now.getMonth()
    if (month < 3) return CyclePhase.Q1
    if (month < 6) return CyclePhase.Q2
    if (month < 9) return CyclePhase.Q3
    return CyclePhase.Q4
}

export function compareCheckInPhases(a: CyclePhase, b: CyclePhase): number {
    return (
        CHECK_IN_PHASE_ORDER.indexOf(a) - CHECK_IN_PHASE_ORDER.indexOf(b)
    )
}

export function getQuarterLockState(
    phase: CyclePhase,
    activePhase: CyclePhase,
    cycleOpen: boolean
): QuarterLockState {
    if (!cycleOpen) return 'closed'
    const cmp = compareCheckInPhases(phase, activePhase)
    if (cmp < 0) return 'past'
    if (cmp > 0) return 'future'
    return 'active'
}

export function quarterLockLabel(state: QuarterLockState): string {
    switch (state) {
        case 'active':
            return 'Active quarter'
        case 'past':
            return 'Locked — past quarter'
        case 'future':
            return 'Locked — not yet open'
        case 'closed':
            return 'Closed — outside window'
    }
}

export function formatCycleDate(value: Date | string | null | undefined): string {
    if (!value) return '—'
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    })
}
