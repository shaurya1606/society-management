import { desc } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import { type SelectComplaint, appSettingsTable } from '@/lib/dbconfig/society'

type DatabaseClient = typeof db

const DAY_IN_MS = 24 * 60 * 60 * 1000

export async function getOverdueThresholdDays(
    client: DatabaseClient = db
): Promise<number> {
    const [settings] = await client
        .select({ overdueThresholdDays: appSettingsTable.overdueThresholdDays })
        .from(appSettingsTable)
        .orderBy(desc(appSettingsTable.createdAt))
        .limit(1)

    return settings?.overdueThresholdDays ?? 7
}

export function getComplaintOverdueDays(
    complaint: Pick<SelectComplaint, 'createdAt' | 'status'>,
    overdueThresholdDays: number,
    now = new Date()
): number {
    if (complaint.status === 'RESOLVED') {
        return 0
    }

    const ageInDays = Math.floor(
        (now.getTime() - new Date(complaint.createdAt).getTime()) / DAY_IN_MS
    )

    return Math.max(0, ageInDays - overdueThresholdDays)
}

export function isComplaintOverdue(
    complaint: Pick<SelectComplaint, 'createdAt' | 'status'>,
    overdueThresholdDays: number,
    now = new Date()
): boolean {
    return (
        complaint.status !== 'RESOLVED' &&
        new Date(complaint.createdAt).getTime() +
            overdueThresholdDays * DAY_IN_MS <
            now.getTime()
    )
}

export function sortComplaintsOverdueFirst<T extends Pick<SelectComplaint, 'createdAt' | 'status'>>(
    complaints: T[],
    overdueThresholdDays: number,
    now = new Date()
): T[] {
    return [...complaints].sort((left, right) => {
        const leftOverdue = isComplaintOverdue(left, overdueThresholdDays, now)
        const rightOverdue = isComplaintOverdue(right, overdueThresholdDays, now)

        if (leftOverdue !== rightOverdue) {
            return leftOverdue ? -1 : 1
        }

        return (
            new Date(right.createdAt).getTime() -
            new Date(left.createdAt).getTime()
        )
    })
}