"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Ellipsis } from "lucide-react"
import { UIChat } from "@/hooks/use-chats"

export function SidebarItem({ chat }: { chat: UIChat }) {
  const pathname = usePathname()
  const active = pathname?.endsWith(chat.id)

  return (
    <Link
      href={`/chat/${chat.id}`}
      className={cn(
        "group flex items-center hover:bg-primary justify-between rounded-xl px-3 py-2 text-sm",
        active ? "bg-secondary text-white" : "text-text-whitehover:bg-secondary",
      )}
    >
      <span className="truncate font-normal">{chat.title}</span>
      <Ellipsis className="h-4 w-4 text-text-white opacity-0 group-hover:opacity-100" />
    </Link>
  )
}
