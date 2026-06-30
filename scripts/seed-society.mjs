/**
 * Society Maintenance Tracker demo seed.
 * Run: pnpm seed:society
 * Requires DATABASE_URL in .env or .env.local
 */
import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Load environment configurations
config({ path: '.env' })
config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required in .env or .env.local')
    process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

console.log('Seeding Society Maintenance Tracker demo data…')

// 1. Create or Update Demo Users
const adminPasswordHash = await bcrypt.hash('Admin@123', 10)
const residentPasswordHash = await bcrypt.hash('Resident@123', 10)

const demoUsers = [
    {
        email: 'admin@societytrack.demo',
        name: 'Society Administrator',
        role: 'ADMIN',
        password: adminPasswordHash,
        department: 'Operations',
    },
    {
        email: 'resident@societytrack.demo',
        name: 'Resident Block A',
        role: 'EMPLOYEE',
        password: residentPasswordHash,
        department: 'Resident Block A',
    },
    {
        email: 'amit.resident@societytrack.demo',
        name: 'Amit Kumar',
        role: 'EMPLOYEE',
        password: residentPasswordHash,
        department: 'Resident Block B',
    },
    {
        email: 'priya.resident@societytrack.demo',
        name: 'Priya Sharma',
        role: 'EMPLOYEE',
        password: residentPasswordHash,
        department: 'Resident Block C',
    },
]

const userMap = {}
for (const u of demoUsers) {
    const existing = await sql`SELECT id FROM "user" WHERE email = ${u.email} LIMIT 1`
    if (existing.length > 0) {
        userMap[u.email] = existing[0].id
        await sql`
            UPDATE "user"
            SET name = ${u.name}, role = ${u.role}, password = ${u.password}, department = ${u.department}
            WHERE id = ${existing[0].id}
        `
    } else {
        const newId = crypto.randomUUID()
        await sql`
            INSERT INTO "user" (id, name, email, role, password, department)
            VALUES (${newId}, ${u.name}, ${u.email}, ${u.role}, ${u.password}, ${u.department})
        `
        userMap[u.email] = newId
    }
}

const adminId = userMap['admin@societytrack.demo']
const resident1Id = userMap['resident@societytrack.demo']
const resident2Id = userMap['amit.resident@societytrack.demo']
const resident3Id = userMap['priya.resident@societytrack.demo']

console.log('Demo users created/verified.')

// 2. Clear previous demo-linked complaints/notices/history
await sql`
    DELETE FROM complaint_status_history
    WHERE complaint_id IN (
        SELECT id FROM complaint WHERE resident_id IN (${resident1Id}, ${resident2Id}, ${resident3Id})
    )
`
await sql`
    DELETE FROM complaint
    WHERE resident_id IN (${resident1Id}, ${resident2Id}, ${resident3Id})
`
await sql`
    DELETE FROM notice
    WHERE created_by_id = ${adminId}
`
await sql`
    DELETE FROM app_settings
`

console.log('Cleared existing demo complaints and notices.')

// 3. Insert App settings
const settingsId = crypto.randomUUID()
await sql`
    INSERT INTO app_settings (id, overdue_threshold_days)
    VALUES (${settingsId}, 3)
`
console.log('Global app settings updated (overdueThresholdDays = 3).')

// 4. Create complaints data
const now = new Date()
const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

const complaintsData = [
    // 3 RESOLVED complaints
    {
        residentEmail: 'resident@societytrack.demo',
        title: 'Water leakage in Block A toilet pipe',
        category: 'Plumbing',
        description: 'Water is dripping from the main supply line joint in the ceiling of Block A floor 3.',
        photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
        status: 'RESOLVED',
        priority: 'MEDIUM',
        createdAt: daysAgo(3),
        resolvedAt: daysAgo(1),
        history: [
            { from: 'OPEN', to: 'IN_PROGRESS', note: 'Plumber dispatched to inspect the pipe.', createdAt: daysAgo(2.5) },
            { from: 'IN_PROGRESS', to: 'RESOLVED', note: 'Main joint replaced and tested. Leak resolved.', createdAt: daysAgo(1) }
        ]
    },
    {
        residentEmail: 'amit.resident@societytrack.demo',
        title: 'Corridor lights out on Floor 2',
        category: 'Electrical',
        description: 'Three tube lights in the Block B floor 2 main hallway are flickering and dead.',
        photoUrl: null,
        status: 'RESOLVED',
        priority: 'LOW',
        createdAt: daysAgo(4),
        resolvedAt: daysAgo(3),
        history: [
            { from: 'OPEN', to: 'IN_PROGRESS', note: 'Electrician ticket generated.', createdAt: daysAgo(3.8) },
            { from: 'IN_PROGRESS', to: 'RESOLVED', note: 'Bulbs replaced with new energy-saving LEDs.', createdAt: daysAgo(3) }
        ]
    },
    {
        residentEmail: 'priya.resident@societytrack.demo',
        title: 'Garbage accumulation near Block C back exit',
        category: 'Cleaning',
        description: 'Huge pile of cardboard boxes and plastic waste has accumulated near the emergency exit staircase.',
        photoUrl: null,
        status: 'RESOLVED',
        priority: 'LOW',
        createdAt: daysAgo(2),
        resolvedAt: daysAgo(1),
        history: [
            { from: 'OPEN', to: 'IN_PROGRESS', note: 'Housekeeping crew scheduled.', createdAt: daysAgo(1.5) },
            { from: 'IN_PROGRESS', to: 'RESOLVED', note: 'Debris cleared and area sanitized.', createdAt: daysAgo(1) }
        ]
    },

    // 3 IN_PROGRESS complaints
    {
        residentEmail: 'resident@societytrack.demo',
        title: 'Main entrance security gate sensor failure',
        category: 'Security',
        description: 'The RFID reader at the primary vehicle gate is failing to scan cards intermittently, causing long entry lines.',
        photoUrl: null,
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        createdAt: daysAgo(1),
        resolvedAt: null,
        history: [
            { from: 'OPEN', to: 'IN_PROGRESS', note: 'Vendor contacted. Hardware technician scheduled for site visit.', createdAt: daysAgo(0.8) }
        ]
    },
    {
        residentEmail: 'amit.resident@societytrack.demo',
        title: 'Water pump making strange grinding noise',
        category: 'Plumbing',
        description: 'The basement borewell pump is making loud grinding metal noises. Worried it might burn out.',
        photoUrl: null,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        createdAt: daysAgo(0.5),
        resolvedAt: null,
        history: [
            { from: 'OPEN', to: 'IN_PROGRESS', note: 'Pump vendor alert dispatched. Checking motor alignment.', createdAt: daysAgo(0.4) }
        ]
    },
    {
        residentEmail: 'priya.resident@societytrack.demo',
        title: 'Parking spot B-12 unauthorized car parking',
        category: 'Parking',
        description: 'A black SUV has been parked in my designated spot B-12 for the last two days. Security has not taken action.',
        photoUrl: null,
        status: 'IN_PROGRESS',
        priority: 'LOW',
        createdAt: daysAgo(2),
        resolvedAt: null,
        history: [
            { from: 'OPEN', to: 'IN_PROGRESS', note: 'Security guard sent warning note to car owner.', createdAt: daysAgo(1) }
        ]
    },

    // 3 OPEN complaints
    {
        residentEmail: 'resident@societytrack.demo',
        title: 'Intercom dead in Block A-302',
        category: 'Other',
        description: 'No dial tone or buzz response on the lobby intercom unit in Block A flat 302.',
        photoUrl: null,
        status: 'OPEN',
        priority: 'LOW',
        createdAt: daysAgo(0.2),
        resolvedAt: null,
        history: []
    },
    {
        residentEmail: 'amit.resident@societytrack.demo',
        title: 'Basement parking area flooded',
        category: 'Other',
        description: 'Heavy rain has caused water clogging in the basement ramp parking area near block B pillars 10-12.',
        photoUrl: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&q=80&w=400',
        status: 'OPEN',
        priority: 'MEDIUM',
        createdAt: daysAgo(0.3),
        resolvedAt: null,
        history: []
    },
    {
        residentEmail: 'priya.resident@societytrack.demo',
        title: 'Lobby glass door lock broken',
        category: 'Lift',
        description: 'The glass entry door to the lift lobby has a broken handle lock. Anyone can push it open.',
        photoUrl: null,
        status: 'OPEN',
        priority: 'MEDIUM',
        createdAt: daysAgo(0.1),
        resolvedAt: null,
        history: []
    },

    // 2 HIGH priority open complaints
    {
        residentEmail: 'amit.resident@societytrack.demo',
        title: 'Block B Lift floor alignment issue',
        category: 'Lift',
        description: 'The lift stops 2 inches below the floor level on floor 4, creating a severe tripping hazard for seniors.',
        photoUrl: null,
        status: 'OPEN',
        priority: 'HIGH',
        createdAt: daysAgo(0.5),
        resolvedAt: null,
        history: []
    },
    {
        residentEmail: 'priya.resident@societytrack.demo',
        title: 'Exposed wire sparking in ground floor staircase',
        category: 'Electrical',
        description: 'A live wire is hanging out of the electrical duct on the ground floor next to the emergency stairs and sparking.',
        photoUrl: null,
        status: 'OPEN',
        priority: 'HIGH',
        createdAt: daysAgo(0.2),
        resolvedAt: null,
        history: []
    },

    // 2 OVERDUE complaints (overdueThresholdDays is 3)
    {
        residentEmail: 'resident@societytrack.demo',
        title: 'Broken handrails on Block A fire escape',
        category: 'Security',
        description: 'The safety handrail on Block A floor 5 staircase is loose and has broken joints.',
        photoUrl: null,
        status: 'OPEN',
        priority: 'HIGH',
        createdAt: daysAgo(5),
        resolvedAt: null,
        history: []
    },
    {
        residentEmail: 'amit.resident@societytrack.demo',
        title: 'Block B sewer drain line clogged',
        category: 'Plumbing',
        description: 'Waste water from Block B laundry drain is back-flowing into the common yard area.',
        photoUrl: null,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        createdAt: daysAgo(5),
        resolvedAt: null,
        history: [
            { from: 'OPEN', to: 'IN_PROGRESS', note: 'Sanitation contractor called. Waiting on heavy machinery.', createdAt: daysAgo(4.5) }
        ]
    }
]

for (const comp of complaintsData) {
    const residentId = userMap[comp.residentEmail]
    const complaintId = crypto.randomUUID()

    await sql`
        INSERT INTO complaint (id, resident_id, title, category, description, photo_url, status, priority, resolved_at, created_at)
        VALUES (${complaintId}, ${residentId}, ${comp.title}, ${comp.category}, ${comp.description}, ${comp.photoUrl}, ${comp.status}, ${comp.priority}, ${comp.resolvedAt}, ${comp.createdAt})
    `

    for (const hist of comp.history) {
        const historyId = crypto.randomUUID()
        await sql`
            INSERT INTO complaint_status_history (id, complaint_id, from_status, to_status, actor_id, note, created_at)
            VALUES (${historyId}, ${complaintId}, ${hist.from}, ${hist.to}, ${adminId}, ${hist.note}, ${hist.createdAt})
        `
    }
}

console.log(`Inserted ${complaintsData.length} complaints and their lifecycle history logs.`);

// 5. Create notices data
const noticesData = [
    {
        title: 'Emergency Water Supply Maintenance shutdown',
        body: 'Please note that the main water supply pump will undergo emergency repair maintenance tomorrow from 10:00 AM to 02:00 PM. Please store sufficient water in advance.',
        isImportant: true,
        createdAt: daysAgo(0.5)
    },
    {
        title: 'Block B Lift servicing scheduled',
        body: 'The passenger lift in Block B will be out of service on Friday for routine quarterly safety checks and cable adjustments.',
        isImportant: true,
        createdAt: daysAgo(1)
    },
    {
        title: 'Monthly basement parking cleaning',
        body: 'The annual pressure washing and vacuum cleaning of the basement ramps and parking lanes is scheduled for this Sunday. Please park vehicles outside between 09:00 AM and 05:00 PM.',
        isImportant: false,
        createdAt: daysAgo(2)
    },
    {
        title: 'New vehicle security gate guidelines',
        body: 'Laminated visitor stickers are now available at the main gate reception office. Residents are requested to collect new stickers for secondary guest cars.',
        isImportant: false,
        createdAt: daysAgo(3)
    },
    {
        title: 'Festival waste collection guidelines',
        body: 'To accommodate extra waste during the upcoming holiday festival, temporary dumpsters have been set up near Block C exit ramp.',
        isImportant: false,
        createdAt: daysAgo(4)
    }
]

for (const note of noticesData) {
    const noticeId = crypto.randomUUID()
    await sql`
        INSERT INTO notice (id, title, body, is_important, created_by_id, created_at)
        VALUES (${noticeId}, ${note.title}, ${note.body}, ${note.isImportant}, ${adminId}, ${note.createdAt})
    `
}

console.log(`Inserted ${noticesData.length} notices on the bulletin board.`);
console.log('Seeding completed successfully!');
process.exit(0);
