import {
    boolean,
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
} from 'drizzle-orm/pg-core'
import { usersTable } from './schema'

export const complaintStatusEnum = pgEnum('complaint_status', [
    'OPEN',
    'IN_PROGRESS',
    'RESOLVED',
])

export const complaintPriorityEnum = pgEnum('complaint_priority', [
    'LOW',
    'MEDIUM',
    'HIGH',
])

export const emailLogTypeEnum = pgEnum('email_log_type', [
    'STATUS_CHANGE',
    'IMPORTANT_NOTICE',
])

export const emailDeliveryStatusEnum = pgEnum('email_delivery_status', [
    'SENT',
    'FAILED',
])

export type ComplaintStatus =
    (typeof complaintStatusEnum.enumValues)[number]
export type ComplaintPriority =
    (typeof complaintPriorityEnum.enumValues)[number]
export type EmailLogType = (typeof emailLogTypeEnum.enumValues)[number]
export type EmailDeliveryStatus =
    (typeof emailDeliveryStatusEnum.enumValues)[number]

export const complaintsTable = pgTable(
    'complaint',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        residentId: text('resident_id')
            .notNull()
            .references(() => usersTable.id, { onDelete: 'restrict' }),
        title: text('title').notNull(),
        category: text('category').notNull(),
        description: text('description').notNull(),
        photoUrl: text('photo_url'),
        status: complaintStatusEnum('status').notNull().default('OPEN'),
        priority: complaintPriorityEnum('priority')
            .notNull()
            .default('MEDIUM'),
        resolvedAt: timestamp('resolved_at', { mode: 'date' }),
        createdAt: timestamp('created_at', { mode: 'date' })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
            () => new Date()
        ),
    },
    (table) => [
        index('complaint_resident_id_idx').on(table.residentId),
        index('complaint_status_idx').on(table.status),
        index('complaint_priority_idx').on(table.priority),
        index('complaint_category_idx').on(table.category),
        index('complaint_created_at_idx').on(table.createdAt),
    ]
)

export const complaintStatusHistoryTable = pgTable(
    'complaint_status_history',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        complaintId: text('complaint_id')
            .notNull()
            .references(() => complaintsTable.id, { onDelete: 'cascade' }),
        fromStatus: complaintStatusEnum('from_status').notNull(),
        toStatus: complaintStatusEnum('to_status').notNull(),
        actorId: text('actor_id')
            .notNull()
            .references(() => usersTable.id, { onDelete: 'restrict' }),
        note: text('note'),
        createdAt: timestamp('created_at', { mode: 'date' })
            .defaultNow()
            .notNull(),
    },
    (table) => [index('complaint_status_history_complaint_id_idx').on(table.complaintId)]
)

export const noticesTable = pgTable(
    'notice',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        title: text('title').notNull(),
        body: text('body').notNull(),
        isImportant: boolean('is_important').notNull().default(false),
        createdById: text('created_by_id')
            .notNull()
            .references(() => usersTable.id, { onDelete: 'restrict' }),
        createdAt: timestamp('created_at', { mode: 'date' })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
            () => new Date()
        ),
    },
    (table) => [index('notice_is_important_idx').on(table.isImportant)]
)

export const emailLogsTable = pgTable(
    'email_log',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        recipientEmail: text('recipient_email').notNull(),
        type: emailLogTypeEnum('type').notNull(),
        relatedComplaintId: text('related_complaint_id').references(
            () => complaintsTable.id,
            { onDelete: 'set null' }
        ),
        relatedNoticeId: text('related_notice_id').references(
            () => noticesTable.id,
            { onDelete: 'set null' }
        ),
        status: emailDeliveryStatusEnum('status').notNull().default('SENT'),
        createdAt: timestamp('created_at', { mode: 'date' })
            .defaultNow()
            .notNull(),
    },
    (table) => [index('email_log_recipient_email_idx').on(table.recipientEmail)]
)

export const appSettingsTable = pgTable('app_settings', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    overdueThresholdDays: integer('overdue_threshold_days')
        .notNull()
        .default(7),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
        () => new Date()
    ),
})

export type InsertComplaint = typeof complaintsTable.$inferInsert
export type SelectComplaint = typeof complaintsTable.$inferSelect

export type InsertComplaintStatusHistory =
    typeof complaintStatusHistoryTable.$inferInsert
export type SelectComplaintStatusHistory =
    typeof complaintStatusHistoryTable.$inferSelect

export type InsertNotice = typeof noticesTable.$inferInsert
export type SelectNotice = typeof noticesTable.$inferSelect

export type InsertEmailLog = typeof emailLogsTable.$inferInsert
export type SelectEmailLog = typeof emailLogsTable.$inferSelect

export type InsertAppSetting = typeof appSettingsTable.$inferInsert
export type SelectAppSetting = typeof appSettingsTable.$inferSelect