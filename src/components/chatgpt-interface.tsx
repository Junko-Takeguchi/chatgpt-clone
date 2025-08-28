"use client";

import { useCallback, useState } from "react";
import { Sidebar } from "./sidebar";
import { ChatHeader } from "./chat-header";
import { NewChatView } from "./new-chat-view";
import ChatSession from "./chat-session";
import { generateId } from "ai";
import type { UIMessage } from "ai";

export function ChatGPTInterface() {
  const [chatIds, setChatIds] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<Record<string, UIMessage[]>>({});
  const [currentView, setCurrentView] = useState<"new-chat" | "conversation">("new-chat");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const handleNewChat = ({ text }: { text: string }) => {
    if (!text.trim()) return;

    // 1️⃣ Generate a new chat ID
    const chatId = generateId();

    // 2️⃣ Create the initial user message
    const initialMessage: UIMessage = {
      id: generateId(),
      role: "user",
      parts: [{ type: "text", text }]
    };

    // 3️⃣ Add new chat ID and initialize messages with the first message
    setChatIds(prev => [...prev, chatId]);
    setChatMessages(prev => ({
      ...prev,
      [chatId]: [initialMessage],
    }));

    // 4️⃣ Select the new chat and switch to conversation view
    setSelectedChat(chatId);
    setCurrentView("conversation");
  };


  const handleChatClick = (chatId: string) => {
    setSelectedChat(chatId);
    setCurrentView("conversation");
  };

  // Callback to update messages for a chat
  const handleUpdateMessages = useCallback((chatId: string, messages: UIMessage[]) => {
    setChatMessages(prev => ({ ...prev, [chatId]: messages }));
  }, []);

  return (
    <div className="flex h-screen bg-[#212121] text-white overflow-hidden">
      <Sidebar
        chatHistory={chatIds.map((id, i) => ({ id, title: `Chat ${i + 1}` }))}
        selectedChat={selectedChat}
        onChatClick={handleChatClick}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChatHeader currentView={currentView} />

        {currentView === "new-chat" ? (
          <NewChatView handleSendMessage={handleNewChat} />
        ) : (
          selectedChat && (
            <ChatSession
              key={selectedChat}
              chatId={selectedChat}
              initialMessages={chatMessages[selectedChat] || []}
              onMessagesChange={(messages) => handleUpdateMessages(selectedChat, messages)}
            />
          )
        )}

        <div className="flex-shrink-0 p-4 text-center bg-[#212121]">
          <p className="text-xs text-[#8e8e8e]">
            ChatGPT can make mistakes. Check important info.{" "}
            <button className="underline hover:text-white">See Cookie Preferences</button>
          </p>
        </div>
      </div>
    </div>
  );
}
