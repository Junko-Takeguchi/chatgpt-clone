"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Chat } from "@/lib/types"
import { Ellipsis } from "lucide-react"

export function SidebarItem({ chat }: { chat: Chat }) {
  const pathname = usePathname()
  const active = pathname?.endsWith(chat.id)

  return (
    <Link
      href={`/chat/${chat.id}`}
      className={cn(
        "group flex items-center justify-between rounded-xl px-3 py-2 text-sm",
        active ? "bg-secondary text-zinc-100" : "text-zinc-300 hover:bg-secondary",
      )}
    >
      <span className="truncate">{chat.title}</span>
      <Ellipsis className="h-4 w-4 text-zinc-400 opacity-0 group-hover:opacity-100" />
    </Link>
  )
}
