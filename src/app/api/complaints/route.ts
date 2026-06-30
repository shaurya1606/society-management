import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { handleApiError, jsonError, jsonOk } from '@/lib/atomquest/api'
import { UserRole } from '@/lib/dbconfig/schema'
import {
    createComplaint,
    getAllComplaintsForAdmin,
    getComplaintsForResident,
} from '@/lib/queries/society/complaints'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const createComplaintSchema = z.object({
    title: z.string().trim().min(1),
    category: z.string().trim().min(1),
    description: z.string().trim().min(1),
    photoUrl: z.union([z.string().url(), z.literal('')]).optional().nullable(),
})

const adminFiltersSchema = z.object({
    status: z.string().optional(),
    category: z.string().optional(),
    priority: z.string().optional(),
    from: z.string().datetime({ offset: true }).optional(),
    to: z.string().datetime({ offset: true }).optional(),
    overdueFirst: z
        .union([z.literal('true'), z.literal('false')])
        .optional(),
})

const adminCapableRoles = new Set<UserRole>([
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
])

const residentCapableRoles = new Set<UserRole>([
    UserRole.USER,
    UserRole.EMPLOYEE,
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
])

function isAdminCapable(role: UserRole | undefined) {
    return role ? adminCapableRoles.has(role) : false
}

function isResidentCapable(role: UserRole | undefined) {
    return role ? residentCapableRoles.has(role) : false
}

function normalizeComplaintStatus(value?: string | null) {
    if (!value) return undefined
    const upper = value.toUpperCase()
    return upper === 'OPEN' || upper === 'IN_PROGRESS' || upper === 'RESOLVED'
        ? upper
        : undefined
}

function normalizeComplaintPriority(value?: string | null) {
    if (!value) return undefined
    const upper = value.toUpperCase()
    return upper === 'LOW' || upper === 'MEDIUM' || upper === 'HIGH'
        ? upper
        : undefined
}

function parseMultiValue(value?: string | null) {
    if (!value) return []
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        const user = session?.user
        if (!user?.id || !isResidentCapable(user.role)) {
            return jsonError('Unauthorized', 401)
        }

        if (!isAdminCapable(user.role)) {
            const complaints = await getComplaintsForResident(user.id)
            return jsonOk({ ok: true, data: { complaints } })
        }

        const searchParams = request.nextUrl.searchParams
        const filters = adminFiltersSchema.safeParse({
            status: searchParams.get('status') ?? undefined,
            category: searchParams.get('category') ?? undefined,
            priority: searchParams.get('priority') ?? undefined,
            from: searchParams.get('from') ?? undefined,
            to: searchParams.get('to') ?? undefined,
            overdueFirst: searchParams.get('overdueFirst') ?? undefined,
        })

        if (!filters.success) {
            return jsonError('Invalid query parameters', 400)
        }

        const adminFilters = {
            status: parseMultiValue(filters.data.status)
                .map((value) => normalizeComplaintStatus(value))
                .filter(Boolean) as ('OPEN' | 'IN_PROGRESS' | 'RESOLVED')[],
            category: parseMultiValue(filters.data.category),
            priority: parseMultiValue(filters.data.priority)
                .map((value) => normalizeComplaintPriority(value))
                .filter(Boolean) as ('LOW' | 'MEDIUM' | 'HIGH')[],
            overdueFirst: filters.data.overdueFirst === 'true',
            ...(filters.data.from ? { createdFrom: new Date(filters.data.from) } : {}),
            ...(filters.data.to ? { createdTo: new Date(filters.data.to) } : {}),
        }

        const complaints = await getAllComplaintsForAdmin(adminFilters)

        return jsonOk({ ok: true, data: { complaints } })
    } catch (error) {
        return handleApiError(error)
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        const user = session?.user
        if (!user?.id || !isResidentCapable(user.role)) {
            return jsonError('Unauthorized', 401)
        }

        const body = createComplaintSchema.safeParse(await request.json())
        if (!body.success) {
            return jsonError('Invalid fields', 400)
        }

        const complaint = await createComplaint({
            residentId: user.id,
            title: body.data.title,
            category: body.data.category,
            description: body.data.description,
            photoUrl:
                body.data.photoUrl == null || body.data.photoUrl === ''
                    ? null
                    : body.data.photoUrl,
            status: 'OPEN',
            priority: 'LOW',
        })

        return jsonOk({ ok: true, data: { complaint } }, 201)
    } catch (error) {
        return handleApiError(error)
    }
}