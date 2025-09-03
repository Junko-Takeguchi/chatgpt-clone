import useSWR from "swr";
import type { UIMessage } from "ai";
import { getAllChats } from "@/lib/chat-store-db";

export type UIChat = {
  id: string;
  title: string;
  messages: UIMessage[];
};

type UseChatsResponse = {
  chats: UIChat[];
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
};

export function useChats(): UseChatsResponse {
  const { data, error, mutate } = useSWR<UIChat[]>("db:chats", getAllChats, {
    fallbackData: [],
  });

  return {
    chats: data ?? [],
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
}
