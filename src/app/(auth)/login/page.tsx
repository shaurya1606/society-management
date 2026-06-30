'use client'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LogInPage() {
    return (
        <LoginForm
            title="Welcome back"
            subtitle="Sign in to your Society Maintenance Tracker account"
            buttonLabel="Sign in"
            buttonHref="/dashboard"
        />
    )
}

