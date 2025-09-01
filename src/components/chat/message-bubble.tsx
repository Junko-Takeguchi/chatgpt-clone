import { cn } from "@/lib/utils";
import { UIMessage, FileUIPart, UIMessagePart } from "ai";
import { MemoizedMarkdown } from "@/components/memoized-markdown";

export function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("w-full", isUser ? "flex justify-end" : "flex justify-centre")}>
      <div
        className={cn(
          "w-fit rounded-2xl px-4 py-3 text-normal leading-6 flex flex-col gap-2",
          isUser ? "bg-secondary max-w-2xs md:max-w-md text-zinc-100" : "bg-primary text-zinc-200 w-full",
          "whitespace-pre-wrap break-words break-all overflow-hidden text-pretty"
        )}
      >
        {(message.parts ?? []).map((part, index) => {
          // Text parts
          if (part.type === "text") {
            return <MemoizedMarkdown key={index} id={message.id} content={part.text} />;
            // return <div key={index}>{part.text}</div>
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
