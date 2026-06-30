import { and, desc, eq, gte, inArray, lte } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import {
    type ComplaintPriority,
    type ComplaintStatus,
    type SelectComplaint,
    complaintPriorityEnum,
    complaintStatusEnum,
    complaintsTable,
} from '@/lib/dbconfig/society'
import { getOverdueThresholdDays, sortComplaintsOverdueFirst } from '@/services/society/overdue'

type DatabaseClient = typeof db

export type ComplaintDateRange = {
    createdFrom?: Date
    createdTo?: Date
}

export type ComplaintAdminFilters = ComplaintDateRange & {
    status?: ComplaintStatus | ComplaintStatus[]
    category?: string | string[]
    priority?: ComplaintPriority | ComplaintPriority[]
    overdueFirst?: boolean
}

export type CreateComplaintInput = {
    residentId: string
    title: string
    category: string
    description: string
    photoUrl?: string | null
    status?: ComplaintStatus
    priority?: ComplaintPriority
    resolvedAt?: Date | null
}

export type UpdateComplaintStatusInput = {
    complaintId: string
    status: ComplaintStatus
    resolvedAt?: Date | null
}

export type UpdateComplaintPriorityInput = {
    complaintId: string
    priority: ComplaintPriority
}

const resolveListValue = <T>(value?: T | T[]) =>
    value == null ? [] : Array.isArray(value) ? value : [value]

function buildComplaintWhere(filters: ComplaintAdminFilters = {}) {
    const conditions = [] as Parameters<typeof and>[0][]

    const statusValues = resolveListValue(filters.status)
    if (statusValues.length > 0) {
        conditions.push(inArray(complaintsTable.status, statusValues))
    }

    const categoryValues = resolveListValue(filters.category)
    if (categoryValues.length > 0) {
        conditions.push(inArray(complaintsTable.category, categoryValues))
    }

    const priorityValues = resolveListValue(filters.priority)
    if (priorityValues.length > 0) {
        conditions.push(inArray(complaintsTable.priority, priorityValues))
    }

    if (filters.createdFrom) {
        conditions.push(gte(complaintsTable.createdAt, filters.createdFrom))
    }

    if (filters.createdTo) {
        conditions.push(lte(complaintsTable.createdAt, filters.createdTo))
    }

    return conditions.length > 0 ? and(...conditions) : undefined
}

export async function createComplaint(
    input: CreateComplaintInput,
    client: DatabaseClient = db
): Promise<SelectComplaint> {
    const [row] = await client
        .insert(complaintsTable)
        .values({
            residentId: input.residentId,
            title: input.title,
            category: input.category,
            description: input.description,
            photoUrl: input.photoUrl ?? null,
            status: input.status ?? complaintStatusEnum.enumValues[0],
            priority: input.priority ?? complaintPriorityEnum.enumValues[0],
            resolvedAt: input.resolvedAt ?? null,
        })
        .returning()

    return row
}

export async function getComplaintById(
    complaintId: string,
    client: DatabaseClient = db
): Promise<SelectComplaint | null> {
    const [row] = await client
        .select()
        .from(complaintsTable)
        .where(eq(complaintsTable.id, complaintId))
        .limit(1)

    return row ?? null
}

export async function getComplaintsForResident(
    residentId: string,
    client: DatabaseClient = db
): Promise<SelectComplaint[]> {
    return client
        .select()
        .from(complaintsTable)
        .where(eq(complaintsTable.residentId, residentId))
        .orderBy(desc(complaintsTable.createdAt))
}

export async function getAllComplaintsForAdmin(
    filters: ComplaintAdminFilters = {},
    client: DatabaseClient = db
): Promise<SelectComplaint[]> {
    const rows = await client
        .select()
        .from(complaintsTable)
        .where(buildComplaintWhere(filters))
        .orderBy(desc(complaintsTable.createdAt))

    if (!filters.overdueFirst) {
        return rows
    }

    const overdueThresholdDays = await getOverdueThresholdDays(client)
    return sortComplaintsOverdueFirst(rows, overdueThresholdDays)
}

export async function updateComplaintStatus(
    input: UpdateComplaintStatusInput,
    client: DatabaseClient = db
): Promise<SelectComplaint | null> {
    const [row] = await client
        .update(complaintsTable)
        .set({
            status: input.status,
            ...(input.resolvedAt ? { resolvedAt: input.resolvedAt } : {}),
        })
        .where(eq(complaintsTable.id, input.complaintId))
        .returning()

    return row ?? null
}

export async function updateComplaintPriority(
    input: UpdateComplaintPriorityInput,
    client: DatabaseClient = db
): Promise<SelectComplaint | null> {
    const [row] = await client
        .update(complaintsTable)
        .set({ priority: input.priority })
        .where(eq(complaintsTable.id, input.complaintId))
        .returning()

    return row ?? null
}