'use client'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
    IconBrandGithub,
    IconBrandGoogle,
    IconBrandLinkedin,
    IconEye,
    IconEyeOff,
} from '@tabler/icons-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { SignupFormSchema } from '@/lib/schema/authSchema'
import { FieldError } from '@/components/auth/ui/field'
import FormError from '@/components/auth/ui/form-error'
import FormSuccess from '@/components/auth/ui/form-success'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'

interface SignupFormProps {
    title?: string
    subtitle?: string
    buttonLabel?: string
    buttonHref?: string
    mode?: 'modal' | 'redirect'
}

export function SignupForm({
    title,
    subtitle,
    buttonLabel,
    buttonHref: _buttonHref,
    mode,
}: SignupFormProps) {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [_emailSent, setEmailSent] = useState(false)

    type SignupValues = z.infer<typeof SignupFormSchema>

    const form = useForm<SignupValues>({
        resolver: zodResolver(SignupFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: SignupValues) => {
        setSuccess('')
        setError('')
        setEmailSent(false)

        startTransition(async () => {
            try {
                const response = await axios.post(
                    '/api/auth/signup',
                    {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        password: values.password,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                const message =
                    response.data?.message ?? 'Account created successfully.'
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

    const onClickSocialLogin = (provider: string) => {
        signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT, redirect: true })
    }

    const submitLabel = buttonLabel ?? 'Create account'
    const isModal = mode === 'modal'

    return (
        <div
            className={cn(
                'w-full',
                isModal
                    ? 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm'
                    : ''
            )}
        >
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    {title}
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                    {subtitle}
                </p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Controller
                        name="firstName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <LabelInputContainer
                                data-invalid={fieldState.invalid}
                                className="flex-1"
                            >
                                <Label
                                    htmlFor="firstName"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    First name
                                </Label>
                                <Input
                                    id="firstName"
                                    placeholder="Jane"
                                    type="text"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="given-name"
                                    disabled={isPending}
                                    className="border-slate-200 focus-visible:ring-indigo-500"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </LabelInputContainer>
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <LabelInputContainer
                                data-invalid={fieldState.invalid}
                                className="flex-1"
                            >
                                <Label
                                    htmlFor="lastName"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Last name
                                </Label>
                                <Input
                                    id="lastName"
                                    placeholder="Smith"
                                    type="text"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="family-name"
                                    disabled={isPending}
                                    className="border-slate-200 focus-visible:ring-indigo-500"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </LabelInputContainer>
                        )}
                    />
                </div>

                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <LabelInputContainer data-invalid={fieldState.invalid}>
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-slate-700"
                            >
                                Work email address
                            </Label>
                            <Input
                                id="email"
                                placeholder="you@company.com"
                                type="email"
                                {...field}
                                aria-invalid={fieldState.invalid}
                                autoComplete="email"
                                disabled={isPending}
                                className="border-slate-200 focus-visible:ring-indigo-500"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </LabelInputContainer>
                    )}
                />

                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <LabelInputContainer data-invalid={fieldState.invalid}>
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-slate-700"
                            >
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="new-password"
                                    disabled={isPending}
                                    className="border-slate-200 focus-visible:ring-indigo-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <IconEyeOff className="h-4 w-4" />
                                    ) : (
                                        <IconEye className="h-4 w-4" />
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
                        <LabelInputContainer data-invalid={fieldState.invalid}>
                            <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-slate-700"
                            >
                                Confirm password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="new-password"
                                    disabled={isPending}
                                    className="border-slate-200 focus-visible:ring-indigo-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <IconEyeOff className="h-4 w-4" />
                                    ) : (
                                        <IconEye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </LabelInputContainer>
                    )}
                />

                <div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                </div>

                <Button
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? 'Creating account…' : submitLabel}
                </Button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Social login */}
            <div className="flex gap-2">
                {[
                    { icon: IconBrandGithub, label: 'GitHub', provider: 'github' },
                    { icon: IconBrandGoogle, label: 'Google', provider: 'google' },
                    { icon: IconBrandLinkedin, label: 'LinkedIn', provider: 'linkedin' },
                ].map(({ icon: Icon, label, provider }) => (
                    <Button
                        key={provider}
                        variant="outline"
                        className="flex-1 h-9 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium gap-1.5"
                        type="button"
                        onClick={() => onClickSocialLogin(provider)}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </Button>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm">
                <p className="text-slate-500">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={() => { router.replace('/login') }}
                        className="font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        Sign in
                    </button>
                </p>
            </div>

            <div className="mt-4 text-center text-xs text-slate-400">
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
        <div className={cn('flex w-full flex-col space-y-1.5', className)}>
            {children}
        </div>
    )
}

export default SignupForm
