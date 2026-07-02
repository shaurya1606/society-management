import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { handleApiError, jsonError, jsonOk } from '@/lib/api/response'
import { UserRole } from '@/lib/dbconfig/schema'
import {
    createNotice,
    listImportantNoticesPinnedFirst,
} from '@/lib/queries/society/notices'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const noticeSchema = z.object({
    title: z.string().trim().min(1),
    body: z.string().trim().min(1),
    isImportant: z.boolean().optional(),
})

const adminCapableRoles = new Set<UserRole>([
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
])

function isAdminCapable(role: UserRole | undefined) {
    return role ? adminCapableRoles.has(role) : false
}

export async function GET() {
    try {
        const session = await auth()
        const user = session?.user
        if (!user?.id) {
            return jsonError('Unauthorized', 401)
        }

        const notices = await listImportantNoticesPinnedFirst()
        return jsonOk({ ok: true, data: { notices } })
    } catch (error) {
        return handleApiError(error)
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        const user = session?.user
        if (!user?.id || !isAdminCapable(user.role)) {
            return jsonError('Forbidden', 403)
        }

        const body = noticeSchema.safeParse(await request.json())
        if (!body.success) {
            return jsonError('Invalid fields', 400)
        }

        const notice = await createNotice({
            title: body.data.title,
            body: body.data.body,
            isImportant: body.data.isImportant ?? false,
            createdById: user.id,
        })

        return jsonOk({ ok: true, data: { notice } }, 201)
    } catch (error) {
        return handleApiError(error)
    }
}