"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white border border-gray-200 rounded-lg text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {error.message || "Failed to load page. Check database connection."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
      >
        Try again
      </button>
    </div>
  )
}
