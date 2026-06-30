'use client'
import { useSession } from 'next-auth/react'

const useCurrentUser = () => {
    const { data: session } = useSession()
    return session?.user
}

export default useCurrentUser
