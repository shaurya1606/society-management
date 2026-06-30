'use client'

import { useState, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { settingsSchema } from '@/lib/schema/authSchema'
import { roleDisplayLabel } from '@/lib/atomquest/roles'
import { UserRole } from '@/lib/dbconfig/schema'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type SettingsFormData = z.infer<typeof settingsSchema>

export default function SettingsPage() {
    const { data: session, update } = useSession()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: session?.user?.name || '',
            email: session?.user?.email || '',
            role: session?.user?.role ?? UserRole.EMPLOYEE,
            isTwoFactorEnabled:
                session?.user?.isTwoFactorEnabled ??
                session?.user?.twoFactorEnabled ??
                false,
            password: '',
            newPassword: '',
        },
    })

    const isTwoFactorEnabled = useWatch({ control, name: 'isTwoFactorEnabled' })
    const portalRole = session?.user?.role as UserRole | undefined

    const onSubmit = async (data: SettingsFormData) => {
        setMessage(null)

        startTransition(async () => {
            try {
                const { role: _omitRole, ...payload } = data
                const response = await axios.post('/api/settings', payload)

                if (response.data.success) {
                    setMessage({ type: 'success', text: response.data.message })

                    // Update session to reflect changes
                    await update()

                    // Refresh router to get updated data
                    router.refresh()

                    // Reset password fields
                    reset({
                        ...data,
                        password: '',
                        newPassword: '',
                    })
                } else {
                    setMessage({
                        type: 'error',
                        text:
                            response.data.error || 'Failed to update settings',
                    })
                }
            } catch (error: unknown) {
                let errorMessage = 'Something went wrong'

                if (axios.isAxiosError(error)) {
                    errorMessage =
                        error.response?.data?.error || errorMessage
                }

                setMessage({ type: 'error', text: errorMessage })
            }
        })
    }

    return (
        <div className="container max-w-2xl mx-auto py-10">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your account settings and preferences
                    </p>
                </div>

                {message && (
                    <div
                        className={`p-4 rounded-md ${
                            message.type === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* User Info Card */}
                    <div className="border rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-semibold">
                            Profile Information
                        </h2>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                disabled={isPending}
                                placeholder="Enter your name"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                                disabled={isPending || session?.user?.isOAuth}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                            {session?.user?.isOAuth && (
                                <p className="text-sm text-muted-foreground">
                                    Email cannot be changed for OAuth accounts
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Portal role</Label>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">
                                    {roleDisplayLabel(portalRole)}
                                </Badge>
                                <p className="text-sm text-muted-foreground">
                                    Assigned by your organization (read-only)
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-sm text-muted-foreground">
                                <strong>Account Type:</strong>{' '}
                                {session?.user?.isOAuth
                                    ? 'OAuth'
                                    : 'Credentials'}
                            </p>
                        </div>
                    </div>

                    {/* Security Card */}
                    {!session?.user?.isOAuth && (
                        <div className="border rounded-lg p-6 space-y-4">
                            <h2 className="text-xl font-semibold">Security</h2>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Current Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    disabled={isPending}
                                    placeholder="Enter current password"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">
                                    New Password
                                </Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    {...register('newPassword')}
                                    disabled={isPending}
                                    placeholder="Enter new password"
                                />
                                {errors.newPassword && (
                                    <p className="text-sm text-red-500">
                                        {errors.newPassword.message}
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Leave blank to keep current password
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Two Factor Authentication Card */}
                    <div className="border rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-semibold">
                            Two-Factor Authentication
                        </h2>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isTwoFactorEnabled"
                                {...register('isTwoFactorEnabled')}
                                disabled={isPending || session?.user?.isOAuth}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label
                                htmlFor="isTwoFactorEnabled"
                                className="cursor-pointer"
                            >
                                Enable Two-Factor Authentication
                            </Label>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            {isTwoFactorEnabled
                                ? '✅ Two-factor authentication is enabled for your account'
                                : '❌ Two-factor authentication is currently disabled'}
                        </p>

                        {session?.user?.isOAuth && (
                            <p className="text-sm text-muted-foreground">
                                Two-factor authentication is not available for
                                OAuth accounts
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
