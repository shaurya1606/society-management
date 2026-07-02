'use client'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Link from 'next/link'
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
import { LoginFormSchema } from '@/lib/schema/authSchema'
import { FieldError } from '@/components/auth/ui/field'
import FormError from '@/components/auth/ui/form-error'
import FormSuccess from '@/components/auth/ui/form-success'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'
import { useSearchParams } from 'next/navigation'
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts'


interface LoginFormProps {
    title?: string
    subtitle?: string
    mode?: 'modal' | 'redirect'
    buttonLabel?: string
    buttonHref?: string
}

export function LoginForm({
    title,
    mode,
    subtitle,
    buttonLabel,
    buttonHref: _buttonHref,
}: LoginFormProps) {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [_emailSent, setEmailSent] = useState(false)
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const searchParams = useSearchParams()
    const authError = searchParams.get('error')
    const urlError =
        authError === 'OAuthAccountNotLinked'
            ? 'Your email is already in use. Sign in with credentials or use another provider.'
            : authError === 'OAuthSignin' || authError === 'OAuthCallback'
              ? 'Social sign-in failed. Check provider credentials and redirect URLs in your environment.'
              : authError === 'Configuration'
                ? 'OAuth is not configured on this server.'
                : authError
                  ? 'Sign-in failed. Please try again or use email and password.'
                  : ''
    const callbackUrl = searchParams.get('callbackUrl') || undefined

    type LoginValues = z.infer<typeof LoginFormSchema>

    const form = useForm<LoginValues>({
        resolver: zodResolver(LoginFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            email: '',
            password: '',
            twoFactorCode: '',
        },
    })

    const onSubmit = async (values: LoginValues) => {
        setSuccess('')
        setError('')
        setEmailSent(false)

        startTransition(async () => {
            try {
                const response = await axios.post(
                    '/api/auth/login',
                    {
                        email: values.email.trim(),
                        password: values.password,
                        twoFactorCode:
                            values.twoFactorCode?.trim() || undefined,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                const message =
                    response.data?.message ?? 'Logged in successfully.'
                const isEmailSent = response.data?.emailSent ?? false

                if (response.data.twoFactorRequired) {
                    setShowTwoFactor(true)
                    setSuccess(message)
                    setError('')
                    setEmailSent(isEmailSent)
                    form.setValue('twoFactorCode', '')
                    form.setFocus('twoFactorCode')
                    return
                }
                setSuccess(message)
                setEmailSent(isEmailSent)
                setError('')
                setShowTwoFactor(false)
                form.reset({
                    email: '',
                    password: '',
                    twoFactorCode: '',
                })

                if (
                    response.status === 200 &&
                    !isEmailSent &&
                    response.data?.redirectTo
                ) {
                    router.push(callbackUrl || response.data.redirectTo)
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data?.message ??
                        'Unable to process the request.'
                    const isEmailSent = err.response?.data?.emailSent ?? false
                    if (showTwoFactor || err.response?.data?.twoFactorBlocked) {
                        setShowTwoFactor(true)
                        form.setValue('twoFactorCode', '')
                        form.setFocus('twoFactorCode')
                    }
                    setError(message)
                    setEmailSent(isEmailSent)
                } else {
                    setError('An unexpected error occurred. Please try again.')
                }
            }
        })
    }


    const onClickSocialLogin = (provider: string) => {
        setError('')
        signIn(provider, {
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
            redirect: true,
        })
    }

    const submitLabel = buttonLabel ?? 'Sign in'
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

            {/* Demo accounts */}
            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
                    Demo accounts · Click to auto-fill
                </p>
                <ul className="space-y-1.5">
                    {DEMO_ACCOUNTS.map((account) => (
                        <li key={account.email}>
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => {
                                    form.setValue('email', account.email)
                                    form.setValue('password', account.password)
                                    setError('')
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 group"
                            >
                                <span className="font-semibold text-slate-800 group-hover:text-indigo-800">
                                    {account.role}
                                </span>
                                <span className="block text-slate-500 truncate mt-0.5">
                                    {account.email} · password: {account.password}
                                </span>
                                <span className="block text-slate-400 mt-0.5 text-[11px]">
                                    {account.hint}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                {showTwoFactor && (
                    <Controller
                        name="twoFactorCode"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <LabelInputContainer data-invalid={fieldState.invalid}>
                                <Label htmlFor="twoFactorCode" className="text-sm font-medium text-slate-700">
                                    Two-factor code
                                </Label>
                                <Input
                                    id="twoFactorCode"
                                    placeholder="123456"
                                    type="text"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="one-time-code"
                                    disabled={isPending}
                                    className="border-slate-200 focus-visible:ring-indigo-500"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </LabelInputContainer>
                        )}
                    />
                )}
                {!showTwoFactor && (
                    <>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <LabelInputContainer data-invalid={fieldState.invalid}>
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-slate-700"
                                    >
                                        Email address
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
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </LabelInputContainer>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <LabelInputContainer data-invalid={fieldState.invalid}>
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Password
                                        </Label>
                                        <Link
                                            href="/reset-password"
                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            placeholder="••••••••"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="current-password"
                                            disabled={isPending}
                                            className="border-slate-200 focus-visible:ring-indigo-500 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
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
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </LabelInputContainer>
                            )}
                        />
                    </>
                )}

                <div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                </div>

                <Button
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? 'Signing in…' : submitLabel}
                </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
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
                        className="flex-1 h-9 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 text-xs font-medium gap-1.5"
                        type="button"
                        onClick={() => onClickSocialLogin(provider)}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </Button>
                ))}
            </div>

            {/* Footer links */}
            <div className="mt-6 text-center text-sm">
                <p className="text-slate-500">
                    Don&apos;t have an account?{' '}
                    <button
                        type="button"
                        onClick={() => {
                            router.replace('/signup')
                        }}
                        className="font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        Sign up
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

export default LoginForm
