import type React from "react"
// Shared layout for /chat and /chat/[chatId]

import { Sidebar } from "@/components/chat/sidebar"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] w-full bg-primary text-zinc-100">
      <div className="mx-auto flex h-full max-w-screen-2xl">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
