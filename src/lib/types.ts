import { UIMessage } from "ai";
// Basic chat and message types
export type APIResponse = {
  message: string;
  chats: ChatFromAPI[];
};

export type ChatFromAPI = {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages: MessageFromAPI[];
};

export type MessageFromAPI = {
  id: string;
  chatId: string;
  role: "user" | "assistant" | "system";
  text?: string | null;
  files?: Array<{
    filename: string;
    mediaType: string;
    url: string;
  }> | null;
  createdAt: string;
};

export type UIChat = {
  id: string;
  title: string;
  messages: UIMessage[];
};
