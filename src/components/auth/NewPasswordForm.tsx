'use client'
import React, { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { NewPasswordFormSchema } from '@/lib/schema/authSchema'
import { FieldError } from '@/components/auth/ui/field'
import FormError from '@/components/auth/ui/form-error'
import FormSuccess from '@/components/auth/ui/form-success'
import axios from 'axios'

interface NewPasswordFormProps {
    title?: string
    subtitle?: string
    buttonLabel?: string
    buttonHref?: string
}

export function NewPasswordForm({
    title,
    subtitle,
    buttonLabel,
    buttonHref: _buttonHref,
}: NewPasswordFormProps) {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string>('')
    const [error, setError] = useState<string>('')
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    type NewPasswordValues = z.infer<typeof NewPasswordFormSchema>

    const form = useForm<NewPasswordValues>({
        resolver: zodResolver(NewPasswordFormSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: NewPasswordValues) => {
        setSuccess('')
        setError('')

        if (!token) {
            setError('Invalid reset link. Token is missing.')
            return
        }

        startTransition(async () => {
            try {
                const response = await axios.post(
                    '/api/auth/new-password',
                    {
                        token,
                        password: values.password,
                        // confirmPassword is validated client-side only, not sent to API
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                const message =
                    response.data?.message ?? 'Password reset successfully!'

                setSuccess(message)

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data?.message ??
                        'Unable to reset password. Please try again.'

                    setError(message)
                } else {
                    setError('An unexpected error occurred. Please try again.')
                }
            }
        })
    }


    const submitLabel = buttonLabel ?? 'Reset Password'

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
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <LabelInputContainer
                            data-invalid={fieldState.invalid}
                            className="mb-4"
                        >
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="new-password"
                                    disabled={isPending}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <IconEyeOff className="h-5 w-5" />
                                    ) : (
                                        <IconEye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </LabelInputContainer>
                    )}
                />

                <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <LabelInputContainer
                            data-invalid={fieldState.invalid}
                            className="mb-4"
                        >
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                                Confirm password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="new-password"
                                    disabled={isPending}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <IconEyeOff className="h-5 w-5" />
                                    ) : (
                                        <IconEye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </LabelInputContainer>
                    )}
                />

                <div className="my-4">
                    <FormError message={error} />
                    <FormSuccess message={success} />
                </div>

                <Button
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? 'Resetting…' : submitLabel}
                </Button>

                <div className="my-8 w-full  from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
                <p>
                    By continuing, you agree to our{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">Terms</a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>
                </p>
            </div>

            <div className="mt-6 text-center text-sm">
                <p className="text-slate-500">
                    Back to{' '}
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

export default NewPasswordForm
