"use client"

import { useState } from "react"
import Link from "next/link"
import { markBlogAsRead } from "@/app/actions/user"

interface ReadingItem {
  id: number
  read: boolean
  blog: {
    id: number
    title: string
    author: string
    url: string
  }
}

export default function ReadingListManager({
  initialItems,
}: {
  initialItems: ReadingItem[]
}) {
  const [items, setItems] = useState<ReadingItem[]>(initialItems)

  const handleMarkAsRead = async (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    )

    const formData = new FormData()
    formData.append("id", String(id))
    await markBlogAsRead(formData)
  }

  if (items.length === 0) {
    return (
      <div data-testid="reading-list-section" className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Reading List</h2>
        <p data-testid="empty-reading-list" className="text-gray-500 text-sm">
          No blogs in your reading list yet.
        </p>
      </div>
    )
  }

  const unreadItems = items.filter((item) => !item.read)
  const readItems = items.filter((item) => item.read)

  return (
    <div data-testid="reading-list-section" className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Reading List</h2>

      <div data-testid="unread-section" className="space-y-3">
        <h3 className="text-base font-semibold text-gray-800">Unread</h3>
        {unreadItems.length === 0 ? (
          <p data-testid="no-unread-blogs" className="text-sm text-gray-500">
            No unread blogs.
          </p>
        ) : (
          <ul className="space-y-2">
            {unreadItems.map((item) => (
              <li
                key={item.id}
                className="p-3 bg-white border border-gray-200 rounded-md flex items-center justify-between"
              >
                <div>
                  <Link
                    href={`/blogs/${item.blog.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {item.blog.title}
                  </Link>
                  <p className="text-xs text-gray-500">by {item.blog.author}</p>
                </div>
                <button
                  type="button"
                  data-testid={`mark-read-${item.id}`}
                  onClick={() => handleMarkAsRead(item.id)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                >
                  Mark as read
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h3 className="text-base font-semibold text-gray-800">Read</h3>
        {readItems.length === 0 ? (
          <p className="text-sm text-gray-500">No read blogs yet.</p>
        ) : (
          <ul className="space-y-2">
            {readItems.map((item) => (
              <li
                key={item.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between text-gray-700"
              >
                <div>
                  <Link
                    href={`/blogs/${item.blog.id}`}
                    className="font-medium hover:underline"
                  >
                    {item.blog.title}
                  </Link>
                  <p className="text-xs text-gray-500">by {item.blog.author}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                  Read
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
