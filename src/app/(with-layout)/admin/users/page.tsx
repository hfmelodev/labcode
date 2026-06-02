import { getAdminUsers } from '../../_actions/user'
import { UsersTable } from '../../_components/pages/admin/users-table'

export default async function AdminUsersPage() {
  const users = await getAdminUsers()

  return (
    <>
      <h1 className="font-bold text-2xl">Usuários</h1>

      <UsersTable users={users} />
    </>
  )
}
