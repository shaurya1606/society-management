import { auth } from '@/auth'
import { findUserById } from '@/lib/queries/users/select'
import type { SelectUser } from '@/lib/dbconfig/schema'
import { UserRole } from '@/lib/dbconfig/schema'

export async function getAtomquestUser(): Promise<SelectUser | null> {
    const session = await auth()
    if (!session?.user?.id) return null
    return findUserById(session.user.id)
}

export async function requireAtomquestUser(): Promise<SelectUser> {
    const user = await getAtomquestUser()
    if (!user) {
        throw new Error('UNAUTHORIZED')
    }
    return user
}

export function resolveUserRole(user: SelectUser): UserRole {
    return (user.role ?? UserRole.EMPLOYEE) as UserRole
}
