import { UserRole, isEmployeeRole } from '@/lib/dbconfig/schema'

export { isEmployeeRole }

export const isManagerRole = (role: UserRole) => role === UserRole.MANAGER

export const isAdminRole = (role: UserRole) =>
    role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN

export const roleHomePath = (role: UserRole) => {
    if (isAdminRole(role)) return '/admin/atomquest'
    if (isManagerRole(role)) return '/team'
    return '/goals'
}

export function roleDisplayLabel(role: UserRole | undefined): string {
    if (!role || role === UserRole.USER) return 'Employee'
    if (role === UserRole.EMPLOYEE) return 'Employee'
    if (role === UserRole.MANAGER) return 'Manager'
    if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) return 'Admin'
    return 'Employee'
}
