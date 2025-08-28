"use client"

import { Button } from "@/components/ui/button"
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, ArrowDown } from "lucide-react"
import { UIMessage, UIDataTypes, UITools } from "ai"


interface ConversationViewProps {
  messageHistory: UIMessage<unknown, UIDataTypes, UITools>[]
}

export function ConversationView({ messageHistory }: ConversationViewProps) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {messageHistory.map((message) => (
          <div key={message.id} className={message.role === "user" ? "text-right" : ""}>
            {message.role === "assistant" ? (
              <div className="space-y-4">
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return <div key={`${message.id}-${i}`} className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-[#e5e5e5] leading-relaxed">{part.text}</div>
                      </div>;
                  }
                })}
                {/* Message Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="ghost" size="sm" className="text-[#8e8e8e] hover:text-white">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#8e8e8e] hover:text-white">
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#8e8e8e] hover:text-white">
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#8e8e8e] hover:text-white">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#8e8e8e] hover:text-white ml-auto">
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
              {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return <div key={`${message.id}-${i}`} className="inline-block bg-[#2f2f2f] rounded-2xl px-4 py-2 max-w-xs">
                        <p className="text-sm text-white">{part.text}</p>
                      </div>;
                  }
                })}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
