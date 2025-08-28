"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, Library, Sparkles, Bot, PenTool, LogIn } from "lucide-react"
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"

interface SidebarProps {
  chatHistory: { id: string; title: string }[];
  selectedChat: string | null;
  onChatClick: (chatId: string) => void;
  onNewChat: ({ text }: { text: string }) => void;
}

export function Sidebar({ chatHistory, selectedChat, onChatClick, onNewChat }: SidebarProps) {
  const { isSignedIn, user } = useUser()

  return (
    <div className="w-64 bg-[#171717] flex flex-col h-screen">
      <div className="flex-shrink-0">
        {/* Sidebar Header */}
        <div className="p-3">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-transparent border-[#404040] text-white hover:bg-[#2a2a2a]"
              onClick={(e) => {}}
            >
              <PenTool className="w-4 h-4" />
              New chat
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <div className="px-3 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-[#b4b4b4] hover:bg-[#2a2a2a] hover:text-white"
          >
            <Search className="w-4 h-4" />
            Search chats
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-[#b4b4b4] hover:bg-[#2a2a2a] hover:text-white"
          >
            <Library className="w-4 h-4" />
            Library
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-[#b4b4b4] hover:bg-[#2a2a2a] hover:text-white"
          >
            <Sparkles className="w-4 h-4" />
            Sora
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-[#b4b4b4] hover:bg-[#2a2a2a] hover:text-white"
          >
            <Bot className="w-4 h-4" />
            GPTs
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="px-3 mt-6 mb-2">
          <div className="text-xs text-[#8e8e8e] px-2">Chats</div>
        </div>
        <div className="flex-1 overflow-y-auto px-3">
          <div className="space-y-1 pb-4">
            {chatHistory.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className={`w-full justify-start text-left hover:bg-[#2a2a2a] hover:text-white h-auto py-2 px-2 ${
                  selectedChat === chat.id ? "bg-[#2a2a2a] text-white" : "text-[#b4b4b4]"
                }`}
                onClick={() => onChatClick(chat.id)}
              >
                <span className="truncate text-sm">{chat.title}</span>
              </Button>
            ))}

          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-3 border-t border-[#404040]">
        {isSignedIn ? (
          <div className="flex items-center gap-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-4 h-4",
                  userButtonPopoverCard: "bg-[#2a2a2a] border-[#404040]",
                  userButtonPopoverActionButton: "text-white hover:bg-[#404040]",
                },
              }}
            />
            <div className="flex-1">
              <div className="text-sm text-white truncate">{user.fullName || user.emailAddresses[0]?.emailAddress}</div>
              <div className="text-xs text-[#8e8e8e]">Free</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <SignInButton mode="modal">
              <Button
                variant="outline"
                className="w-full justify-center gap-2 bg-transparent border-[#404040] hover:bg-[#2a2a2a] hover:text-white"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="w-full justify-center gap-2 bg-[#10a37f] text-white hover:bg-[#0d8f6b]">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        )}
      </div>
    </div>
  )
}
