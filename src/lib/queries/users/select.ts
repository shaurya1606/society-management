import { eq } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import { SelectUser, usersTable } from '@/lib/dbconfig/schema'

export async function findUserByEmail(
    email: SelectUser['email']
): Promise<SelectUser | null> {
    if (email == null) {
        return null
    }

    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)

    return user ?? null
}

export async function findUserById(
    id: SelectUser['id']
): Promise<SelectUser | null> {
    if (id == null) {
        return null
    }

    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1)

    return user ?? null
}
