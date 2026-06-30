import { and, desc, eq, lt, ne, sql } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import {
    type ComplaintStatus,
    complaintPriorityEnum,
    complaintStatusEnum,
    complaintsTable,
} from '@/lib/dbconfig/society'
import { getOverdueThresholdDays } from '@/services/society/overdue'
import { usersTable } from '@/lib/dbconfig/schema'

type DatabaseClient = typeof db

const countExpr = sql<number>`count(*)`.mapWith(Number)

export type ComplaintStatusCountRow = {
    status: ComplaintStatus
    count: number
}

export type CategoryCountRow = {
    category: string
    count: number
}

export type LatestComplaintRow = {
    id: string
    title: string
    category: string
    status: ComplaintStatus
    priority: (typeof complaintPriorityEnum.enumValues)[number]
    residentId: string
    residentName: string | null
    residentEmail: string | null
    createdAt: Date
    resolvedAt: Date | null
}

export async function getComplaintCountsByStatus(
    client: DatabaseClient = db
): Promise<ComplaintStatusCountRow[]> {
    const rows = await client
        .select({
            status: complaintsTable.status,
            count: countExpr,
        })
        .from(complaintsTable)
        .groupBy(complaintsTable.status)

    const byStatus = new Map(rows.map((row) => [row.status, row.count]))

    return complaintStatusEnum.enumValues.map((status) => ({
        status,
        count: byStatus.get(status) ?? 0,
    }))
}

export async function getComplaintCountsByCategory(
    client: DatabaseClient = db
): Promise<CategoryCountRow[]> {
    return client
        .select({
            category: complaintsTable.category,
            count: countExpr,
        })
        .from(complaintsTable)
        .groupBy(complaintsTable.category)
        .orderBy(desc(countExpr), complaintsTable.category)
}

export async function getOverdueComplaintsCount(
    client: DatabaseClient = db
): Promise<number> {
    const overdueThresholdDays = await getOverdueThresholdDays(client)
    const cutoff = new Date(Date.now() - overdueThresholdDays * 24 * 60 * 60 * 1000)

    const [row] = await client
        .select({ count: countExpr })
        .from(complaintsTable)
        .where(
            and(
                ne(complaintsTable.status, complaintStatusEnum.enumValues[2]),
                lt(complaintsTable.createdAt, cutoff)
            )
        )

    return row?.count ?? 0
}

export async function getHighPriorityOpenComplaintsCount(
    client: DatabaseClient = db
): Promise<number> {
    const [row] = await client
        .select({ count: countExpr })
        .from(complaintsTable)
        .where(
            and(
                eq(complaintsTable.status, complaintStatusEnum.enumValues[0]),
                eq(complaintsTable.priority, complaintPriorityEnum.enumValues[2])
            )
        )

    return row?.count ?? 0
}

export async function getLatestComplaints(
    limit = 10,
    client: DatabaseClient = db
): Promise<LatestComplaintRow[]> {
    return client
        .select({
            id: complaintsTable.id,
            title: complaintsTable.title,
            category: complaintsTable.category,
            status: complaintsTable.status,
            priority: complaintsTable.priority,
            residentId: complaintsTable.residentId,
            residentName: usersTable.name,
            residentEmail: usersTable.email,
            createdAt: complaintsTable.createdAt,
            resolvedAt: complaintsTable.resolvedAt,
        })
        .from(complaintsTable)
        .leftJoin(usersTable, eq(complaintsTable.residentId, usersTable.id))
        .orderBy(desc(complaintsTable.createdAt))
        .limit(limit)
}