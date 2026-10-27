"use client"

import { useActionState } from "react"
import { createBlog, BlogState } from "@/app/actions/blogs"
import Link from "next/link"

const initialState: BlogState = {}

export default function NewBlogPage() {
  const [state, formAction, isPending] = useActionState(createBlog, initialState)

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Blog</h1>
        <Link href="/blogs" className="text-sm text-blue-600 hover:underline">
          Back to blogs
        </Link>
      </div>

      {state.errors?.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {state.errors.general}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={state.values?.title || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state.errors?.title && (
            <p className="mt-1 text-sm text-red-600">{state.errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            defaultValue={state.values?.author || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state.errors?.author && (
            <p className="mt-1 text-sm text-red-600">{state.errors.author}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            URL
          </label>
          <input
            id="url"
            name="url"
            type="text"
            defaultValue={state.values?.url || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state.errors?.url && (
            <p className="mt-1 text-sm text-red-600">{state.errors.url}</p>
          )}
        </div>

        <button
          type="submit"
          data-testid="create-blog-button"
          disabled={isPending}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  )
}
