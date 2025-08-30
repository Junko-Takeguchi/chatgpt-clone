import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { MemoizedMarkdown } from "@/components/memoized-markdown";

export function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  // Safely get text parts
  const text = (message.parts ?? [])
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  return (
    <div className={cn("w-full", isUser ? "flex justify-end" : "flex justify-start")}>
      {isUser ? (
        <div
          className={cn(
            "w-fit max-w-[680px] md:max-w-[720px] rounded-2xl px-4 py-3 text-sm leading-6",
            "bg-secondary text-zinc-100",
            "whitespace-pre-wrap break-words break-all overflow-hidden text-pretty"
          )}
        >
          {text}
        </div>
      ) : (
        <article
          className={cn(
            "p-2",
            "prose max-w-full text-[15px] leading-7 text-pretty prose-invert",
            "prose-pre:whitespace-pre-wrap prose-pre:break-words prose-code:break-words",
            "text-zinc-200",
            isSystem && "text-zinc-400 italic"
          )}
        >
          <MemoizedMarkdown id={message.id} content={text} />
        </article>

      )}
    </div>
  );
}
