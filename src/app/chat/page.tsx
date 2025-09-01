// app/chat/page.tsx (ChatHomePage)
"use client";

import { ContentHeader } from "@/components/chat/content-header";
import { ChatInput } from "@/components/chat/chat-input";
import { createChat } from "@/lib/chat-store";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // <-- import

export default function ChatHomePage() {
  const router = useRouter();
  const { user } = useUser();

  const startChat = (text: string, files?: any[]) => {
    const { chat } = createChat(text, user?.id, files);
    router.push(`/chat/${chat.id}`);
  };

  return (
    <div className="flex h-full flex-col">
      <ContentHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <h1 className="mb-6 text-center text-2xl font-semibold text-zinc-200 sm:text-3xl">
          {"What's on the agenda today?"}
        </h1>
        <div className="w-fit max-w-3xl">
          <ChatInput placeholder="Ask anything" onSubmit={startChat} />
        </div>
      </main>
      <footer className="text-center text-xs text-white px-4 pb-3 pt-2 border-t border-zinc-800">
        ChatGPT can make mistakes. Check important info. See{" "}
        <a href="#" className="underline hover:text-white">
          Cookie Preferences
        </a>.
      </footer>
    </div>
  );
}
