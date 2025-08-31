"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useRouter } from "next/navigation"
import { useChats, groupChatsByTime, createChat } from "@/lib/chat-store"
import { Button } from "@/components/ui/button"
import { PanelLeft, Plus, UsersRound } from "lucide-react"
import { SidebarSection } from "./sidebar-section"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { SidebarHeader } from "./sidebar-header"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs"

export function Sidebar() {
  const { user, isLoaded, isSignedIn } = useUser();
  // pass user?.id so useChats returns the per-user chat list
  const { data } = useChats(user?.id);
  const chats = data?.chats ?? [];
  const router = useRouter()
  const grouped = groupChatsByTime(chats)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)") // lg breakpoint
    const apply = (matches: boolean) => {
      setIsDesktop(matches)
      setIsSidebarOpen(matches)
    }
    apply(mq.matches)

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in e ? e.matches : (e as MediaQueryList).matches
      apply(matches)
    }

    if ("addEventListener" in mq) {
      mq.addEventListener("change", handler as (e: Event) => void)
      return () => mq.removeEventListener("change", handler as (e: Event) => void)
    } else {
      // @ts-expect-error
      mq.addListener(handler)
      // @ts-expect-error
      return () => mq.removeListener(handler)
    }
  }, [])

  const toggleSidebar = () => setIsSidebarOpen((v) => !v)

  return (
    <>
      {/* Backdrop shown only on mobile when sidebar is open */}
      {!isDesktop && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        aria-expanded={isSidebarOpen}
        className={cn(
          // base
          "flex h-full shrink-0 flex-col justify-between border-r border-zinc-800/60 bg-sidebar transition-[width,transform] duration-200 ease-linear",
          // desktop behavior: width toggles between w-80 and w-14 (static/layout flow)
          isDesktop
            ? (isSidebarOpen ? "w-80" : "w-14")
            : // mobile behavior: when open -> fixed overlay; when closed -> small width inline
              (isSidebarOpen ? "fixed inset-y-0 left-0 z-50 w-80" : "w-14")
        )}
      >
        <div className="space-y-4 py-3">
          <div className={cn("flex items-center justify-between px-3", !isSidebarOpen && "justify-center")}>
            <div className="flex justify-between w-full items-center">
              {isSidebarOpen && (
                <Button
                  onClick={() => router.push("/chat")}
                  variant="secondary"
                  className="h-8 rounded-full bg-zinc-800/80 text-zinc-100 hover:bg-zinc-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> New chat
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-zinc-300 text-zinc-200 hover:bg-zinc-800/60"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {isSidebarOpen && <SidebarHeader />}

          {isSidebarOpen && (
            <div className="space-y-6 px-3 overflow-y-auto">
              <SidebarSection title="Today" chats={grouped.today} />
              <SidebarSection title="Previous 7 Days" chats={grouped.last7} />
              <SidebarSection title="Previous 30 Days" chats={grouped.last30} />
            </div>
          )}
        </div>

        <div className={cn("px-3 pb-3", !isSidebarOpen && "px-0")}>
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 p-3 border-t border-zinc-800">
              {isSignedIn && isLoaded && (
                <div className="flex gap-2">
                  <UserButton />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-zinc-200 truncate">{user.fullName}</span>
                    <span className="text-xs text-zinc-400 truncate">Free</span>
                  </div>
                </div>
              )}
              {!isSignedIn && (
                <div className="w-full flex">
                  <SignInButton mode="redirect">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-zinc-300 w-full text-zinc-200 hover:bg-zinc-800/60"
                      aria-label="Invite members"
                      title="Invite members"
                    >
                      <UsersRound className="h-5 w-5" />
                      <span>Sign In</span>
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-zinc-300 text-zinc-200 hover:bg-zinc-800/60"
                aria-label="Invite members"
                title="Invite members"
              >
                <UsersRound className="h-5 w-5" />
              </Button>
            </div>
          )}
          <div className="sr-only">
            <Image src="/images/nav.png" alt="Reference sidebar design" width={384} height={932} />
          </div>
        </div>
      </aside>
    </>
  )
}
