import { auth } from '@/auth'
import { UserInfo } from '@/lib/helpers/user-info'

const Server = async () => {
    const session = await auth()
    const user = session?.user
    return (
        <div>
            <h1>Protected Server Page</h1>
            <p>This page is only accessible to authenticated users.</p>
            <UserInfo user={user} label="User Information" />
        </div>
    )
}

export default Server
