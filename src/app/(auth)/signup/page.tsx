'use client'
import { SignupForm } from '@/components/auth/SignupForm'

const SignUpPage = () => {
    return (
        <SignupForm
            title="Create your account"
            subtitle="Join Society Maintenance Tracker to raise and track complaints"
            buttonLabel="Create account"
            buttonHref="/dashboard"
        />
    )
}

export default SignUpPage

