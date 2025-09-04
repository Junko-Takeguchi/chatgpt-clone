import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createMem0, retrieveMemories, addMemories } from "@mem0/vercel-ai-provider";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const mem0 = createMem0({
  provider: "google",
  mem0ApiKey: process.env.MEM0_API_KEY!,
  apiKey: process.env.GOOGLE_API_KEY!, // Optional, can also be env based in sdk
});

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } = await req.json();
  const { userId } = await auth();

  if(!userId) return NextResponse.json({message: "forbidden"}, {status: 403})

  const userMessage = messages[messages.length - 1];

  let text: string | undefined = undefined;
  const files: {
    type: string;
    filename?: string;
    mediaType: string;
    url: string;
  }[] = [];

  for (const part of userMessage.parts) {
    if (part.type === "text") {
      text = part.text;
    } else if (part.type === "file") {
      files.push({
        type: part.type,
        filename: part.filename,
        mediaType: part.mediaType,
        url: part.url,
      });
    }
  }

  // Save user message to DB
  void prisma.message.create({
    data: {
      chatId,
      role: "user",
      text,
      files: files.length > 0 ? files : undefined,
    },
  }).catch((e: any) => {
    console.error("Failed to save user message to DB:", e);
  });

  // ---  Add user message to memory ---
  if (userId && text) {
    void addMemories(
      [{ role: "user", content: [{ type: "text", text }] }],
      {
        user_id: userId,
        mem0ApiKey: process.env.MEM0_API_KEY,
      }
    ).catch((err) => {
      console.error(" Failed to add memory:", err);
    });
  }

  const result = streamText({
        model: google("gemini-2.5-flash"),
        system: "Return the answer in markdown",
        messages: convertToModelMessages(messages),
        onFinish({ text: generatedText }) {
          void prisma.message
            .create({
              data: {
                chatId,
                role: "assistant",
                text: generatedText,
              },
            })
            .catch((err : any) => {
              console.error("Failed to save assistant message to DB:", err);
            });
        },
      })

  return result.toUIMessageStreamResponse();
}
