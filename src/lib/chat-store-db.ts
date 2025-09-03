// /lib/chat-store-db.ts

import type { UIMessage } from "ai";
import { UIChat, APIResponse } from "./types";

export async function createChatDB(clerkUserId: string, initialText?: string, initialFiles?: any[]): Promise<string>  {
  if(!clerkUserId) {
    return "no Id given";
  }
  const res = await fetch("/api/chats/create", {
    method: "POST",
    body: JSON.stringify({ initialText }),
  });

  const data = await res.json();

  const chatId = data?.chatId;

  // Store pending message and/or files in sessionStorage
  if (chatId && (initialText || initialFiles?.length)) {
    const pending = {
      text: initialText?.trim() || "",
      files: initialFiles || [],
    };
    sessionStorage.setItem(`cgpt:init:${chatId}`, JSON.stringify(pending));
    console.log(JSON.stringify(pending))
  }

  return chatId;
}

export async function getAllChats(): Promise<UIChat[]> {
  const res = await fetch("/api/chats", {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chats");
  }

  const data: APIResponse = await res.json();

  const uiChats: UIChat[] = data.chats.map((chat) => {
    const messages: UIMessage[] = chat.messages.map((msg) => {
      const parts: UIMessage["parts"] = [];

      if (msg.files && Array.isArray(msg.files)) {
        for (const file of msg.files) {
          parts.push({
            type: "file",
            filename: file.filename,
            mediaType: file.mediaType,
            url: file.url,
          });
        }
      }

      if (msg.text) {
        parts.push({
          type: "text",
          text: msg.text,
        });
      }

      return {
        id: msg.id,
        role: msg.role,
        createdAt: new Date(msg.createdAt),
        parts,
      };
    });

    return {
      id: chat.id,
      title: chat.title,
      messages,
    };
  });

  return uiChats;
}