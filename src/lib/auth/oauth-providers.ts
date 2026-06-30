import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import LinkedIn from 'next-auth/providers/linkedin'
import Credentials from 'next-auth/providers/credentials'
import { LoginFormSchema } from '@/lib/schema/authSchema'
import { findUserByEmail } from '@/lib/queries/users/select'
import { UserRole } from '@/lib/dbconfig/schema'
import bcrypt from 'bcryptjs'

/**
 * OAuth providers with explicit env mapping (matches GitHub/Google setup).
 * LinkedIn requires OpenID Connect app + redirect: {APP_URL}/api/auth/callback/linkedin
 */
export function buildAuthProviders(): NextAuthConfig['providers'] {
    const oauth: NonNullable<NextAuthConfig['providers']> = []

    if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
        oauth.push(
            GitHub({
                clientId: process.env.AUTH_GITHUB_ID,
                clientSecret: process.env.AUTH_GITHUB_SECRET,
            })
        )
    }

    if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
        oauth.push(
            Google({
                clientId: process.env.AUTH_GOOGLE_ID,
                clientSecret: process.env.AUTH_GOOGLE_SECRET,
            })
        )
    }

    if (process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET) {
        oauth.push(
            LinkedIn({
                clientId: process.env.AUTH_LINKEDIN_ID,
                clientSecret: process.env.AUTH_LINKEDIN_SECRET,
                authorization: {
                    params: { scope: 'openid profile email' },
                },
            })
        )
    }

    oauth.push(
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = LoginFormSchema.safeParse(credentials)
                if (!parsedCredentials.success) {
                    return null
                }

                const { email, password } = parsedCredentials.data
                const normalizedEmail = email.trim().toLowerCase()

                const user = await findUserByEmail(normalizedEmail)
                if (!user || !user.password) {
                    return null
                }

                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                )
                if (!passwordMatch) {
                    return null
                }

                const name = user.name

                return {
                    id: user.id,
                    email: user.email,
                    name: name?.length ? name : user.email,
                    role: (user.role ?? UserRole.EMPLOYEE) as UserRole,
                }
            },
        })
    )

    return oauth
}

export const configuredOAuthProviderIds = () => {
    const ids: string[] = []
    if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) ids.push('github')
    if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) ids.push('google')
    if (process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET) ids.push('linkedin')
    return ids
}
