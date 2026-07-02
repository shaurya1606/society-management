import { UserRole } from '@/lib/dbconfig/schema'

export const isAdminRole = (role: UserRole) =>
    role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN

export function roleDisplayLabel(role: UserRole | undefined): string {
    if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) return 'Admin'
    return 'Resident'
}
