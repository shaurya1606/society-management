/** Hackathon demo credentials (see scripts/seed-society.mjs). */
export const DEMO_PASSWORD = 'Resident@123'

export const DEMO_ACCOUNTS = [
    {
        role: 'Resident (Block A)',
        email: 'resident@societytrack.demo',
        password: 'Resident@123',
        hint: 'Resident → file complaints, view notices',
    },
    {
        role: 'Resident (Block B)',
        email: 'amit.resident@societytrack.demo',
        password: 'Resident@123',
        hint: 'Resident → file complaints, view notices',
    },
    {
        role: 'Admin',
        email: 'admin@societytrack.demo',
        password: 'Admin@123',
        hint: 'Admin → manage complaints, notices',
    },
] as const
