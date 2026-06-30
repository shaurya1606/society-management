import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
    title: 'Society Maintenance Tracker',
    description:
        'Society Maintenance Tracker helps residents raise complaints, track resolution history, and receive updates in a simple, role-based platform.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${poppins.variable} font-[family-name:var(--font-poppins)] antialiased`}
            >
                {children}
            </body>
        </html>
    )
}
