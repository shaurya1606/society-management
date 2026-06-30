import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import {
    type AuditEntityType,
    auditLogsTable,
} from '@/lib/dbconfig/atomquest'
import { usersTable } from '@/lib/dbconfig/schema'

export async function writeAuditLog(input: {
    entityType: AuditEntityType
    entityId: string
    action: string
    changes?: Record<string, unknown>
    changedById: string
}) {
    await db.insert(auditLogsTable).values({
        entityType: input.entityType,
        entityId: input.entityId,
        action: input.action,
        changes: input.changes ?? null,
        changedById: input.changedById,
    })
}

export async function listAuditLogs(limit = 100) {
    const rows = await db
        .select({
            id: auditLogsTable.id,
            entityType: auditLogsTable.entityType,
            entityId: auditLogsTable.entityId,
            action: auditLogsTable.action,
            changes: auditLogsTable.changes,
            createdAt: auditLogsTable.createdAt,
            changedById: auditLogsTable.changedById,
            changedByName: usersTable.name,
            changedByEmail: usersTable.email,
        })
        .from(auditLogsTable)
        .leftJoin(usersTable, eq(auditLogsTable.changedById, usersTable.id))
        .orderBy(desc(auditLogsTable.createdAt))
        .limit(limit)

    return rows
}
