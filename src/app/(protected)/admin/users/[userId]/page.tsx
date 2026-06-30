import { UserDetailWorkspace } from '@/components/admin/user-detail-workspace'

type PageProps = { params: Promise<{ userId: string }> }

export default async function AdminUserDetailPage({ params }: PageProps) {
    const { userId } = await params
    return <UserDetailWorkspace userId={userId} />
}
