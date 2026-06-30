import { db } from '@/lib/dbconfig/db'
import { InsertUser, SelectUser, usersTable } from '@/lib/dbconfig/schema'

export async function createUser(data: InsertUser): Promise<SelectUser> {
    const [createdUser] = await db.insert(usersTable).values(data).returning()

    if (!createdUser) {
        throw new Error('Unable to create user')
    }

    return createdUser
}
