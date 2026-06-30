import { eq } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import { UserRole, usersTable } from '@/lib/dbconfig/schema'

export async function updateUserEmailVerified(
    userId: string,
    emailVerified: Date
): Promise<void> {
    await db
        .update(usersTable)
        .set({ emailVerified })
        .where(eq(usersTable.id, userId))
}

export async function updateUserEmailVerifiedByEmail(
    email: string
): Promise<void> {
    await db
        .update(usersTable)
        .set({ emailVerified: new Date() })
        .where(eq(usersTable.email, email))
}

export async function updateUserPasswordByEmail(
    email: string,
    hashedPassword: string
): Promise<void> {
    await db
        .update(usersTable)
        .set({ password: hashedPassword })
        .where(eq(usersTable.email, email))
}

export async function updateUserById(
    userId: string,
    data: {
        name?: string
        email?: string
        password?: string
        role?: UserRole
        isTwoFactorEnabled?: boolean
    }
): Promise<void> {
    await db.update(usersTable).set(data).where(eq(usersTable.id, userId))
}
