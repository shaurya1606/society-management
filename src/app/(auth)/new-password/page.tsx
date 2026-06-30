'use client'
import { NewPasswordForm } from '@/components/auth/NewPasswordForm'

const NewPasswordPage = ({}) => {
    return (
        <div className="min-h-screen flex items-center justify-center  from-neutral-900 to-black p-4">
            <NewPasswordForm
                title="New Password"
                subtitle="Please enter your new password"
                buttonLabel="Set New Password"
                buttonHref="/dashboard"
            />
        </div>
    )
}

export default NewPasswordPage
