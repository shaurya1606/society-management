import authConfig from '@/auth.config'
import NextAuth from 'next-auth'
import { UserRole } from '@/lib/dbconfig/schema'
import { isAdminRole } from '@/lib/auth/roles'
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutePrefixes,
    publicRoutes,
} from '@/route'

const { auth } = NextAuth({
    ...authConfig,
    callbacks: {
        // Middleware uses this instance (not auth.ts). Map role from JWT so
        // route guard sees the real role — otherwise it defaults to EMPLOYEE.
        jwt({ token }) {
            return token
        },
        session({ session, token }) {
            if (session.user) {
                session.user.role =
                    (token.role as UserRole | undefined) ?? UserRole.EMPLOYEE
            }
            return session
        },
    },
})

const rbacRouteGuard = (
    pathname: string,
    role: UserRole | undefined,
    nextUrl: URL
) => {
    const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')

    if (!isAdminRoute) {
        return null
    }

    const fallbackUrl = new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)
    if (pathname === fallbackUrl.pathname) {
        return null
    }

    const resolvedRole = role ?? UserRole.EMPLOYEE

    if (isAdminRoute && !isAdminRole(resolvedRole)) {
        return Response.redirect(fallbackUrl)
    }

    return null
}

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    const role = req.auth?.user?.role as UserRole | undefined

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isPublicRouteByPrefix = publicRoutePrefixes.some((prefix) =>
        nextUrl.pathname.startsWith(prefix)
    )
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if (isApiAuthRoute) {
        return null
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return null
    }

    const isAccessingProtectedRoute = !isPublicRoute && !isPublicRouteByPrefix

    if (!isLoggedIn && isAccessingProtectedRoute) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }
        nextUrl.searchParams.set('callbackUrl', callbackUrl)
        const encodeCallbackUrl = encodeURIComponent(callbackUrl)
        return Response.redirect(
            new URL(`/login?callbackUrl=${encodeCallbackUrl}`, nextUrl)
        )
    }

    if (isLoggedIn) {
        const rbacRedirect = rbacRouteGuard(nextUrl.pathname, role, nextUrl)
        if (rbacRedirect) return rbacRedirect
    }

    return null
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
