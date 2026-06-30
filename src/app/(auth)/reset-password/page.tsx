'use client'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

const ResetPasswordPage = ({}) => {
    return (
        <div className="min-h-screen flex items-center justify-center  from-neutral-900 to-black p-4">
            <ResetPasswordForm
                title="Reset Password"
                subtitle="Please enter your email to reset your password"
                buttonLabel="Send Reset Link"
                buttonHref="/dashboard"
            />
        </div>
    )
}

export default ResetPasswordPage
