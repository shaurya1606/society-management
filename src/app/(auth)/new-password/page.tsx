'use client'
import { NewPasswordForm } from '@/components/auth/NewPasswordForm'

const NewPasswordPage = ({}) => {
    return (
        <NewPasswordForm
            title="Create New Password"
            subtitle="Please enter and confirm your new password below."
            buttonLabel="Update Password"
            buttonHref="/dashboard"
        />
    )
}

export default NewPasswordPage
