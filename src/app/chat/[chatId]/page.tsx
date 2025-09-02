// app/chat/[chatId]/page.tsx
"use client";

import { useEffect, useRef, useMemo } from "react";
import { ContentHeader } from "@/components/chat/content-header";
import { ChatInput } from "@/components/chat/chat-input";
import { useChats, getChat, getMessages, saveChat } from "@/lib/chat-store";
import { MessageBubble } from "@/components/chat/message-bubble";
import { useParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useUser } from "@clerk/nextjs"; 

export default function ChatPage() {
  const params = useParams() as { chatId?: string };
  const chatId = params?.chatId;
  const { user } = useUser();
  const clerkUserId = user?.id;

  const { mutate } = useChats(clerkUserId); // per-user
  const chat = useMemo(() => (chatId ? getChat(chatId, clerkUserId) : undefined), [chatId, clerkUserId]);
  const initialMessages = useMemo(() => (chatId ? getMessages(chatId, clerkUserId) : []), [chatId, clerkUserId]);

  const endRef = useRef<HTMLDivElement | null>(null);

  // Setup useChat with the stored messages and persistence hooks
  const { messages, sendMessage, status } = useChat({
    id: chatId,
    // hydrate with stored messages (UIMessage[])
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: ({ messages }) => {
      if (!chatId) return;
      // persist for the current user
      saveChat({ chatId, messages, clerkUserId });
      // refresh sidebar list (per-user)
      mutate?.();
    },
  });

  // persist on every messages change so partial updates are saved locally
  useEffect(() => {
    if (!chatId) return;

    const key = `cgpt:init:${chatId}`;
    const raw = sessionStorage.getItem(key);
    if (!raw) return;

    let pending: { text: string; files?: any[] } | null = null;
    try {
      pending = JSON.parse(raw);
    } catch {
      // fallback: legacy text-only
      pending = { text: raw };
    }

    if (!pending) return;

    const already = messages.some((m) =>
      m.role === "user" &&
      Array.isArray(m.parts) &&
      m.parts.some(
        (p) => p.type === "text" && p.text === pending?.text
      )
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
  }, [chatId, sendMessage]);


  // auto-scroll when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!chat) {
    return (
      <div className="flex h-full flex-col">
        <ContentHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-zinc-400">Chat not found.</div>
        </main>
      </div>
    );
  }

  const handleSend = (text: string, files?: any[]) => {
    sendMessage({
      text,
      files,
    });
  };

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

              // Step 1: Filter out the old message
              const filteredMessages = messages.filter((msg) => msg.id !== m.id);

              // Step 2: Save locally (optional, depending on your UX)
              saveChat({ chatId, messages: filteredMessages, clerkUserId });

              // Step 3: Re-send the edited message
              sendMessage({ text });
            }}
            />

          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="">
        <div className="">
          <div className="mx-auto w-full max-w-2xl">
            <ChatInput onSubmit={handleSend} />
          </div>
        </div>

      </div>
      <footer className="text-center text-xs text-white px-4 pb-3 pt-2">
        ChatGPT can make mistakes. Check important info. See{" "}
        <a href="#" className="underline hover:text-white">
          Cookie Preferences
        </a>.
      </footer>
    </div>
  );

}
