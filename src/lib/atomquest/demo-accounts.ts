/** Hackathon demo credentials (see scripts/seed-atomquest.mjs). */
export const DEMO_PASSWORD = 'AtomQuest@123'

export const DEMO_ACCOUNTS = [
    {
        role: 'Employee',
        email: 'employee@atomquest.demo',
        hint: 'Goals → submit → quarterly check-in',
    },
    {
        role: 'Manager',
        email: 'manager@atomquest.demo',
        hint: 'Team → review → approve / return',
    },
    {
        role: 'Admin',
        email: 'admin@atomquest.demo',
        hint: 'Admin → stats, charts, export, shared KPIs',
    },
] as const
