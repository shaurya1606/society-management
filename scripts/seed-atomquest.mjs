/**
 * AtomQuest hackathon demo seed.
 * Run: pnpm seed:atomquest
 * Requires DATABASE_URL in .env.local
 */
import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)
if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required in .env.local')
    process.exit(1)
}

const passwordHash = await bcrypt.hash('AtomQuest@123', 10)

function getPerformanceYear(d = new Date()) {
    const month = d.getMonth()
    const y = d.getFullYear()
    return month >= 3 ? y : y - 1
}

function getActiveQuarter(d = new Date()) {
    const m = d.getMonth()
    if (m < 3) return 'Q1'
    if (m < 6) return 'Q2'
    if (m < 9) return 'Q3'
    return 'Q4'
}

const year = getPerformanceYear()
const activeQuarter = getActiveQuarter()

console.log(`Seeding AtomQuest demo data (FY${year}, active quarter ${activeQuarter})…`)

const thrustAreas = [
    ['Growth', 'Revenue and market expansion'],
    ['Operational Excellence', 'Efficiency and quality'],
    ['People & Culture', 'Team development'],
    ['Innovation', 'New products and capabilities'],
]

for (const [name, desc] of thrustAreas) {
    await sql`
      INSERT INTO thrust_area (id, name, description, is_active)
      VALUES (gen_random_uuid()::text, ${name}, ${desc}, true)
      ON CONFLICT (name) DO NOTHING
    `
}

const cycles = [
    ['Goal Setting', 'GOAL_SETTING', `${year}-01-01`, `${year}-12-31`],
    ['Q1 Check-in', 'Q1', `${year}-01-01`, `${year}-12-31`],
    ['Q2 Check-in', 'Q2', `${year}-01-01`, `${year}-12-31`],
    ['Q3 Check-in', 'Q3', `${year}-01-01`, `${year}-12-31`],
    ['Q4 Check-in', 'Q4', `${year}-01-01`, `${year}-12-31`],
]

for (const [name, phase, opens, closes] of cycles) {
    const existing = await sql`
      SELECT id FROM performance_cycle WHERE year = ${year} AND phase = ${phase} LIMIT 1
    `
    if (existing.length === 0) {
        await sql`
          INSERT INTO performance_cycle (id, name, year, phase, opens_at, closes_at, is_active)
          VALUES (gen_random_uuid()::text, ${name}, ${year}, ${phase}, ${opens}::timestamp, ${closes}::timestamp, true)
        `
    }
}

const [goalCycle] = await sql`
  SELECT id FROM performance_cycle WHERE year = ${year} AND phase = 'GOAL_SETTING' LIMIT 1
`
const goalCycleId = goalCycle.id

const thrustRows = await sql`SELECT id, name FROM thrust_area WHERE is_active = true`
const thrustByName = Object.fromEntries(thrustRows.map((r) => [r.name, r.id]))

const users = [
    {
        email: 'admin@atomquest.demo',
        name: 'Jordan Kim',
        role: 'ADMIN',
        department: 'People Operations',
    },
    {
        email: 'manager@atomquest.demo',
        name: 'Maya Chen',
        role: 'MANAGER',
        department: 'Engineering',
    },
    {
        email: 'employee@atomquest.demo',
        name: 'Alex Rivera',
        role: 'EMPLOYEE',
        department: 'Product',
        managerEmail: 'manager@atomquest.demo',
    },
    {
        email: 'priya.sharma@atomquest.demo',
        name: 'Priya Sharma',
        role: 'EMPLOYEE',
        department: 'Engineering',
        managerEmail: 'manager@atomquest.demo',
    },
    {
        email: 'arjun.mehta@atomquest.demo',
        name: 'Arjun Mehta',
        role: 'EMPLOYEE',
        department: 'Engineering',
        managerEmail: 'manager@atomquest.demo',
    },
    {
        email: 'sam.okonkwo@atomquest.demo',
        name: 'Sam Okonkwo',
        role: 'EMPLOYEE',
        department: 'Operations',
        managerEmail: 'manager@atomquest.demo',
    },
    {
        email: 'jordan.lee@atomquest.demo',
        name: 'Jordan Lee',
        role: 'EMPLOYEE',
        department: 'Sales',
        managerEmail: 'manager@atomquest.demo',
    },
]

const ids = {}

for (const u of users) {
    const existing = await sql`SELECT id FROM "user" WHERE email = ${u.email}`
    if (existing.length > 0) {
        ids[u.email] = existing[0].id
        await sql`
          UPDATE "user"
          SET role = ${u.role}, name = ${u.name}, password = ${passwordHash},
              department = ${u.department ?? null}
          WHERE email = ${u.email}
        `
    } else {
        const [row] = await sql`
          INSERT INTO "user" (id, email, name, password, role, department, "emailVerified")
          VALUES (gen_random_uuid()::text, ${u.email}, ${u.name}, ${passwordHash}, ${u.role},
                  ${u.department ?? null}, NOW())
          RETURNING id
        `
        ids[u.email] = row.id
    }
}

for (const u of users) {
    if (u.managerEmail && ids[u.managerEmail]) {
        await sql`
          UPDATE "user" SET manager_id = ${ids[u.managerEmail]} WHERE email = ${u.email}
        `
    }
}

const managerId = ids['manager@atomquest.demo']
const adminId = ids['admin@atomquest.demo']

async function upsertSheet(userId, status, extra = {}) {
    const existing = await sql`
      SELECT id FROM goal_sheet WHERE user_id = ${userId} AND cycle_id = ${goalCycleId} LIMIT 1
    `
    if (existing.length > 0) {
        await sql`
          UPDATE goal_sheet SET
            status = ${status},
            submitted_at = ${extra.submittedAt ?? null},
            approved_at = ${extra.approvedAt ?? null},
            approved_by_id = ${extra.approvedById ?? null},
            return_reason = ${extra.returnReason ?? null},
            returned_at = ${extra.returnedAt ?? null}
          WHERE id = ${existing[0].id}
        `
        return existing[0].id
    }
    const [row] = await sql`
      INSERT INTO goal_sheet (
        id, user_id, cycle_id, status, submitted_at, approved_at, approved_by_id,
        return_reason, returned_at
      ) VALUES (
        gen_random_uuid()::text, ${userId}, ${goalCycleId}, ${status},
        ${extra.submittedAt ?? null}, ${extra.approvedAt ?? null}, ${extra.approvedById ?? null},
        ${extra.returnReason ?? null}, ${extra.returnedAt ?? null}
      ) RETURNING id
    `
    return row.id
}

async function insertGoals(sheetId, goals, options = {}) {
    await sql`DELETE FROM goal WHERE goal_sheet_id = ${sheetId}`
    let order = 0
    for (const g of goals) {
        await sql`
          INSERT INTO goal (
            id, goal_sheet_id, thrust_area_id, title, description, uom_type,
            target_value, target_deadline, weightage, sort_order,
            shared_goal_id, is_shared_recipient, is_primary_owner
          ) VALUES (
            gen_random_uuid()::text, ${sheetId}, ${g.thrustAreaId}, ${g.title},
            ${g.description ?? null}, ${g.uomType}, ${g.targetValue ?? null},
            ${g.targetDeadline ?? null}, ${g.weightage}, ${order++},
            ${options.sharedGoalId ?? null}, ${g.isSharedRecipient ?? false},
            ${g.isPrimaryOwner ?? true}
          )
        `
    }
}

// Alex — DRAFT (live demo account)
const alexSheet = await upsertSheet(ids['employee@atomquest.demo'], 'DRAFT')
await insertGoals(alexSheet, [
    {
        thrustAreaId: thrustByName.Growth,
        title: 'Increase enterprise pipeline by 20%',
        description: 'Focus on mid-market accounts',
        uomType: 'PERCENT_MIN',
        targetValue: '20',
        weightage: 40,
    },
    {
        thrustAreaId: thrustByName.Innovation,
        title: 'Launch customer insights dashboard',
        uomType: 'TIMELINE',
        targetDeadline: `${year}-09-30`,
        weightage: 30,
    },
    {
        thrustAreaId: thrustByName['People & Culture'],
        title: 'Mentor two junior PMs',
        uomType: 'NUMERIC_MIN',
        targetValue: '2',
        weightage: 30,
    },
])

// Priya — SUBMITTED (pending manager review)
const priyaSheet = await upsertSheet(ids['priya.sharma@atomquest.demo'], 'SUBMITTED', {
    submittedAt: new Date(Date.now() - 2 * 86400000),
})
await insertGoals(priyaSheet, [
    {
        thrustAreaId: thrustByName.Growth,
        title: 'Reduce customer churn to under 4%',
        uomType: 'PERCENT_MAX',
        targetValue: '4',
        weightage: 35,
    },
    {
        thrustAreaId: thrustByName['Operational Excellence'],
        title: 'Cut incident MTTR by 25%',
        uomType: 'PERCENT_MIN',
        targetValue: '25',
        weightage: 35,
    },
    {
        thrustAreaId: thrustByName.Innovation,
        title: 'Ship API v2 migration',
        uomType: 'TIMELINE',
        targetDeadline: `${year}-08-15`,
        weightage: 30,
    },
])

// Arjun — LOCKED (approved) + check-in on active quarter
const arjunSheet = await upsertSheet(ids['arjun.mehta@atomquest.demo'], 'LOCKED', {
    submittedAt: new Date(Date.now() - 14 * 86400000),
    approvedAt: new Date(Date.now() - 7 * 86400000),
    approvedById: managerId,
})
// Shared KPI id resolved below; goals include 15% shared slot
let sharedGoalId = null

await insertGoals(arjunSheet, [
    {
        thrustAreaId: thrustByName['Operational Excellence'],
        title: 'Improve deployment frequency',
        uomType: 'NUMERIC_MIN',
        targetValue: '12',
        weightage: 35,
    },
    {
        thrustAreaId: thrustByName.Growth,
        title: 'Support $2M expansion revenue',
        uomType: 'NUMERIC_MIN',
        targetValue: '2000000',
        weightage: 30,
    },
    {
        thrustAreaId: thrustByName['People & Culture'],
        title: 'Lead weekly guild sessions',
        uomType: 'NUMERIC_MIN',
        targetValue: '48',
        weightage: 20,
    },
])

const arjunGoals = await sql`SELECT id, title FROM goal WHERE goal_sheet_id = ${arjunSheet}`
const arjunFirstGoal = arjunGoals[0]
if (arjunFirstGoal) {
    await sql`
      INSERT INTO quarterly_update (
        id, goal_id, period, actual_value, achievement_status, progress_score, updated_by_id
      ) VALUES (
        gen_random_uuid()::text, ${arjunFirstGoal.id}, ${activeQuarter},
        '8', 'ON_TRACK', '66.6667', ${ids['arjun.mehta@atomquest.demo']}
      )
      ON CONFLICT (goal_id, period) DO UPDATE SET
        actual_value = EXCLUDED.actual_value,
        achievement_status = EXCLUDED.achievement_status,
        progress_score = EXCLUDED.progress_score
    `
}

// Sam — LOCKED + completed check-in on active quarter
const samSheet = await upsertSheet(ids['sam.okonkwo@atomquest.demo'], 'LOCKED', {
    submittedAt: new Date(Date.now() - 20 * 86400000),
    approvedAt: new Date(Date.now() - 10 * 86400000),
    approvedById: managerId,
})
await insertGoals(samSheet, [
    {
        thrustAreaId: thrustByName['Operational Excellence'],
        title: 'Reduce logistics cost vs plan',
        uomType: 'PERCENT_MIN',
        targetValue: '8',
        weightage: 42,
    },
    {
        thrustAreaId: thrustByName.Growth,
        title: 'On-time delivery rate',
        uomType: 'PERCENT_MIN',
        targetValue: '98',
        weightage: 43,
    },
])
const samGoals = await sql`SELECT id FROM goal WHERE goal_sheet_id = ${samSheet} LIMIT 1`
if (samGoals[0]) {
    await sql`
      INSERT INTO quarterly_update (
        id, goal_id, period, actual_value, achievement_status, progress_score, updated_by_id
      ) VALUES (
        gen_random_uuid()::text, ${samGoals[0].id}, ${activeQuarter},
        '6', 'COMPLETED', '75.0000', ${ids['sam.okonkwo@atomquest.demo']}
      )
      ON CONFLICT (goal_id, period) DO UPDATE SET
        actual_value = EXCLUDED.actual_value,
        achievement_status = EXCLUDED.achievement_status,
        progress_score = EXCLUDED.progress_score
    `
}

// Jordan — RETURNED
const jordanSheet = await upsertSheet(ids['jordan.lee@atomquest.demo'], 'RETURNED', {
    submittedAt: new Date(Date.now() - 5 * 86400000),
    returnedAt: new Date(Date.now() - 1 * 86400000),
    returnReason: 'Please add measurable targets for the sales pipeline goal and rebalance weightage.',
})
await insertGoals(jordanSheet, [
    {
        thrustAreaId: thrustByName.Growth,
        title: 'Grow regional sales pipeline',
        uomType: 'NUMERIC_MIN',
        targetValue: '500000',
        weightage: 60,
    },
    {
        thrustAreaId: thrustByName['People & Culture'],
        title: 'Complete sales certification',
        uomType: 'TIMELINE',
        targetDeadline: `${year}-07-01`,
        weightage: 40,
    },
])

// Shared KPI — company cost reduction (Arjun primary, Sam recipient)
const existingShared = await sql`
  SELECT id FROM shared_goal WHERE title = 'Company-wide operating cost reduction' LIMIT 1
`
if (existingShared.length > 0) {
    sharedGoalId = existingShared[0].id
} else {
    const [row] = await sql`
      INSERT INTO shared_goal (
        id, title, description, thrust_area_id, uom_type, target_value,
        primary_owner_user_id, created_by_id, cycle_id
      ) VALUES (
        gen_random_uuid()::text,
        'Company-wide operating cost reduction',
        'Reduce operating cost vs annual plan',
        ${thrustByName['Operational Excellence']},
        'PERCENT_MIN', '10',
        ${ids['arjun.mehta@atomquest.demo']}, ${adminId}, ${goalCycleId}
      ) RETURNING id
    `
    sharedGoalId = row.id
}

if (sharedGoalId) {
    const arjunHasShared = await sql`
      SELECT id FROM goal WHERE goal_sheet_id = ${arjunSheet} AND shared_goal_id = ${sharedGoalId} LIMIT 1
    `
    if (arjunHasShared.length === 0) {
        const arjunOrder = await sql`SELECT COUNT(*)::int AS c FROM goal WHERE goal_sheet_id = ${arjunSheet}`
        await sql`
          INSERT INTO goal (
            id, goal_sheet_id, thrust_area_id, title, description, uom_type,
            target_value, weightage, sort_order, shared_goal_id, is_shared_recipient, is_primary_owner
          ) VALUES (
            gen_random_uuid()::text, ${arjunSheet}, ${thrustByName['Operational Excellence']},
            'Company-wide operating cost reduction', 'Reduce operating cost vs annual plan',
            'PERCENT_MIN', '10', 15, ${arjunOrder[0].c}, ${sharedGoalId}, false, true
          )
        `
    }
    const samHasShared = await sql`
      SELECT id FROM goal WHERE goal_sheet_id = ${samSheet} AND shared_goal_id = ${sharedGoalId} LIMIT 1
    `
    if (samHasShared.length === 0) {
        const samOrder = await sql`SELECT COUNT(*)::int AS c FROM goal WHERE goal_sheet_id = ${samSheet}`
        await sql`
          INSERT INTO goal (
            id, goal_sheet_id, thrust_area_id, title, description, uom_type,
            target_value, weightage, sort_order, shared_goal_id, is_shared_recipient, is_primary_owner
          ) VALUES (
            gen_random_uuid()::text, ${samSheet}, ${thrustByName['Operational Excellence']},
            'Company-wide operating cost reduction', 'Reduce operating cost vs annual plan',
            'PERCENT_MIN', '10', 15, ${samOrder[0].c}, ${sharedGoalId}, true, false
          )
        `
    }
}

// Manager check-in comment on Arjun
const [qCycle] = await sql`
  SELECT id FROM performance_cycle WHERE year = ${year} AND phase = ${activeQuarter} LIMIT 1
`
if (qCycle) {
    await sql`
      INSERT INTO manager_check_in (id, employee_id, manager_id, cycle_id, period, comment)
      VALUES (
        gen_random_uuid()::text, ${ids['arjun.mehta@atomquest.demo']}, ${managerId},
        ${qCycle.id}, ${activeQuarter},
        'Strong progress on deployment frequency — consider documenting runbooks for the team.'
      )
      ON CONFLICT (employee_id, cycle_id, period) DO UPDATE SET comment = EXCLUDED.comment
    `
}

// Audit trail samples
const auditSamples = [
    {
        entityType: 'GOAL_SHEET',
        entityId: priyaSheet,
        action: 'SUBMITTED',
        changedById: ids['priya.sharma@atomquest.demo'],
        changes: { status: { before: 'DRAFT', after: 'SUBMITTED' } },
    },
    {
        entityType: 'GOAL_SHEET',
        entityId: arjunSheet,
        action: 'LOCKED',
        changedById: managerId,
        changes: { status: { before: 'SUBMITTED', after: 'LOCKED' } },
    },
    {
        entityType: 'QUARTERLY_UPDATE',
        entityId: arjunSheet,
        action: `CHECK_IN_${activeQuarter}`,
        changedById: ids['arjun.mehta@atomquest.demo'],
        changes: { period: activeQuarter },
    },
]

for (const a of auditSamples) {
    await sql`
      INSERT INTO audit_log (id, entity_type, entity_id, action, changes, changed_by_id)
      VALUES (
        gen_random_uuid()::text, ${a.entityType}, ${a.entityId}, ${a.action},
        ${JSON.stringify(a.changes)}::jsonb, ${a.changedById}
      )
    `
}

console.log('\nDone. Demo logins (password: AtomQuest@123):\n')
console.log('  admin@atomquest.demo     — Admin (Jordan Kim)')
console.log('  manager@atomquest.demo   — Manager (Maya Chen)')
console.log('  employee@atomquest.demo  — Employee DRAFT — live demo (Alex Rivera)')
console.log('  priya.sharma@atomquest.demo  — SUBMITTED (pending review)')
console.log('  arjun.mehta@atomquest.demo   — LOCKED + check-in + shared KPI owner')
console.log('  sam.okonkwo@atomquest.demo   — LOCKED + completed check-in')
console.log('  jordan.lee@atomquest.demo    — RETURNED')
console.log(`\nActive quarter for check-ins: ${activeQuarter}`)
