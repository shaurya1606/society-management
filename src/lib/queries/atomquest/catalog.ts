import { eq } from 'drizzle-orm'
import { db } from '@/lib/dbconfig/db'
import { thrustAreasTable } from '@/lib/dbconfig/atomquest'

export async function listActiveThrustAreas() {
    return db
        .select()
        .from(thrustAreasTable)
        .where(eq(thrustAreasTable.isActive, true))
}
