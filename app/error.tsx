"use client"

import { useEffect } from "react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const isDbError =
    error.message?.includes("fetch failed") ||
    error.message?.includes("NeonDbError") ||
    error.message?.includes("database")

  return (
    <div className="max-w-lg mx-auto my-12 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xl">
        !
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {isDbError ? "Lỗi kết nối Cơ sở dữ liệu" : "Đã có lỗi xảy ra"}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {isDbError
          ? "Không thể kết nối đến PostgreSQL/Neon. Vui lòng cấu hình biến DATABASE_URL thật trong file .env.local."
          : error.message || "Something went wrong"}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
      >
        Thử lại
      </button>
    </div>
  )
}
