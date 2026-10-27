import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users, readingList } from "@/db/schema"
import { auth } from "@/auth"
import TokenManager from "./TokenManager"
import ReadingListManager from "./ReadingListManager"

export const dynamic = "force-dynamic"

export default async function MePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  let user = null
  if (session.user.id) {
    user = await db.query.users.findFirst({
      where: eq(users.id, Number(session.user.id)),
    })
  } else if (session.user.email) {
    user = await db.query.users.findFirst({
      where: eq(users.username, session.user.email),
    })
  }

  if (!user) {
    redirect("/login")
  }

  const items = await db.query.readingList.findMany({
    where: eq(readingList.userId, user.id),
    with: {
      blog: true,
    },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div
        data-testid="user-profile"
        className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <div className="space-y-1">
          <p className="text-gray-700">
            Name:{" "}
            <span
              data-testid="user-name"
              className="font-semibold text-gray-900"
            >
              {user.name}
            </span>
          </p>
          <p className="text-gray-700">
            Username:{" "}
            <span
              data-testid="user-username"
              className="font-semibold text-gray-900"
            >
              {user.username}
            </span>
          </p>
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <TokenManager initialToken={user.token} />
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <ReadingListManager initialItems={items as any} />
      </div>
    </div>
  )
}
