import {
    boolean,
    foreignKey,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
} from 'drizzle-orm/pg-core'

/** AtomQuest portal roles */
export enum UserRole {
    EMPLOYEE = 'EMPLOYEE',
    MANAGER = 'MANAGER',
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
    /** @deprecated Legacy value — treat the same as EMPLOYEE */
    USER = 'USER',
}

export const roleEnum = pgEnum('role', [
    'EMPLOYEE',
    'MANAGER',
    'ADMIN',
    'SUPER_ADMIN',
    'USER',
])

export const usersTable = pgTable(
    'user',
    {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').notNull().unique(),
    // NextAuth expects camelCase column names like `emailVerified`
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
    password: text('password'),
    role: roleEnum('role').notNull().default(UserRole.EMPLOYEE),
    department: text('department'),
    managerId: text('manager_id'),
    isTwoFactorEnabled: boolean('isTwoFactorEnabled').default(false),
    // Optional reference id to a two-factor confirmation record (not enforced as FK
    // to avoid circular constraints). Stores the id from `twoFactorConfirmation` table
    // when present so you can query both directions without requiring a DB-level FK.
    twoFactorConfirmationId: text('twoFactorConfirmationId'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
        () => new Date()
    ),
    },
    (table) => [
        foreignKey({
            columns: [table.managerId],
            foreignColumns: [table.id],
            name: 'user_manager_id_fk',
        }).onDelete('set null'),
    ]
)

/** True for employee-facing users (includes legacy USER role). */
export const isEmployeeRole = (role: UserRole) =>
    role === UserRole.EMPLOYEE || role === UserRole.USER

export type AdapterAccountType = 'oauth' | 'oidc' | 'email' | 'webauthn'

export const accountsTable = pgTable(
    'account',
    {
        userId: text('userId')
            .notNull()
            .references(() => usersTable.id, { onDelete: 'cascade' }),
        type: text('type').$type<AdapterAccountType>().notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (account) => [
        primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    ]
)

export const verificationTokensTable = pgTable(
    'verificationToken',
    {
        id: text('id')
            .notNull()
            .$defaultFn(() => crypto.randomUUID()),
        token: text('token').notNull().unique(),
        email: text('email').notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [
                    verificationToken.id,
                    verificationToken.token,
                    verificationToken.email,
                ],
            }),
        },
    ]
)

export const resetPasswordTokensTable = pgTable(
    'resetPasswordToken',
    {
        id: text('id')
            .notNull()
            .$defaultFn(() => crypto.randomUUID()),
        token: text('token').notNull().unique(),
        email: text('email').notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (resetPasswordToken) => [
        {
            compositePk: primaryKey({
                columns: [resetPasswordToken.token, resetPasswordToken.email],
            }),
        },
    ]
)

export const twoFactorTokensTable = pgTable(
    'twoFactorTokens',
    {
        id: text('id')
            .notNull()
            .$defaultFn(() => crypto.randomUUID()),
        token: text('token').notNull().unique(),
        email: text('email').notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (twoFactorTokens) => [
        {
            compositePk: primaryKey({
                columns: [
                    twoFactorTokens.id,
                    twoFactorTokens.token,
                    twoFactorTokens.email,
                ],
            }),
        },
    ]
)

export const twoFactorConfirmationTable = pgTable('twoFactorConfirmation', {
    id: text('id')
        .notNull()
        .$defaultFn(() => crypto.randomUUID()),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    userId: text('userId')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .unique(),
})
export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect

export type InsertAccount = typeof accountsTable.$inferInsert
export type SelectAccount = typeof accountsTable.$inferSelect

export type InsertVerificationToken =
    typeof verificationTokensTable.$inferInsert
export type SelectVerificationToken =
    typeof verificationTokensTable.$inferSelect

export type InsertResetPasswordToken =
    typeof resetPasswordTokensTable.$inferInsert
export type SelectResetPasswordToken =
    typeof resetPasswordTokensTable.$inferSelect

export type InsertTwoFactorToken = typeof twoFactorTokensTable.$inferInsert
export type SelectTwoFactorToken = typeof twoFactorTokensTable.$inferSelect

export type InsertTwoFactorConfirmation =
    typeof twoFactorConfirmationTable.$inferInsert
export type SelectTwoFactorConfirmation =
    typeof twoFactorConfirmationTable.$inferSelect