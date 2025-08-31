import { cn } from "@/lib/utils";
import { UIMessage, FileUIPart, UIMessagePart } from "ai";
import { MemoizedMarkdown } from "@/components/memoized-markdown";

export function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <div className={cn("w-full", isUser ? "flex justify-end" : "flex justify-start")}>
      <div
        className={cn(
          "w-fit max-w-2xs md:max-w-[720px] rounded-2xl px-4 py-3 text-sm leading-6 flex flex-col gap-2",
          isUser ? "bg-secondary text-zinc-100" : "bg-zinc-800 text-zinc-200",
          "whitespace-pre-wrap break-words break-all overflow-hidden text-pretty"
        )}
      >
        {(message.parts ?? []).map((part, index) => {
          // Text parts
          if (part.type === "text") {
            return <MemoizedMarkdown key={index} id={message.id} content={part.text} />;
          }

          // File parts (images)
          if (part.type === "file") {
            const filePart = part as FileUIPart; // type assertion
            if (filePart.mediaType?.startsWith("image/")) {
              return (
                <img
                  key={index}
                  src={filePart.url}
                  alt={filePart.filename || "image"}
                  className="rounded-lg max-w-full"
                />
              );
            }
          }

          return null; // ignore other types
        })}
      </div>
    </div>
  );
}
