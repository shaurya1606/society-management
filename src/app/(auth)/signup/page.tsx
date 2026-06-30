'use client'
import { SignupForm } from '@/components/auth/SignupForm'

const SignUpPage = () => {
    return (
        <SignupForm
            title="Create your account"
            subtitle="Register to raise and track maintenance complaints."
            buttonLabel="Create account"
            buttonHref="/dashboard"
        />
    )
}

export default SignUpPage
