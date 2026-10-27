import Link from "next/link"
import { db } from "@/db"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  let allUsers: any[] = []
  let dbError: string | null = null

  try {
    allUsers = await db.query.users.findMany({
      with: {
        blogs: true,
      },
    })
  } catch (err: any) {
    dbError =
      "Chưa thể kết nối tới Database. Vui lòng kiểm tra biến DATABASE_URL trong .env.local."
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Users</h1>

      {dbError && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-sm">
          <strong>Thông báo Database:</strong> {dbError}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4 text-right">Blogs Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {allUsers.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-4 px-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <Link
                      href={`/users/${user.username}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {user.name} ({user.username})
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {user.blogs?.length || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
