import { SidebarItem } from "./sidebar-item"
import type { Chat } from "@/lib/types"

export function SidebarSection({ title, chats }: { title: string; chats: Chat[] }) {
  if (!chats?.length) return null
  return (
    <div className="space-y-2">
      <br />
      <div className="px-3 text-xs uppercase font-semibold tracking-wide text-white">{title}</div>
      <div className="space-y-2">
        {chats.map((c) => (
          <SidebarItem key={c.id} chat={c} />
        ))}
      </div>
    </div>
  )
}
