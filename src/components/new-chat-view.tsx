"use client"

import { ChatInput } from "./chat-input"

interface NewChatViewProps {
  handleSendMessage: (msg: {
    text: string;
}) => void
}

export function NewChatView({ handleSendMessage }: NewChatViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-3xl font-medium mb-8 text-balance">What are you working on?</h2>
        <ChatInput handleSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
