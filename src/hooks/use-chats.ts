// hooks/useChats.ts
import { Chat } from "@/lib/types";
import useSWR from "swr";

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function useChats() {
  const { data, error, mutate } = useSWR<{ chats: Chat[] }>("/api/chats", fetcher);
  return { data: data?.chats ?? [], loading: !data && !error, error, mutate };
}
