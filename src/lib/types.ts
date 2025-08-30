import { UIMessage } from "ai";
// Basic chat and message types
export type Role = "user" | "assistant" | "system"

export type Chat = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  // store UIMessage objects directly
  messages: UIMessage[];
};
