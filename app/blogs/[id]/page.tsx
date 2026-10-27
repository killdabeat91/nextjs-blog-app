import { notFound } from "next/navigation"
import Link from "next/link"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { blogs, users } from "@/db/schema"
import { likeBlog, addToReadingList } from "@/app/actions/blogs"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (isNaN(id)) {
    notFound()
  }

  const blog = await db.query.blogs.findFirst({
    where: eq(blogs.id, id),
    with: {
      user: true,
    },
  })

  if (!blog) {
    notFound()
  }

  const session = await auth()
  let currentUserId: number | null = null

  if (session?.user?.id) {
    currentUserId = Number(session.user.id)
  } else if (session?.user?.email) {
    const u = await db.query.users.findFirst({
      where: eq(users.username, session.user.email),
    })
    if (u) currentUserId = u.id
  }

  const isOwner = currentUserId !== null && currentUserId === blog.userId
  const canAddToReadingList = currentUserId !== null && !isOwner

  return (
    <div
      data-testid="blog-detail"
      className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-6"
    >
      <div className="flex items-center justify-between">
        <Link
          href="/blogs"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Back to blogs
        </Link>
        {blog.user?.username && (
          <Link
            href={`/users/${blog.user.username}`}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            added by {blog.user.name}
          </Link>
        )}
      </div>

      <div>
        <h1
          data-testid="blog-title"
          className="text-2xl sm:text-3xl font-bold text-gray-900"
        >
          {blog.title}
        </h1>
        <p data-testid="blog-author" className="text-gray-600 mt-1">
          by {blog.author}
        </p>
      </div>

      <div className="p-3 bg-gray-50 rounded-md">
        <span className="text-sm text-gray-500 block mb-1">URL:</span>
        <a
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all text-sm font-medium"
        >
          {blog.url}
        </a>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-800">
            {blog.likes} {blog.likes === 1 ? "like" : "likes"}
          </span>
          <form action={likeBlog}>
            <input type="hidden" name="id" value={blog.id} />
            <button
              type="submit"
              className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md text-sm font-medium transition-colors"
            >
              Like
            </button>
          </form>
        </div>

        {canAddToReadingList && (
          <form action={addToReadingList}>
            <input type="hidden" name="blogId" value={blog.id} />
            <button
              type="submit"
              data-testid="add-to-reading-list-button"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Add to reading list
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
