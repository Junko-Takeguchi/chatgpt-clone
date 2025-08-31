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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    // Upload each file to Cloudinary
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
          url: data.secure_url, // permanent CDN URL
        };
      })
    );

    // Send message immediately with attached files
    onSubmit(value, uploaded);
    setValue("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <form onSubmit={send} className="px-4 py-4">
      <div className="relative rounded-[28px] bg-secondary ring-1 ring-inset flex flex-col ring-zinc-800/70 px-4 py-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="block w-full resize-none bg-transparent text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
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

        {/* hidden file input */}
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
