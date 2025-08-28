"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, Share, MoreHorizontal, Sparkles } from "lucide-react"

interface ChatHeaderProps {
  currentView: "new-chat" | "conversation"
}

export function ChatHeader({ currentView }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#404040] bg-[#212121]">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-medium">ChatGPT</h1>
        <ChevronDown className="w-4 h-4 text-[#8e8e8e]" />
      </div>
      <div className="flex items-center gap-2">
        {currentView === "conversation" && (
          <Button variant="ghost" className="text-[#8e8e8e] hover:text-white">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
        <Button className="bg-[#6366f1] hover:bg-[#5855eb] text-white px-4 py-2 rounded-lg">
          <Sparkles className="w-4 h-4 mr-2" />
          Upgrade to Go
        </Button>
        {currentView === "conversation" && (
          <Button variant="ghost" className="text-[#8e8e8e] hover:text-white">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
