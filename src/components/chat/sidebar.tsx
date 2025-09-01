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
import { OpenAILogo } from "../icons"

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
    <div>
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
          "flex h-full shrink-0 flex-col border-r border-zinc-800/60 bg-sidebar transition-[width,transform] duration-200 ease-linear",
          isDesktop
            ? (isSidebarOpen ? "w-64" : "w-14")
            : (isSidebarOpen ? "fixed inset-y-0 left-0 z-50 w-80" : "w-14")
        )}
      >
        {/* Top Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="py-3">
            <div className={cn("flex items-center justify-between px-3", !isSidebarOpen && "justify-center")}>
              <div className="flex justify-between w-full items-center">
                {isSidebarOpen && (
                  <button
                    className="p-2 hover:bg-secondary rounded-md hover:cursor-pointer"
                    type="button"
                    onClick={() => router.push("/chat")}
                  >
                    <OpenAILogo/>
                  </button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-zinc-300 text-zinc-200 hover:bg-secondary hover:cursor-pointer"
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                >
                  <PanelLeft className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {isSidebarOpen && <SidebarHeader />}
          </div>

          {/* Scrollable chat list */}
          {isSidebarOpen && (
            <div className="flex-1 space-y-6 px-3 overflow-y-auto">
              <SidebarSection title="Today" chats={grouped.today} />
              <SidebarSection title="Previous 7 Days" chats={grouped.last7} />
              <SidebarSection title="Previous 30 Days" chats={grouped.last30} />
            </div>
          )}
        </div>
        <br />

        {/* Footer always at bottom */}
        <div className={cn("px-2 pb-1 border-t border-zinc-800", !isSidebarOpen && "px-0")}>
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 p-3">
              {isSignedIn && isLoaded ? (
                <div className="flex gap-3">
                  <UserButton />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm text-white truncate">{user.fullName}</span>
                    <span className="text-xs text-zinc-400 truncate">Free</span>
                  </div>
                </div>
              ) : (
                <SignInButton mode="redirect">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-white w-full cursor-pointer text-white hover:bg-zinc-800/60"
                  >
                    <UsersRound className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {isSignedIn && isLoaded ? (
                <div className="pt-3">
                  <UserButton />
                </div>
                
              ) : (
                <SignInButton mode="redirect">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-secondary"
                    aria-label="Sign in"
                  >
                    <UsersRound className="h-5 w-5" />
                  </Button>
                </SignInButton>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
