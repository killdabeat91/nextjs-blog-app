import Link from "next/link"
import { db } from "@/db"

export const dynamic = "force-dynamic"

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = (await searchParams) || {}

  let allBlogs = await db.query.blogs.findMany({
    orderBy: (blogs, { desc }) => [desc(blogs.likes)],
  })

  if (filter) {
    const q = filter.toLowerCase()
    allBlogs = allBlogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
        <Link
          href="/blogs/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors w-fit"
        >
          Create New Blog
        </Link>
      </div>

      <form method="GET" action="/blogs" className="flex gap-2 max-w-md">
        <input
          name="filter"
          defaultValue={filter || ""}
          placeholder="Filter blogs by title or author..."
          data-testid="filter-input"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        />
        <button
          type="submit"
          data-testid="search-button"
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-md transition-colors"
        >
          Search
        </button>
        {filter && (
          <Link
            href="/blogs"
            className="px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-md hover:bg-gray-50 flex items-center"
          >
            Clear
          </Link>
        )}
      </form>

      <div data-testid="blogs-list" className="space-y-3">
        {allBlogs.length === 0 ? (
          <p className="text-gray-500 py-6">No blogs found.</p>
        ) : (
          allBlogs.map((blog) => (
            <div
              key={blog.id}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors flex items-center justify-between shadow-xs"
            >
              <div>
                <Link
                  href={`/blogs/${blog.id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {blog.title}
                </Link>
                <p className="text-sm text-gray-600">by {blog.author}</p>
              </div>
              <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                {blog.likes} likes
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
