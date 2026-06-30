'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import FormError from '@/components/auth/ui/form-error'
import FormSuccess from '@/components/auth/ui/form-success'
import axios from 'axios'

export default function VerifyEmailPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')
    const missingToken = !token

    const [loading, setLoading] = useState(!missingToken)
    const [error, setError] = useState<string>(
        missingToken ? 'Invalid verification link. Token is missing.' : ''
    )
    const [success, setSuccess] = useState<string>('')
    const [resending, setResending] = useState(false)

    useEffect(() => {
        if (!token) return

        const verifyEmail = async () => {
            try {
                const response = await axios.post(
                    '/api/auth/verify-email',
                    {
                        token,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                const data = response.data

                setSuccess(
                    data.message ||
                        'Email verified successfully! Redirecting to login...'
                )
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data?.message || 'Failed to verify email.'
                    setError(message)
                } else {
                    setError('An error occurred while verifying your email.')
                }
            } finally {
                setLoading(false)
            }
        }

        verifyEmail()
    }, [token, router])

    const handleResendEmail = () => {
        setResending(true)
        // Redirect to login page where they can try to login and trigger resend
        router.push('/login')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 dark:from-neutral-900 dark:to-neutral-950">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-black">
                <div className="text-center">
                    <h1 className="mb-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                        Email Verification
                    </h1>

                    {loading && (
                        <div className="my-8 flex justify-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600 dark:border-neutral-800 dark:border-t-blue-400" />
                        </div>
                    )}

                    {!loading && (
                        <div className="my-6">
                            <FormError message={error} />
                            <FormSuccess message={success} />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="mt-4 flex flex-col gap-4">
                            <Button
                                onClick={handleResendEmail}
                                disabled={resending}
                                className="w-full"
                            >
                                {resending
                                    ? 'Redirecting...'
                                    : 'Request New Verification Email'}
                            </Button>
                            <Button
                                onClick={() => router.push('/login')}
                                variant="outline"
                                className="w-full"
                            >
                                Back to Login
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
