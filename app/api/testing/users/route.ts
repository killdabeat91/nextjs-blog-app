import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/db"
import { users } from "@/db/schema"

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 })
  }

  try {
    const { username, name, password } = await req.json()
    if (!username || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        name,
        passwordHash,
      })
      .returning()

    return NextResponse.json(newUser, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
