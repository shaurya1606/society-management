import { eq } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import { usersTable } from '@/lib/dbconfig/schema'

export async function listDirectReports(managerId: string) {
    return db
        .select()
        .from(usersTable)
        .where(eq(usersTable.managerId, managerId))
}
