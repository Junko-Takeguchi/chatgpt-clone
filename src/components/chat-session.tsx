"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { ConversationView } from "./conversation-view";
import { ChatInput } from "./chat-input";
import type { UIMessage } from "ai";

interface ChatSessionProps {
  chatId: string;
  initialMessages: UIMessage[];
  onMessagesChange: (messages: UIMessage[]) => void;
}

export default function ChatSession({ chatId, initialMessages, onMessagesChange }: ChatSessionProps) {
  const initialRef = useRef(initialMessages);

  const { messages, sendMessage } = useChat({
    id: chatId,
    messages: initialRef.current, // pass initial messages only once
  });

  // track last synced message id to prevent infinite loop
  const lastSyncedIdRef = useRef(
    initialRef.current.length ? initialRef.current[initialRef.current.length - 1].id : null
  );

  useEffect(() => {
    const lastId = messages.length ? messages[messages.length - 1].id : null;
    if (lastId === lastSyncedIdRef.current) return; // no new messages
    lastSyncedIdRef.current = lastId;
    onMessagesChange(messages);
  }, [messages, onMessagesChange]);

  const handleSendMessage = async (msg: { text: string }) => {
    if (!msg.text.trim()) return;
    await sendMessage({ text: msg.text });
  };

  return (
    <>
      <ConversationView messageHistory={messages} />
      <ChatInput handleSendMessage={handleSendMessage} isConversation />
    </>
  );
}
