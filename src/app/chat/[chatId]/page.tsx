// app/chat/[chatId]/page.tsx
"use client";

import { useEffect, useRef, useMemo } from "react";
import { redirect, useParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useChats } from "@/hooks/use-chats";
import { ContentHeader } from "@/components/chat/content-header";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageBubble } from "@/components/chat/message-bubble";

export default function ChatPage() {
  const params = useParams() as { chatId?: string };
  const chatId = params?.chatId;
  const { chats, mutate } = useChats();
  const chat = useMemo(() => chats.find((c) => c.id === chatId), [chats, chatId]);
  const initialMessages = useMemo(() => chat?.messages ?? [], [chat]);

  const endRef = useRef<HTMLDivElement | null>(null);

  const { messages, sendMessage } = useChat({
    id: chatId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId },
    }),
    onFinish: ({ messages }) => {
      if (!chatId) return;
      mutate?.(); // refresh updated chat
    },
  });

  // Auto-send initial message if present in sessionStorage
  useEffect(() => {
    if (!chatId) return;

    const key = `cgpt:init:${chatId}`;
    const raw = sessionStorage.getItem(key);
    if (!raw) return;

    let pending: { text: string; files?: any[] } | null = null;
    try {
      pending = JSON.parse(raw);
    } catch {
      pending = { text: raw };
    }

    if (!pending?.text && !pending?.files?.length) {
      sessionStorage.removeItem(key);
      return;
    }

    const already = messages.some(
      (m) =>
        m.role === "user" &&
        Array.isArray(m.parts) &&
        m.parts.some((p) => p.type === "text" && p.text === pending?.text)
    );

    if (already) {
      sessionStorage.removeItem(key);
      return;
    }

    try {
      sendMessage({
        text: pending.text,
        files: pending.files,
      });
    } catch (err) {
      console.error("Failed to auto-send initial message:", err);
    } finally {
      sessionStorage.removeItem(key);
    }
  }, [chatId, sendMessage, messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = (text: string, files?: any[]) => {
    sendMessage({ text, files });
  };

  // if (!chat && !isLoading) {
  //   return (
  //     <div className="flex h-full flex-col">
  //       <ContentHeader />
  //       <main className="flex-1 flex items-center justify-center">
  //         <div className="text-zinc-400">Chat not found.</div>
  //       </main>
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-full flex-col">
      <ContentHeader />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              onEdit={(text) => {
                if (!chatId) return;

                const filteredMessages = messages.filter((msg) => msg.id !== m.id);
                // Optionally: implement backend PATCH for edited message
                sendMessage({ text });
              }}
            />
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <ChatInput onSubmit={handleSend} />
      </div>

      <footer className="text-center text-xs text-white px-4 pb-3 pt-2">
        ChatGPT can make mistakes. Check important info. See{" "}
        <a href="#" className="underline hover:text-white">
          Cookie Preferences
        </a>
        .
      </footer>
    </div>
  );
}
