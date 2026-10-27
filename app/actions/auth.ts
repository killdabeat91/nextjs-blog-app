"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"
import { cookies } from "next/headers"

export type RegisterState = {
  errors?: {
    username?: string
    name?: string
    password?: string
    passwordConfirm?: string
    general?: string
  }
  values?: {
    username?: string
    name?: string
  }
}

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const username = (formData.get("username") as string)?.trim() || ""
  const name = (formData.get("name") as string)?.trim() || ""
  const password = (formData.get("password") as string) || ""
  const passwordConfirm = (formData.get("passwordConfirm") as string) || ""

  const errors: RegisterState["errors"] = {}

  if (!username || username.length < 4) {
    errors.username = "Username must be at least 4 characters"
  }

  if (!name) {
    errors.name = "Name is required"
  }

  if (!password || password.length < 4) {
    errors.password = "Password must be at least 4 characters"
  }

  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match"
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { username, name } }
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.username, username),
  })

  if (existing) {
    return {
      errors: { username: "Username already taken" },
      values: { username, name },
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await db.insert(users).values({
    username,
    name,
    passwordHash,
  })

  const cookieStore = await cookies()
  cookieStore.set(
    "notification",
    JSON.stringify({
      message: "Registration successful. Please log in.",
      type: "success",
    }),
    { path: "/" },
  )

  redirect("/login")
}
