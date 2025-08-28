"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Mic, BarChart3, ArrowBigRightDashIcon } from "lucide-react"
import { useState } from "react"
import { UIMessage, UIDataTypes, UITools, FileUIPart, ChatRequestOptions } from "ai"

interface ChatInputProps {
  handleSendMessage: (msg: {
      text: string;
  }) => void
  isConversation?: boolean
}

export function ChatInput({ handleSendMessage, isConversation = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const containerClass = isConversation ? "p-4 border-t border-[#404040] bg-[#212121]" : "";
  const wrapperClass = isConversation ? "max-w-3xl mx-auto" : "max-w-2xl w-full";

  const handleClick = async () => {
    if (!input.trim()) return;
    await handleSendMessage({ text: input });
    setInput("");
  };

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        <div className="flex items-center bg-[#2f2f2f] rounded-3xl border border-[#404040] p-4">
          <Button variant="ghost" size="sm" className="text-[#8e8e8e] hover:text-white mr-2">
            <Plus className="w-5 h-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything"
            className="flex-1 bg-transparent border-none text-white placeholder:text-[#8e8e8e] focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                await handleClick();
              }
            }}
          />
          <div className="flex items-center gap-2 ml-2">
            <Button variant="ghost" size="sm" className="text-[#8e8e8e] hover:text-white">
              <Mic className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#8e8e8e] hover:text-white"
              onClick={handleClick}
            >
              <ArrowBigRightDashIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
