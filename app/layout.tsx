import type { Metadata } from "next"
import "./globals.css"
import Providers from "@/app/components/Providers"
import NavBar from "@/app/components/NavBar"
import Notification from "@/app/components/Notification"

export const metadata: Metadata = {
  title: "Full Stack Open Blog App",
  description: "Next.js Blog Application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Providers>
          <Notification />
          <NavBar />
          <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
