'use client'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { IconX as _IconX } from '@tabler/icons-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ResetPasswordFormSchema } from '@/lib/schema/authSchema'
import { FieldError } from '@/components/auth/ui/field'
import FormError from '@/components/auth/ui/form-error'
import FormSuccess from '@/components/auth/ui/form-success'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'

interface ResetPasswordFormProps {
    title?: string
    subtitle?: string
    buttonLabel?: string
    buttonHref?: string
}

export function ResetPasswordForm({
    title,
    subtitle,
    buttonLabel,
    buttonHref: _buttonHref,
}: ResetPasswordFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [_emailSent, setEmailSent] = useState(false)
    const searchParams = useSearchParams()
    const urlError =
        searchParams.get('error') === 'OAuthAccountNotLinked'
            ? 'Your email is already in use. Please use another email'
            : ''

    type ResetPasswordValues = z.infer<typeof ResetPasswordFormSchema>

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(ResetPasswordFormSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (values: ResetPasswordValues) => {
        setSuccess('')
        setError('')
        setEmailSent(false)

        startTransition(async () => {
            try {
                const response = await axios.post(
                    '/api/auth/reset-password',
                    values,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                const message =
                    response.data?.message ??
                    'Password reset link has been sent.'
                const isEmailSent = response.data?.emailSent ?? false

                setSuccess(message)
                setEmailSent(isEmailSent)
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data?.message ??
                        'Unable to process the request.'

                    setError(message)
                } else {
                    setError('An unexpected error occurred. Please try again.')
                }
            }
        })
    }


    const submitLabel = buttonLabel ?? 'Send Reset Link'

    return (
        <div className="w-full">


            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    {title}
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                    {subtitle}
                </p>
            </div>

            <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <LabelInputContainer
                            data-invalid={fieldState.invalid}
                            className="mb-4"
                        >
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
                            <Input
                                id="email"
                                placeholder="you@company.com"
                                type="email"
                                {...field}
                                aria-invalid={fieldState.invalid}
                                autoComplete="email"
                                disabled={isPending}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </LabelInputContainer>
                    )}
                />

                <div className="my-4">
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                </div>

                <Button
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? 'Sending…' : submitLabel}
                </Button>

                <div className="my-8  w-full  from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
                <p>
                    By continuing, you agree to our{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                        Terms
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                        Privacy Policy
                    </a>
                </p>
            </div>

            <div className="mt-6 text-center text-sm">
                <p className="text-slate-500">
                    Remembered your password?{' '}
                    <button
                        type="button"
                        onClick={() => { router.replace('/login') }}
                        className="font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    )
}


const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) => {
    return (
        <div className={cn('flex w-full flex-col space-y-2', className)}>
            {children}
        </div>
    )
}

export default ResetPasswordForm
