import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import Navbar from '@/components/dashboard/Navbar'

const AuthProvider = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth()
    return (
        <SessionProvider session={session}>
            <div className="min-h-screen flex flex-col w-full bg-slate-50">
                <Navbar />
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </SessionProvider>
    )
}

export default AuthProvider

