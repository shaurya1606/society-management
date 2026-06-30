import { db } from '@/lib/dbconfig/db'
import {
    type ComplaintStatus,
    type SelectComplaint,
    complaintStatusHistoryTable,
    complaintsTable,
} from '@/lib/dbconfig/society'
import { eq } from 'drizzle-orm'

type DatabaseClient = typeof db

export type ComplaintStatusTransitionInput = {
    complaintId: string
    toStatus: ComplaintStatus
    actorId: string
    note?: string | null
    allowReopen?: boolean
}

export async function transitionComplaintStatus(
    input: ComplaintStatusTransitionInput,
    client: DatabaseClient = db
): Promise<SelectComplaint> {
    return client.transaction(async (tx) => {
        const [complaint] = await tx
            .select()
            .from(complaintsTable)
            .where(eq(complaintsTable.id, input.complaintId))
            .limit(1)

        if (!complaint) {
            throw new Error('Complaint not found')
        }

        if (
            complaint.status === 'RESOLVED' &&
            input.toStatus !== 'RESOLVED' &&
            !input.allowReopen
        ) {
            throw new Error('Resolved complaints cannot be reopened in this phase')
        }

        const resolvedAt =
            input.toStatus === 'RESOLVED' ? new Date() : complaint.resolvedAt

        const [updatedComplaint] = await tx
            .update(complaintsTable)
            .set({
                status: input.toStatus,
                resolvedAt,
            })
            .where(eq(complaintsTable.id, input.complaintId))
            .returning()

        await tx.insert(complaintStatusHistoryTable).values({
            complaintId: input.complaintId,
            fromStatus: complaint.status,
            toStatus: input.toStatus,
            actorId: input.actorId,
            note: input.note ?? null,
            createdAt: new Date(),
        })

        return updatedComplaint
    })
}