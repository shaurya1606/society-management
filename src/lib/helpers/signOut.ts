'use server'
import { auth, signOut } from '@/auth'

export const signOutUser = async () => {
    const session = await auth()

    await signOut()

    return session
}
