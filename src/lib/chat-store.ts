// lib/chat-store.ts
"use client";

import { generateId } from "ai";
import type { UIMessage } from "ai";
import useSWR from "swr";

const CHATS_KEY = "cgpt:chats:v2";

/** Store types */
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

/** compute storage key; when clerkUserId supplied, store per-user */
function storageKey(clerkUserId?: string) {
  return clerkUserId ? `${CHATS_KEY}:${clerkUserId}` : CHATS_KEY;
}

/**
 * readStore: reads the store for a given clerkUserId (or the legacy global key if undefined)
 * Also: if clerkUserId provided and legacy global key exists, perform a one-time migration.
 */
function readStore(clerkUserId?: string): Store {
  if (typeof window === "undefined") return { chats: [] };

  try {
    const key = storageKey(clerkUserId);

    // if per-user key is missing but legacy global exists and clerkUserId present -> migrate
    if (clerkUserId) {
      const rawUser = localStorage.getItem(key);
      const rawLegacy = localStorage.getItem(CHATS_KEY);

      // If user key exists, use it
      if (rawUser) {
        const chats = JSON.parse(rawUser) as Chat[];
        return { chats };
      }

      // If legacy exists and user key empty, migrate legacy -> user key
      if (rawLegacy) {
        try {
          const legacyChats = JSON.parse(rawLegacy) as Chat[];
          // Write to user key
          localStorage.setItem(key, JSON.stringify(legacyChats));
          // Optionally remove legacy key or leave it. We'll keep it for safety.
          return { chats: legacyChats };
        } catch {
          // If parsing failed, fall through to empty
        }
      }

      // No user-specific or legacy, return empty
      return { chats: [] };
    } else {
      // No clerkUserId: read legacy/global key
      const raw = localStorage.getItem(CHATS_KEY) || "[]";
      const chats = JSON.parse(raw) as Chat[];
      return { chats };
    }
  } catch {
    return { chats: [] };
  }
}

function writeStore(chats: Chat[], clerkUserId?: string) {
  const key = storageKey(clerkUserId);
  localStorage.setItem(key, JSON.stringify(chats));
}

/**
 * SWR helper - keyed by clerkUserId so components will revalidate per user
 * Usage: const { data } = useChats(clerkUserId);
 */
export function useChats(clerkUserId?: string) {
  const key = storageKey(clerkUserId);
  return useSWR<Store>(key, () => readStore(clerkUserId), { fallbackData: { chats: [] } });
}

/** Create a fresh chat for a given user (or legacy global if clerkUserId undefined) */
export function createChat(initialText?: string, clerkUserId?: string): { chat: Chat } {
  const store = readStore(clerkUserId);
  const now = new Date().toISOString();

  const chat: Chat = {
    id: genId(),
    title: initialText?.trim() ? initialText.trim().slice(0, 40) : "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };

  store.chats.unshift(chat);
  writeStore(store.chats, clerkUserId);

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
export function saveChat({
  chatId,
  messages,
  clerkUserId,
}: {
  chatId: string;
  messages: UIMessage[];
  clerkUserId?: string;
}) {
  const store = readStore(clerkUserId);
  const chat = store.chats.find((c) => c.id === chatId);
  const now = new Date().toISOString();

  if (!chat) {
    // if chat doesn't exist, create it
    const title =
      messages?.find((m) => m.role === "user" && m.parts?.[0]?.type === "text")
        ? (messages.find((m) => m.role === "user")!.parts
            ?.map((p) => (p.type === "text" ? p.text : ""))
            .join("")
            .slice(0, 40) || "New chat")
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

  writeStore(store.chats, clerkUserId);
}

/** Return chat object or undefined (for a given user) */
export function getChat(chatId: string, clerkUserId?: string): Chat | undefined {
  return readStore(clerkUserId).chats.find((c) => c.id === chatId);
}

/** Return messages for a chat (sorted by metadata.createdAt when present) */
export function getMessages(chatId: string, clerkUserId?: string): UIMessage[] {
  const chat = getChat(chatId, clerkUserId);
  if (!chat) return [];
  return [...chat.messages].sort((a, b) => {
    const aTs = (a.metadata as any)?.createdAt;
    const bTs = (b.metadata as any)?.createdAt;
    if (aTs && bTs) return String(aTs).localeCompare(String(bTs));
    return 0;
  });
}

/** Utility to delete a chat (optional) */
export function deleteChat(chatId: string, clerkUserId?: string) {
  const store = readStore(clerkUserId);
  store.chats = store.chats.filter((c) => c.id !== chatId);
  writeStore(store.chats, clerkUserId);
}

/** Group chats into Today / Previous 7 Days / Previous 30 Days (approx) */
export function groupChatsByTime(chats: Chat[]) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const today: Chat[] = [];
  const last7: Chat[] = [];
  const last30: Chat[] = [];

  chats.forEach((c) => {
    const diff = Math.floor((now - new Date(c.updatedAt).getTime()) / day);
    if (diff <= 0) today.push(c);
    else if (diff <= 7) last7.push(c);
    else if (diff <= 30) last30.push(c);
  });

  return { today, last7, last30 };
}
