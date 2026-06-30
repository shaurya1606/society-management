'use client'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

const ResetPasswordPage = ({}) => {
    return (
        <ResetPasswordForm
            title="Reset Password"
            subtitle="Enter your registered email address to request a password reset link."
            buttonLabel="Send Reset Link"
            buttonHref="/dashboard"
        />
    )
}

export default ResetPasswordPage
