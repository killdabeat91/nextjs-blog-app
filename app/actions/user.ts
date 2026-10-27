"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users, readingList } from "@/db/schema"
import { auth } from "@/auth"

export async function generateApiToken() {
  const session = await auth()
  let userId: number | null = null

  if (session?.user?.id) {
    userId = Number(session.user.id)
  } else if (session?.user?.email) {
    const u = await db.query.users.findFirst({
      where: eq(users.username, session.user.email),
    })
    if (u) userId = u.id
  }

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const token = crypto.randomUUID()
  await db.update(users).set({ token }).where(eq(users.id, userId))

  revalidatePath("/me")
  return { token }
}

export async function markBlogAsRead(formData: FormData) {
  const idStr = formData.get("id") as string
  const id = Number(idStr)
  if (!id) return

  await db
    .update(readingList)
    .set({ read: true })
    .where(eq(readingList.id, id))

  revalidatePath("/me")
}
