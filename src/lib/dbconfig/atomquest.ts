import {
    boolean,
    integer,
    jsonb,
    numeric,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from 'drizzle-orm/pg-core'
import { usersTable } from './schema'

export enum GoalSheetStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    RETURNED = 'RETURNED',
    LOCKED = 'LOCKED',
}

export enum UomType {
    NUMERIC_MIN = 'NUMERIC_MIN',
    PERCENT_MIN = 'PERCENT_MIN',
    NUMERIC_MAX = 'NUMERIC_MAX',
    PERCENT_MAX = 'PERCENT_MAX',
    TIMELINE = 'TIMELINE',
    ZERO_BASED = 'ZERO_BASED',
}

export enum AchievementStatus {
    NOT_STARTED = 'NOT_STARTED',
    ON_TRACK = 'ON_TRACK',
    COMPLETED = 'COMPLETED',
}

export enum CyclePhase {
    GOAL_SETTING = 'GOAL_SETTING',
    Q1 = 'Q1',
    Q2 = 'Q2',
    Q3 = 'Q3',
    Q4 = 'Q4',
}

export enum AuditEntityType {
    GOAL_SHEET = 'GOAL_SHEET',
    GOAL = 'GOAL',
    QUARTERLY_UPDATE = 'QUARTERLY_UPDATE',
    SHARED_GOAL = 'SHARED_GOAL',
}

export enum EscalationTrigger {
    GOALS_NOT_SUBMITTED = 'GOALS_NOT_SUBMITTED',
    GOALS_NOT_APPROVED = 'GOALS_NOT_APPROVED',
    CHECK_IN_NOT_COMPLETED = 'CHECK_IN_NOT_COMPLETED',
}

export enum EscalationStatus {
    OPEN = 'OPEN',
    RESOLVED = 'RESOLVED',
}

export const thrustAreasTable = pgTable('thrust_area', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull().unique(),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
        () => new Date()
    ),
})

export const performanceCyclesTable = pgTable(
    'performance_cycle',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        name: text('name').notNull(),
        year: integer('year').notNull(),
        phase: text('phase').$type<CyclePhase>().notNull(),
        opensAt: timestamp('opens_at', { mode: 'date' }).notNull(),
        closesAt: timestamp('closes_at', { mode: 'date' }).notNull(),
        isActive: boolean('is_active').notNull().default(true),
        createdAt: timestamp('created_at', { mode: 'date' })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
            () => new Date()
        ),
    },
    (table) => [
        uniqueIndex('performance_cycle_year_phase_idx').on(
            table.year,
            table.phase
        ),
    ]
)

export const goalSheetsTable = pgTable(
    'goal_sheet',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        userId: text('user_id')
            .notNull()
            .references(() => usersTable.id, { onDelete: 'cascade' }),
        cycleId: text('cycle_id')
            .notNull()
            .references(() => performanceCyclesTable.id, {
                onDelete: 'cascade',
            }),
        status: text('status')
            .$type<GoalSheetStatus>()
            .notNull()
            .default(GoalSheetStatus.DRAFT),
        submittedAt: timestamp('submitted_at', { mode: 'date' }),
        approvedById: text('approved_by_id').references(() => usersTable.id, {
            onDelete: 'set null',
        }),
        approvedAt: timestamp('approved_at', { mode: 'date' }),
        returnedAt: timestamp('returned_at', { mode: 'date' }),
        returnReason: text('return_reason'),
        unlockedAt: timestamp('unlocked_at', { mode: 'date' }),
        unlockedById: text('unlocked_by_id').references(() => usersTable.id, {
            onDelete: 'set null',
        }),
        createdAt: timestamp('created_at', { mode: 'date' })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
            () => new Date()
        ),
    },
    (table) => [
        uniqueIndex('goal_sheet_user_cycle_idx').on(table.userId, table.cycleId),
    ]
)

export const sharedGoalsTable = pgTable('shared_goal', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    description: text('description'),
    thrustAreaId: text('thrust_area_id')
        .notNull()
        .references(() => thrustAreasTable.id, { onDelete: 'restrict' }),
    uomType: text('uom_type').$type<UomType>().notNull(),
    targetValue: numeric('target_value', { precision: 14, scale: 4 }),
    targetDeadline: timestamp('target_deadline', { mode: 'date' }),
    primaryOwnerUserId: text('primary_owner_user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'restrict' }),
    createdById: text('created_by_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'restrict' }),
    cycleId: text('cycle_id')
        .notNull()
        .references(() => performanceCyclesTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
        () => new Date()
    ),
})

export const goalsTable = pgTable('goal', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    goalSheetId: text('goal_sheet_id')
        .notNull()
        .references(() => goalSheetsTable.id, { onDelete: 'cascade' }),
    thrustAreaId: text('thrust_area_id')
        .notNull()
        .references(() => thrustAreasTable.id, { onDelete: 'restrict' }),
    title: text('title').notNull(),
    description: text('description'),
    uomType: text('uom_type').$type<UomType>().notNull(),
    targetValue: numeric('target_value', { precision: 14, scale: 4 }),
    targetDeadline: timestamp('target_deadline', { mode: 'date' }),
    weightage: integer('weightage').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    sharedGoalId: text('shared_goal_id').references(() => sharedGoalsTable.id, {
        onDelete: 'cascade',
    }),
    isSharedRecipient: boolean('is_shared_recipient').notNull().default(false),
    isPrimaryOwner: boolean('is_primary_owner').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
        () => new Date()
    ),
})

export const quarterlyUpdatesTable = pgTable(
    'quarterly_update',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        goalId: text('goal_id')
            .notNull()
            .references(() => goalsTable.id, { onDelete: 'cascade' }),
        period: text('period').$type<CyclePhase>().notNull(),
        actualValue: numeric('actual_value', { precision: 14, scale: 4 }),
        actualCompletionDate: timestamp('actual_completion_date', {
            mode: 'date',
        }),
        achievementStatus: text('achievement_status')
            .$type<AchievementStatus>()
            .notNull()
            .default(AchievementStatus.NOT_STARTED),
        progressScore: numeric('progress_score', { precision: 7, scale: 4 }),
        notes: text('notes'),
        updatedById: text('updated_by_id')
            .notNull()
            .references(() => usersTable.id, { onDelete: 'restrict' }),
        createdAt: timestamp('created_at', { mode: 'date' })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
            () => new Date()
        ),
    },
    (table) => [
        uniqueIndex('quarterly_update_goal_period_idx').on(
            table.goalId,
            table.period
        ),
    ]
)

export const managerCheckInsTable = pgTable(
    'manager_check_in',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        employeeId: text('employee_id')
            .notNull()
            .references(() => usersTable.id, { onDelete: 'cascade' }),
        managerId: text('manager_id')
            .notNull()
            .references(() => usersTable.id, { onDelete: 'cascade' }),
        cycleId: text('cycle_id')
            .notNull()
            .references(() => performanceCyclesTable.id, {
                onDelete: 'cascade',
            }),
        period: text('period').$type<CyclePhase>().notNull(),
        comment: text('comment').notNull(),
        createdAt: timestamp('created_at', { mode: 'date' })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
            () => new Date()
        ),
    },
    (table) => [
        uniqueIndex('manager_check_in_employee_cycle_period_idx').on(
            table.employeeId,
            table.cycleId,
            table.period
        ),
    ]
)

export const auditLogsTable = pgTable('audit_log', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    entityType: text('entity_type').$type<AuditEntityType>().notNull(),
    entityId: text('entity_id').notNull(),
    action: text('action').notNull(),
    changes: jsonb('changes').$type<Record<string, unknown>>(),
    changedById: text('changed_by_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
})

export const escalationRulesTable = pgTable('escalation_rule', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    trigger: text('trigger').$type<EscalationTrigger>().notNull(),
    daysAfterTrigger: integer('days_after_trigger').notNull(),
    notifyEmployee: boolean('notify_employee').notNull().default(true),
    notifyManager: boolean('notify_manager').notNull().default(true),
    notifyHr: boolean('notify_hr').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
        () => new Date()
    ),
})

export const escalationEventsTable = pgTable('escalation_event', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    ruleId: text('rule_id')
        .notNull()
        .references(() => escalationRulesTable.id, { onDelete: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    cycleId: text('cycle_id').references(() => performanceCyclesTable.id, {
        onDelete: 'set null',
    }),
    status: text('status')
        .$type<EscalationStatus>()
        .notNull()
        .default(EscalationStatus.OPEN),
    resolvedAt: timestamp('resolved_at', { mode: 'date' }),
    resolvedById: text('resolved_by_id').references(() => usersTable.id, {
        onDelete: 'set null',
    }),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
})

export type InsertThrustArea = typeof thrustAreasTable.$inferInsert
export type SelectThrustArea = typeof thrustAreasTable.$inferSelect
export type InsertPerformanceCycle = typeof performanceCyclesTable.$inferInsert
export type SelectPerformanceCycle = typeof performanceCyclesTable.$inferSelect
export type InsertGoalSheet = typeof goalSheetsTable.$inferInsert
export type SelectGoalSheet = typeof goalSheetsTable.$inferSelect
export type InsertSharedGoal = typeof sharedGoalsTable.$inferInsert
export type SelectSharedGoal = typeof sharedGoalsTable.$inferSelect
export type InsertGoal = typeof goalsTable.$inferInsert
export type SelectGoal = typeof goalsTable.$inferSelect
export type InsertQuarterlyUpdate = typeof quarterlyUpdatesTable.$inferInsert
export type SelectQuarterlyUpdate = typeof quarterlyUpdatesTable.$inferSelect
export type InsertManagerCheckIn = typeof managerCheckInsTable.$inferInsert
export type SelectManagerCheckIn = typeof managerCheckInsTable.$inferSelect
export type InsertAuditLog = typeof auditLogsTable.$inferInsert
export type SelectAuditLog = typeof auditLogsTable.$inferSelect
export type InsertEscalationRule = typeof escalationRulesTable.$inferInsert
export type SelectEscalationRule = typeof escalationRulesTable.$inferSelect
export type InsertEscalationEvent = typeof escalationEventsTable.$inferInsert
export type SelectEscalationEvent = typeof escalationEventsTable.$inferSelect
