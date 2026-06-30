import { auth } from '@/auth'
import { UserRole } from '@/lib/dbconfig/schema'
import {
    isAdminRole,
    isEmployeeRole,
    isManagerRole,
} from '@/lib/atomquest/roles'
import type { Session } from 'next-auth'

type RequiredRole = UserRole | 'employee' | 'manager' | 'admin'

type RoleHandler<T> = (session: Session) => Promise<T>

const normalizeRequiredRole = (role: RequiredRole): UserRole => {
    if (role === 'employee') return UserRole.EMPLOYEE
    if (role === 'manager') return UserRole.MANAGER
    if (role === 'admin') return UserRole.ADMIN
    return role
}

const resolveRoleLevel = (role: UserRole | undefined) => {
    const normalized = role ?? UserRole.EMPLOYEE

    if (isAdminRole(normalized)) return 3
    if (isManagerRole(normalized)) return 2
    if (isEmployeeRole(normalized)) return 1

    return 1
}

export async function withRole<T>(
    requiredRole: RequiredRole,
    handler: RoleHandler<T>
): Promise<T> {
    const session = await auth()

    if (!session?.user) {
        throw new Error('UNAUTHORIZED')
    }

    const userRole = session.user.role as UserRole | undefined
    const required = normalizeRequiredRole(requiredRole)

    if (resolveRoleLevel(userRole) < resolveRoleLevel(required)) {
        throw new Error('FORBIDDEN')
    }

    return handler(session)
}
