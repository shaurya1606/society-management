import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import bcrypt from 'bcryptjs'
import { settingsSchema } from '@/lib/schema/authSchema'
import { findUserByEmail, findUserById } from '@/lib/queries/users/select'
import { updateUserById } from '@/lib/queries/users/update'
import { generateVerificationToken } from '@/services/authServices/token'
import { sendVerificationEmail } from '@/services/authServices/mail'
import { UserRole } from '@/lib/dbconfig/schema'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Validate the request body
        const validatedFields = settingsSchema.safeParse(body)

        if (!validatedFields.success) {
            return NextResponse.json(
                {
                    error: 'Invalid fields',
                    details: validatedFields.error.flatten(),
                },
                { status: 400 }
            )
        }

        const { name, email, password, newPassword, role, isTwoFactorEnabled } =
            validatedFields.data

        // Get current user from database
        const dbUser = await findUserById(session.user.id)

        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Check if user is OAuth user (no password)
        if (session.user.isOAuth) {
            // OAuth users cannot change email or password
            const updateData: {
                name?: string
                role?: UserRole
                isTwoFactorEnabled?: boolean
            } = {}

            if (name !== undefined) {
                updateData.name = name
            }

            if (role !== undefined) {
                updateData.role =
                    role === 'USER' ? UserRole.USER : UserRole.ADMIN
            }

            if (isTwoFactorEnabled !== undefined) {
                updateData.isTwoFactorEnabled = isTwoFactorEnabled
            }

            if (Object.keys(updateData).length > 0) {
                await updateUserById(dbUser.id, updateData)
            }

            return NextResponse.json({
                success: true,
                message: 'Settings updated successfully',
            })
        }

        // For credentials users
        const updateData: {
            name?: string
            email?: string
            emailVerified?: Date | null
            password?: string
            role?: UserRole
            isTwoFactorEnabled?: boolean
        } = {}

        // Handle name update
        if (name !== undefined && name !== dbUser.name) {
            updateData.name = name
        }

        // Handle email update
        if (email && email !== dbUser.email) {
            // Check if email is already taken
            const existingUser = await findUserByEmail(email)
            if (existingUser && existingUser.id !== dbUser.id) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 400 }
                )
            }

            // Generate verification token for new email
            const verificationToken = await generateVerificationToken({ email })
            await sendVerificationEmail(
                verificationToken.email,
                verificationToken.token
            )

            updateData.email = email
            updateData.emailVerified = null // Reset email verification

            return NextResponse.json({
                success: true,
                message:
                    'Verification email sent! Please verify your new email address.',
            })
        }

        // Handle password update
        if (password && newPassword) {
            // Verify current password
            if (!dbUser.password) {
                return NextResponse.json(
                    { error: 'No password set for this account' },
                    { status: 400 }
                )
            }

            const passwordMatch = await bcrypt.compare(
                password,
                dbUser.password
            )
            if (!passwordMatch) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 400 }
                )
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            updateData.password = hashedPassword
        }

        // Handle role toggle
        if (role !== undefined && role !== dbUser.role) {
            updateData.role = role === 'USER' ? UserRole.USER : UserRole.ADMIN
        }

        // Handle 2FA toggle
        if (
            isTwoFactorEnabled !== undefined &&
            isTwoFactorEnabled !== dbUser.isTwoFactorEnabled
        ) {
            updateData.isTwoFactorEnabled = isTwoFactorEnabled
        }

        // Update user if there are changes
        if (Object.keys(updateData).length > 0) {
            await updateUserById(dbUser.id, updateData)
        }

        return NextResponse.json({
            success: true,
            message: 'Settings updated successfully',
        })
    } catch (error) {
        console.error('Settings update error:', error)
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        )
    }
}
