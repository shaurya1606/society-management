import { config } from 'dotenv'
import { eq } from 'drizzle-orm'
import { usersTable, UserRole } from '../src/lib/dbconfig/schema'
import {
    CyclePhase,
    performanceCyclesTable,
    thrustAreasTable,
} from '../src/lib/dbconfig/atomquest'
import { hashPassword } from '../src/services/authServices/utils'

config({ path: '.env.local' })

const seedUsers = async () => {
    const { db } = await import('../src/lib/dbconfig/db')
    const passwordHash = await hashPassword('demo123')

    const upsertUser = async (data: {
        email: string
        name: string
        role: UserRole
        managerId?: string | null
        department?: string | null
    }) => {
        const [row] = await db
            .insert(usersTable)
            .values({
                email: data.email,
                name: data.name,
                role: data.role,
                managerId: data.managerId ?? null,
                department: data.department ?? null,
                password: passwordHash,
                emailVerified: new Date(),
            })
            .onConflictDoUpdate({
                target: usersTable.email,
                set: {
                    name: data.name,
                    role: data.role,
                    managerId: data.managerId ?? null,
                    department: data.department ?? null,
                    password: passwordHash,
                    emailVerified: new Date(),
                },
            })
            .returning({ id: usersTable.id })

        if (row?.id) {
            return row.id
        }

        const [existing] = await db
            .select({ id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.email, data.email))
            .limit(1)

        return existing?.id ?? null
    }

    const adminId = await upsertUser({
        email: 'admin@demo.com',
        name: 'Demo Admin',
        role: UserRole.ADMIN,
    })

    const managerId = await upsertUser({
        email: 'manager@demo.com',
        name: 'Demo Manager',
        role: UserRole.MANAGER,
    })

    await upsertUser({
        email: 'emp@demo.com',
        name: 'Demo Employee',
        role: UserRole.EMPLOYEE,
        managerId: managerId ?? undefined,
        department: 'Engineering',
    })

    return { adminId, managerId }
}

const seedCycle = async () => {
    const { db } = await import('../src/lib/dbconfig/db')
    const year = 2026
    const opensAt = new Date('2026-05-01T00:00:00.000Z')
    const closesAt = new Date('2027-04-30T23:59:59.000Z')

    await db
        .insert(performanceCyclesTable)
        .values({
            name: 'FY 2026',
            year,
            phase: CyclePhase.GOAL_SETTING,
            opensAt,
            closesAt,
            isActive: true,
        })
        .onConflictDoUpdate({
            target: [
                performanceCyclesTable.year,
                performanceCyclesTable.phase,
            ],
            set: {
                name: 'FY 2026',
                opensAt,
                closesAt,
                isActive: true,
            },
        })
}

const seedThrustAreas = async () => {
    const { db } = await import('../src/lib/dbconfig/db')
    const thrustAreas = [
        'Revenue Growth',
        'Cost Optimisation',
        'Customer Satisfaction',
        'Compliance',
        'Innovation',
    ]

    for (const name of thrustAreas) {
        await db
            .insert(thrustAreasTable)
            .values({ name, isActive: true })
            .onConflictDoNothing({ target: thrustAreasTable.name })
    }
}

const seed = async () => {
    console.log('Seeding AtomQuest Phase 0 foundation data...')

    await seedUsers()
    await seedCycle()
    await seedThrustAreas()

    console.log('Seed complete.')
}

seed().catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
})
