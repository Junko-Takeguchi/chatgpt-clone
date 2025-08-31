"use client";

import { useEffect, useRef, useMemo } from "react";
import { ContentHeader } from "@/components/chat/content-header";
import { ChatInput } from "@/components/chat/chat-input";
import { useChats, getChat, getMessages, saveChat } from "@/lib/chat-store";
import { MessageBubble } from "@/components/chat/message-bubble";
import { useParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, FileUIPart } from "ai";

export default function ChatPage() {
  const params = useParams() as { chatId?: string };
  const chatId = params?.chatId;
  const { data, mutate } = useChats();
  const chat = useMemo(() => (chatId ? getChat(chatId) : undefined), [chatId, data]);
  const initialMessages = useMemo(() => (chatId ? getMessages(chatId) : []), [chatId, data]);

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
      saveChat({ chatId, messages });
      // refresh sidebar list
      mutate?.();
    },
  });

  // persist on every messages change so partial updates are saved locally
  // inside ChatPage component, after you have `messages` and `sendMessage`
  useEffect(() => {
    if (!chatId) return;

    const key = `cgpt:init:${chatId}`;
    const pending = sessionStorage.getItem(key);
    if (!pending) return;

    // If there's already a user message with the same text, don't resend.
    const already = messages.some((m) =>
      m.role === "user" &&
      Array.isArray(m.parts) &&
      m.parts.some((p) => p.type === "text" && p.text === pending)
    );

    if (already) {
      // clean up the session key if present
      sessionStorage.removeItem(key);
      return;
    }

    // send the message (this will create the user message client-side and start streaming)
    try {
      sendMessage({ text: pending });
    } catch (err) {
      // ignore/send to telemetry as needed
      console.error("Failed to auto-send initial message:", err);
    } finally {
      sessionStorage.removeItem(key);
    }
    // only run when sendMessage or chatId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSend = (text: string, files?: FileUIPart[]) => {
    sendMessage({
      text,
      files, // this is an array of FileUIPart objects
    });
  };


  return (
    <div className="flex h-full flex-col">
      <ContentHeader />
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={endRef} />
      </div>
      <ChatInput onSubmit={handleSend} />
    </div>
  );
}
