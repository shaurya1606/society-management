'use client'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LogInPage() {
    return (
        <LoginForm
            title="Sign in to Society Maintenance Tracker"
            subtitle="Access your complaints, notices, and admin workflows."
            buttonLabel="Sign in"
            buttonHref="/dashboard"
        />
    )
}
