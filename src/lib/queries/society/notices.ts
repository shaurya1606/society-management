import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import { type SelectNotice, noticesTable } from '@/lib/dbconfig/society'

type DatabaseClient = typeof db

export type CreateNoticeInput = {
    title: string
    body: string
    isImportant?: boolean
    createdById: string
}

export async function createNotice(
    input: CreateNoticeInput,
    client: DatabaseClient = db
): Promise<SelectNotice> {
    const [row] = await client
        .insert(noticesTable)
        .values({
            title: input.title,
            body: input.body,
            isImportant: input.isImportant ?? false,
            createdById: input.createdById,
        })
        .returning()

    return row
}

export async function listNotices(
    client: DatabaseClient = db
): Promise<SelectNotice[]> {
    return client
        .select()
        .from(noticesTable)
        .orderBy(desc(noticesTable.createdAt))
}

export async function listImportantNoticesPinnedFirst(
    client: DatabaseClient = db
): Promise<SelectNotice[]> {
    return client
        .select()
        .from(noticesTable)
        .orderBy(desc(noticesTable.isImportant), desc(noticesTable.createdAt))
}

export async function getNoticeById(
    noticeId: string,
    client: DatabaseClient = db
): Promise<SelectNotice | null> {
    const [row] = await client
        .select()
        .from(noticesTable)
        .where(eq(noticesTable.id, noticeId))
        .limit(1)

    return row ?? null
}