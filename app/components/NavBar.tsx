"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function NavBar() {
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl text-gray-900">
            BlogApp
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link
              href="/blogs"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              blogs
            </Link>
            <Link
              href="/users"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              users
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          {session?.user ? (
            <>
              <Link
                href="/me"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                me
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                login
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
