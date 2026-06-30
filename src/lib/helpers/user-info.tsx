import Image from 'next/image'
import { ExtendedUser } from '@/next-auth'

interface UserInfoProps {
    user: ExtendedUser | undefined
    label: string
}

export const UserInfo: React.FC<UserInfoProps> = ({ user, label }) => {
    return (
        <div>
            {label && (
                <div className="mb-2">
                    <strong>{label}</strong>
                </div>
            )}
            <div>
                <strong>Email:</strong> {user ? user.email : 'Guest'}
            </div>
            <div className="mt-2">
                <div className="flex justify-between">
                    <strong>ID:</strong> {user ? user.id : 'Guest'}
                </div>
                <div className="flex justify-between">
                    <strong>Name:</strong> {user ? user.name : 'Guest'}
                </div>
                <div className="flex justify-between">
                    <strong>Role:</strong> {user ? user.role : 'Guest'}
                </div>
                <div className="flex justify-between items-center gap-2">
                    <strong>Image:</strong>{' '}
                    {user && user.image ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                            <Image
                                src={user.image}
                                alt={user.name || 'User Image'}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        'Guest'
                    )}
                </div>
                <div className="flex justify-between">
                    <strong>Two Factor Authentication:</strong>{' '}
                    {user
                        ? user.isTwoFactorEnabled || user.twoFactorEnabled
                            ? 'Enabled'
                            : 'Disabled'
                        : 'Guest'}
                </div>
            </div>
        </div>
    )
}
