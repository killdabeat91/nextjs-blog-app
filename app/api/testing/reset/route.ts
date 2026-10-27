import { NextResponse } from "next/server"
import { db } from "@/db"
import { readingList, blogs, users } from "@/db/schema"

export async function DELETE() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 })
  }

  try {
    await db.delete(readingList)
    await db.delete(blogs)
    await db.delete(users)
    return new NextResponse(null, { status: 204 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
