import { UserRole } from '@/lib/dbconfig/schema'
import { isAdminRole, isManagerRole } from './roles'

type EmployeeLike = {
    managerId?: string | null
    role?: UserRole | string | null
}

export function canAccessTeamMember(
    viewerRole: UserRole,
    viewerId: string,
    employee: EmployeeLike | null | undefined
): boolean {
    if (!employee) return false
    if (isAdminRole(viewerRole)) return true
    if (isManagerRole(viewerRole) && employee.managerId === viewerId) {
        return true
    }
    return false
}
