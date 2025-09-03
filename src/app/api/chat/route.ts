import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } = await req.json();

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

  // Save user message (non-blocking, with error logging)
  void prisma.message
    .create({
      data: {
        chatId,
        role: "user",
        text,
        files: files.length > 0 ? files : undefined,
      },
    })
    .catch((err) => {
      console.error("Failed to save user message to DB:", err);
    });

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: "Return the answer in markdown",
    messages: convertToModelMessages(messages),

    // Save assistant message (non-blocking, with error logging)
    onFinish({ text: generatedText }) {
      void prisma.message
        .create({
          data: {
            chatId,
            role: "assistant",
            text: generatedText,
          },
        })
        .catch((err) => {
          console.error("Failed to save assistant message to DB:", err);
        });
    },
  });

  return result.toUIMessageStreamResponse();
}
