import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
    atomquestAdminPaths,
    atomquestEmployeePaths,
    atomquestManagerPaths,
} from './routes'
import { UserRole } from '@/lib/dbconfig/schema'
import {
    isAdminRole,
    isEmployeeRole,
    isManagerRole,
    roleHomePath,
} from './roles'

export function atomquestRouteGuard(
    req: NextRequest,
    role: UserRole | undefined
): NextResponse | null {
    const path = req.nextUrl.pathname

    const isEmployeeRoute = atomquestEmployeePaths.some(
        (p) => path === p || path.startsWith(`${p}/`)
    )
    const isManagerRoute = atomquestManagerPaths.some(
        (p) => path === p || path.startsWith(`${p}/`)
    )
    const isAdminRoute = atomquestAdminPaths.some(
        (p) => path === p || path.startsWith(`${p}/`)
    )

    if (!isEmployeeRoute && !isManagerRoute && !isAdminRoute) {
        return null
    }

    const r = role ?? UserRole.EMPLOYEE

    if (isAdminRoute && !isAdminRole(r)) {
        return NextResponse.redirect(new URL(roleHomePath(r), req.nextUrl))
    }
    if (isManagerRoute && !isManagerRole(r) && !isAdminRole(r)) {
        return NextResponse.redirect(new URL(roleHomePath(r), req.nextUrl))
    }
    if (
        isEmployeeRoute &&
        !isEmployeeRole(r) &&
        !isManagerRole(r) &&
        !isAdminRole(r)
    ) {
        return NextResponse.redirect(new URL(roleHomePath(r), req.nextUrl))
    }

    return null
}
