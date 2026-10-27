"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { usePathname } from "next/navigation"

type NotificationType = "success" | "error"

interface NotificationItem {
  message: string
  type: NotificationType
}

interface NotificationContextValue {
  notification: NotificationItem | null
  showNotification: (message: string, type?: NotificationType) => void
  clearNotification: () => void
}

const NotificationContext = createContext<NotificationContextValue>({
  notification: null,
  showNotification: () => {},
  clearNotification: () => {},
})

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notification, setNotification] = useState<NotificationItem | null>(null)
  const pathname = usePathname()

  const clearNotification = useCallback(() => {
    setNotification(null)
  }, [])

  const showNotification = useCallback(
    (message: string, type: NotificationType = "success") => {
      setNotification({ message, type })
    },
    [],
  )

  useEffect(() => {
    if (typeof document === "undefined") return
    const match = document.cookie.match(/(^|;)\s*notification=([^;]+)/)
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[2]))
        if (data?.message) {
          setNotification({
            message: data.message,
            type: data.type || "success",
          })
          document.cookie = "notification=; Max-Age=0; path=/;"
        }
      } catch {
        // ignore
      }
    }
  }, [pathname])

  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => {
      setNotification(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [notification])

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}
