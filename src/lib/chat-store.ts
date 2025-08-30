// lib/chat-store.ts
"use client";

import { generateId } from "ai";
import type { UIMessage } from "ai";
import useSWR from "swr";

const CHATS_KEY = "cgpt:chats:v2";

export type Chat = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  // store UIMessage objects directly
  messages: UIMessage[];
};

type Store = {
  chats: Chat[];
};

function genId() {
  return generateId();
}

function readStore(): Store {
  if (typeof window === "undefined") return { chats: [] };
  try {
    const raw = localStorage.getItem(CHATS_KEY) || "[]";
    const chats = JSON.parse(raw) as Chat[];
    return { chats };
  } catch {
    return { chats: [] };
  }
}

function writeStore(store: Store) {
  localStorage.setItem(CHATS_KEY, JSON.stringify(store.chats));
}

/**
 * SWR helper - return shape expected by your current codebase
 * (you already call useSWR elsewhere; keep the same hook name)
 */
export function useChats() {
  return useSWR<Store>(CHATS_KEY, () => readStore(), { fallbackData: { chats: [] } });
}

/** Create a fresh chat, optionally with initial user message (UIMessage format) */
export function createChat(initialText?: string): { chat: Chat } {
  const store = readStore();
  const now = new Date().toISOString();

  const chat: Chat = {
    id: genId(),
    title: initialText?.trim() ? initialText.trim().slice(0, 40) : "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };

  store.chats.unshift(chat);
  writeStore(store);

  // Persist initial text to sessionStorage so the chat page can submit it after redirect.
  // Use sessionStorage rather than localStorage so it's ephemeral per tab.
  if (initialText?.trim()) {
    try {
      const key = `cgpt:init:${chat.id}`;
      sessionStorage.setItem(key, initialText.trim());
    } catch {
      // ignore (eg. storage disabled)
    }
  }

  return { chat };
}
/** Save (overwrite) a chat's messages — used by server onFinish or client */
export function saveChat({ chatId, messages }: { chatId: string; messages: UIMessage[] }) {
  const store = readStore();
  const chat = store.chats.find((c) => c.id === chatId);
  const now = new Date().toISOString();
  if (!chat) {
    // if chat doesn't exist, create it
    const title =
      messages?.find((m) => m.role === "user" && m.parts?.[0]?.type === "text")
        ? (messages.find((m) => m.role === "user")!.parts?.map((p) => (p.type === "text" ? p.text : "")).join("").slice(0, 40) ||
            "New chat")
        : "New chat";
    store.chats.unshift({
      id: chatId,
      title,
      createdAt: now,
      updatedAt: now,
      messages,
    });
  } else {
    chat.messages = messages;
    chat.updatedAt = now;
    // attempt to refresh title from first user message
    const firstUser = messages.find((m) => m.role === "user");
    if (firstUser) {
      const text = firstUser.parts?.map((p) => (p.type === "text" ? p.text : "")).join("").trim();
      if (text) chat.title = text.slice(0, 40);
    }
  }
  writeStore(store);
}

/** Return chat object or undefined */
export function getChat(chatId: string): Chat | undefined {
  return readStore().chats.find((c) => c.id === chatId);
}

/** Return messages for a chat (sorted by metadata.createdAt if present) */
export function getMessages(chatId: string): UIMessage[] {
  const chat = getChat(chatId);
  if (!chat) return [];
  // sort by metadata.createdAt when available; fall back to stored order
  return [...chat.messages].sort((a, b) => {
    const aTs = (a.metadata as any)?.createdAt;
    const bTs = (b.metadata as any)?.createdAt;
    if (aTs && bTs) return String(aTs).localeCompare(String(bTs));
    return 0;
  });
}

/** Utility to delete a chat (optional) */
export function deleteChat(chatId: string) {
  const store = readStore();
  store.chats = store.chats.filter((c) => c.id !== chatId);
  writeStore(store);
}


// Group chats into Today / Previous 7 Days / Previous 30 Days (approx)
export function groupChatsByTime(chats: Chat[]) {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  const today: Chat[] = []
  const last7: Chat[] = []
  const last30: Chat[] = []

  chats.forEach((c) => {
    const diff = Math.floor((now - new Date(c.updatedAt).getTime()) / day)
    if (diff <= 0) today.push(c)
    else if (diff <= 7) last7.push(c)
    else if (diff <= 30) last30.push(c)
  })

  return { today, last7, last30 }
}

