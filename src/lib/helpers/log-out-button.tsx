'use client'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const UserButton = () => {
    const session = useSession()

    return (
        <>
            <LogOutButton>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage
                                src={session?.data?.user?.image || ''}
                                alt="@{session?.data?.user?.name}"
                            />
                            <AvatarFallback>
                                {session?.data?.user?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            {session?.data?.user?.name}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <LogOutButton>Log Out</LogOutButton>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </LogOutButton>
        </>
    )
}

const LogOutButton = ({ children }: { children: React.ReactNode }) => {

    const handleLogout = () => {
        signOut()
    }

    return (
        <>
            <span
                onClick={handleLogout}
                className="cursor-pointer hover:underline"
            >
                {children}
            </span>
        </>
    )
}

export default LogOutButton
