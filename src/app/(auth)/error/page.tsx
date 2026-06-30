
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IconAlertTriangle } from '@tabler/icons-react'

export default function AuthErrorPage() {
    return (
        <div className="w-full text-center">
            <div className="mb-6 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <IconAlertTriangle className="h-6 w-6" />
                </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
                Authentication Error
            </h2>
            <p className="mt-2 text-sm text-slate-500">
                Something went wrong with the authentication process. Please try logging in again.
            </p>
            <div className="mt-8">
                <Button
                    asChild
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
                >
                    <Link href="/login">Back to Login</Link>
                </Button>
            </div>
        </div>
    )
}
