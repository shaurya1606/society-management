import { db } from '@/lib/dbconfig/db'
import { accountsTable } from '@/lib/dbconfig/schema'
import { eq } from 'drizzle-orm'

export const findTwoAccountsByUserId = async (UserId: string) => {
    try {
        const account = await db
            .select()
            .from(accountsTable)
            .where(eq(accountsTable.userId, UserId))
            .limit(1)
            .then((result) => result[0] || null)

        return account
    } catch (error) {
        console.error('Error finding the accounts details:', error)
        throw new Error('Could not find accounts details')
    }
}
