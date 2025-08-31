"use client";

import { useState, useRef } from "react";
import { Paperclip, SendHorizonal } from "lucide-react";

export function ChatInput({
  placeholder = "Message ChatGPT",
  onSubmit,
}: {
  placeholder?: string;
  onSubmit: (text: string, files?: any[]) => void; // accept files
}) {
  const [value, setValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const scrollHeight = el.scrollHeight;
    const lineHeight = 24; // approximate line-height in px
    const maxHeight = lineHeight * 5; // max 5 lines
    el.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const uploaded = await Promise.all(
      Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();

        return {
          type: "file",
          filename: data.original_filename,
          mediaType: file.type,
          url: data.secure_url,
        };
      })
    );

    onSubmit(value, uploaded);
    setValue("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
    adjustHeight();
  };

  return (
    <form onSubmit={send} className="px-4 py-4">
      <div className="relative rounded-[28px] bg-secondary ring-1 ring-inset flex flex-col ring-zinc-800/70 px-4 py-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block m-2 w-full resize-none bg-transparent text-zinc-200 placeholder:text-zinc-500 focus:outline-none overflow-hidden"
          style={{ height: "25px", lineHeight: "24px", maxHeight: `${24 * 5}px` }}
        />

        <div className="w-full flex justify-between">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full p-2 text-zinc-400 hover:bg-primary hover:text-zinc-200"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="submit"
            className="rounded-full p-2 text-zinc-200 hover:bg-primary"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          multiple
          accept="image/*"
        />
      </div>
    </form>
  );
}
