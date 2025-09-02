"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UIMessage, FileUIPart } from "ai";
import { MemoizedMarkdown } from "@/components/memoized-markdown";
import { Copy, Pencil } from "lucide-react";

export function MessageBubble({
  message,
  onEdit,
}: {
  message: UIMessage;
  onEdit?: (text: string) => void;
}) {
  const isUser = message.role === "user";
  const textPart = message.parts.find((p) => p.type === "text");
  const hasImage = message.parts.some((p) => p.type === "file" && (p as FileUIPart).mediaType?.startsWith("image/"));

  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(textPart?.text ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  const handleCopy = () => {
    if (textPart?.text) {
      navigator.clipboard.writeText(textPart.text);
    }
  };

  const handleSendEdit = () => {
    if (!editedText.trim()) return;
    onEdit?.(editedText);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(textPart?.text ?? "");
    setEditing(false);
  };

  return (
    <div
      className={cn("w-full group", isUser ? "flex justify-end" : "flex justify-start")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative max-w-2xl w-fit">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-normal leading-6 flex flex-col gap-2",
            isUser
              ? "bg-secondary max-w-lg text-zinc-100"
              : "bg-primary text-zinc-200 w-full",
            "overflow-hidden text-pretty"
          )}
        >
          {editing ? (
            <div>
              <textarea
                ref={textareaRef}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={Math.min(editedText.split("\n").length + 1, 8)}
                className="w-full resize-none bg-transparent focus:outline-none text-white"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={handleCancelEdit}
                  className="text-white bg-black cursor-pointer px-3 py-1 text-sm rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEdit}
                  className="bg-white text-black px-3 py-1 cursor-pointer text-sm rounded-full hover:opacity-90"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <>
              {(message.parts ?? []).map((part, index) => {
                if (part.type === "text") {
                  return <MemoizedMarkdown key={index} id={message.id} content={part.text} />;
                }

                if (part.type === "file") {
                  const filePart = part as FileUIPart;
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

                return null;
              })}
            </>
          )}
        </div>

        {/* Floating Edit/Copy Buttons */}
        {isUser && !editing && !hasImage && hovered && (
          <div className="absolute bottom-[-32px] right-0 z-10 flex gap-2 bg-primary mt-2 px-3 py-1 rounded-full">
            <button
              onClick={() => setEditing(true)}
              className="text-white hover:bg-secondary rounded-md px-2 py-1"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="text-white hover:bg-secondary rounded-md px-2 py-1"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
