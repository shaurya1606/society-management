import {
    AchievementStatus,
    CyclePhase,
    GoalSheetStatus,
    UomType,
} from '@/lib/dbconfig/atomquest'

export type GoalSheetResponse = {
    cycle: {
        id: string
        name: string
        phase: CyclePhase
        year: number
        opensAt: string
        closesAt: string
        isActive: boolean
    }
    sheet: {
        id: string
        status: GoalSheetStatus
        submittedAt?: string | null
        returnReason?: string | null
    }
    goals: Array<{
        id: string
        title: string
        description?: string | null
        thrustAreaId: string
        uomType: UomType
        targetValue?: string | null
        targetDeadline?: string | null
        weightage: number
        isSharedRecipient?: boolean
        isPrimaryOwner?: boolean
        sharedGoalId?: string | null
    }>
    canEdit: boolean
}

export type ThrustAreaOption = {
    id: string
    name: string
    description?: string | null
}

export type GoalDraft = {
    id?: string
    title: string
    description: string
    thrustAreaId: string
    uomType: UomType
    targetValue: string
    targetDeadline: string
    weightage: number
    isSharedRecipient?: boolean
    isPrimaryOwner?: boolean
    sharedGoalId?: string | null
}

export type AuditLogRow = {
    id: string
    entityType: string
    entityId: string
    action: string
    changes: Record<string, unknown> | null
    createdAt: Date
    changedById: string
    changedByName: string | null
    changedByEmail: string | null
}

export type TeamListResponse = {
    cycle: { id: string; name: string; year: number }
    viewMode?: 'admin' | 'manager'
    team: Array<{
        user: {
            id: string
            name: string | null
            email: string
            department: string | null
        }
        sheet: {
            id: string
            status: GoalSheetStatus
            submittedAt?: string | null
        } | null
    }>
}

export type TeamMemberResponse = {
    employee: {
        id: string
        name: string | null
        email: string
        department: string | null
    }
    sheet: {
        id: string
        status: GoalSheetStatus
        returnReason?: string | null
    } | null
    goals: GoalSheetResponse['goals']
}

export type AdminEmployeeRow = {
    id: string
    name: string | null
    email: string
    department: string | null
    status: GoalSheetStatus | 'NONE'
}

export type AdminManagerRow = {
    id: string
    name: string | null
    email: string
    directReports: number
    approved: number
    pending: number
}

export type AdminStatsResponse = {
    totalEmployees: number
    submitted: number
    approved: number
    pendingApproval: number
    completionRate: number
    employees?: AdminEmployeeRow[]
    activeQuarter?: CyclePhase
    quarterCheckInCompleted?: number
    quarterCheckInPct?: number
    pendingReviews?: number
    achievementDistribution?: { name: string; value: number }[]
    managers?: AdminManagerRow[]
}

export type CheckInQuartersResponse = {
    activeQuarter: CyclePhase
    quarters: Array<{
        phase: CyclePhase
        isOpen: boolean
        isActive: boolean
        lockState: 'active' | 'past' | 'future' | 'closed'
        lockLabel: string
        editable: boolean
        opensAt: string | Date | null
        closesAt: string | Date | null
    }>
}

export const CHECK_IN_PERIODS = [
    CyclePhase.Q1,
    CyclePhase.Q2,
    CyclePhase.Q3,
    CyclePhase.Q4,
] as const

export const ACHIEVEMENT_OPTIONS: {
    value: AchievementStatus
    label: string
}[] = [
    { value: AchievementStatus.NOT_STARTED, label: 'Not started' },
    { value: AchievementStatus.ON_TRACK, label: 'On track' },
    { value: AchievementStatus.COMPLETED, label: 'Completed' },
]

export const UOM_OPTIONS: { value: UomType; label: string }[] = [
    { value: UomType.NUMERIC_MIN, label: 'Numeric (minimize)' },
    { value: UomType.PERCENT_MIN, label: 'Percent (minimize)' },
    { value: UomType.NUMERIC_MAX, label: 'Numeric (maximize)' },
    { value: UomType.PERCENT_MAX, label: 'Percent (maximize)' },
    { value: UomType.TIMELINE, label: 'Timeline' },
    { value: UomType.ZERO_BASED, label: 'Zero-based' },
]

export const emptyGoal = (): GoalDraft => ({
    title: '',
    description: '',
    thrustAreaId: '',
    uomType: UomType.NUMERIC_MIN,
    targetValue: '',
    targetDeadline: '',
    weightage: 10,
})
