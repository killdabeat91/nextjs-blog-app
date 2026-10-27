import { notFound } from "next/navigation"
import Link from "next/link"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"

export const dynamic = "force-dynamic"

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
    with: {
      blogs: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Link href="/users" className="text-sm text-blue-600 hover:underline">
          ← Back to users
        </Link>
      </div>

      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <p className="text-sm text-gray-500">@{user.username}</p>

        <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
          Added Blogs
        </h2>

        {user.blogs.length === 0 ? (
          <p className="text-gray-500 text-sm">No blogs added yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {user.blogs.map((blog) => (
              <li
                key={blog.id}
                className="py-2.5 flex items-center justify-between"
              >
                <Link
                  href={`/blogs/${blog.id}`}
                  className="text-blue-600 hover:underline font-medium text-sm"
                >
                  {blog.title}
                </Link>
                <span className="text-xs text-gray-500">
                  {blog.likes} likes
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
