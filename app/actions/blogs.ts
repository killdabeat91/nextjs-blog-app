"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { eq, and } from "drizzle-orm"
import { db } from "@/db"
import { blogs, readingList, users } from "@/db/schema"
import { auth } from "@/auth"

export type BlogState = {
  errors?: {
    title?: string
    author?: string
    url?: string
    general?: string
  }
  values?: {
    title?: string
    author?: string
    url?: string
  }
}

export async function createBlog(
  _prevState: BlogState,
  formData: FormData,
): Promise<BlogState> {
  const title = (formData.get("title") as string)?.trim() || ""
  const author = (formData.get("author") as string)?.trim() || ""
  const url = (formData.get("url") as string)?.trim() || ""

  const errors: BlogState["errors"] = {}

  if (!title || title.length < 5) {
    errors.title = "Title must be at least 5 characters"
  }
  if (!author || author.length < 5) {
    errors.author = "Author must be at least 5 characters"
  }
  if (!url || url.length < 5) {
    errors.url = "URL must be at least 5 characters"
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { title, author, url } }
  }

  const session = await auth()
  let userId: number | null = null

  if (session?.user?.id) {
    userId = Number(session.user.id)
  } else if (session?.user?.email) {
    const user = await db.query.users.findFirst({
      where: eq(users.username, session.user.email),
    })
    if (user) userId = user.id
  }

  if (!userId) {
    const firstUser = await db.query.users.findFirst()
    if (firstUser) userId = firstUser.id
  }

  if (!userId) {
    return {
      errors: { general: "User required to create blog" },
      values: { title, author, url },
    }
  }

  await db.insert(blogs).values({
    title,
    author,
    url,
    userId,
    likes: 0,
  })

  revalidatePath("/blogs")

  const cookieStore = await cookies()
  cookieStore.set(
    "notification",
    JSON.stringify({
      message: `A new blog '${title}' by ${author} added`,
      type: "success",
    }),
    { path: "/" },
  )

  redirect("/blogs")
}

export async function likeBlog(formData: FormData) {
  const idStr = formData.get("id") as string
  const id = Number(idStr)
  if (!id) return

  const blog = await db.query.blogs.findFirst({
    where: eq(blogs.id, id),
  })
  if (!blog) return

  await db
    .update(blogs)
    .set({ likes: blog.likes + 1 })
    .where(eq(blogs.id, id))

  revalidatePath("/blogs")
  revalidatePath(`/blogs/${id}`)
}

export async function addToReadingList(formData: FormData) {
  const blogIdStr = formData.get("blogId") as string
  const blogId = Number(blogIdStr)
  if (!blogId) return

  const session = await auth()
  let userId: number | null = null
  if (session?.user?.id) {
    userId = Number(session.user.id)
  } else if (session?.user?.email) {
    const user = await db.query.users.findFirst({
      where: eq(users.username, session.user.email),
    })
    if (user) userId = user.id
  }

  if (!userId) return

  const existing = await db.query.readingList.findFirst({
    where: and(eq(readingList.userId, userId), eq(readingList.blogId, blogId)),
  })

  if (!existing) {
    await db.insert(readingList).values({
      userId,
      blogId,
      read: false,
    })
  }

  revalidatePath(`/blogs/${blogId}`)
  revalidatePath("/me")
}
