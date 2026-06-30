'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { LoginForm } from '@/components/auth/LoginForm'

interface LoginButtonProps {
    children?: React.ReactNode
    mode?: 'modal' | 'redirect'
    type?: 'login' | 'signup'
    asChild?: boolean
}

export function LoginButton({
    children,
    mode = 'modal',
    type,
    asChild,
}: LoginButtonProps) {
    const router = useRouter()

    const onClick = () => {
        if (type === 'login') {
            router.push('/login')
        } else if (type === 'signup') {
            router.push('/signup')
        }
        console.log('Login button clicked')
    }

    if (mode === 'modal') {
        return (
            <>
                <Dialog>
                    <DialogTrigger asChild={Boolean(asChild)}>
                        {children}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg border-0 bg-transparent p-0 shadow-none outline-none">
                        <DialogTitle className="sr-only">Login</DialogTitle>
                        <LoginForm
                            title="Welcome Back"
                            subtitle="Please enter your credentials"
                            buttonLabel="Log In"
                            buttonHref="/dashboard"
                            mode="modal"
                        />
                    </DialogContent>
                </Dialog>
            </>
        )
    }

    return (
        <span className={`login-button ${mode}`} onClick={onClick}>
            {children}
        </span>
    )
}
