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
        <div className="w-full text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Email Verification
            </h2>

            {loading && (
                <div className="my-8 flex justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                </div>
            )}

            {!loading && (
                <div className="my-6 text-left">
                    <FormError message={error} />
                    <FormSuccess message={success} />
                </div>
            )}

            {!loading && error && (
                <div className="mt-6 flex flex-col gap-3">
                    <Button
                        onClick={handleResendEmail}
                        disabled={resending}
                        className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
                    >
                        {resending
                            ? 'Redirecting...'
                            : 'Request New Verification Link'}
                    </Button>
                    <Button
                        onClick={() => router.push('/login')}
                        variant="outline"
                        className="w-full h-10 border-slate-200 text-slate-700 text-sm font-medium animate-none"
                    >
                        Back to Login
                    </Button>
                </div>
            )}
        </div>
    )
}
