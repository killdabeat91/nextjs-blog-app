"use client"

import { useNotification } from "@/app/context/NotificationContext"

export default function Notification() {
  const { notification, clearNotification } = useNotification()

  if (!notification) return null

  const bgClass =
    notification.type === "success" ? "bg-green-600" : "bg-red-600"

  return (
    <div
      data-testid="notification"
      className={`fixed top-4 right-4 z-50 p-3 rounded text-white shadow-md flex items-center justify-between min-w-[280px] max-w-md ${bgClass}`}
    >
      <span>{notification.message}</span>
      <button
        type="button"
        onClick={clearNotification}
        className="ml-3 text-white/80 hover:text-white font-bold"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  )
}
