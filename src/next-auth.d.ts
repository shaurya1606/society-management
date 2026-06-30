import { UserRole } from '@/lib/dbconfig/schema'
import type { DefaultSession } from 'next-auth'
export type ExtendedUser = DefaultSession['user'] & {
    role: UserRole
    isTwoFactorEnabled?: boolean
    twoFactorEnabled?: boolean
    isOAuth: boolean
}

declare module 'next-auth' {
    interface Session {
        user: ExtendedUser
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: UserRole
        isTwoFactorEnabled?: boolean
        twoFactorEnabled?: boolean
        isOAuth?: boolean
        name?: string | null
        email?: string | null
        image?: string | null
    }
}
