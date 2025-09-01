"use client";

import { useState, useRef } from "react";
import { Paperclip, SendHorizonal, X } from "lucide-react";

export function ChatInput({
  placeholder = "Message ChatGPT",
  onSubmit,
}: {
  placeholder?: string;
  onSubmit: (text: string, files?: any[]) => void;
}) {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<any[]>([]); // store uploaded file objects
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const scrollHeight = el.scrollHeight;
    const lineHeight = 24;
    const maxHeight = lineHeight * 5;
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
    const filesSelected = event.target.files;
    if (!filesSelected?.length) return;

    const uploaded = await Promise.all(
      Array.from(filesSelected).map(async (file) => {
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

    // Instead of sending immediately, just store them
    setFiles((prev) => [...prev, ...uploaded]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim() && files.length === 0) return;

    onSubmit(value, files);

    // reset input
    setValue("");
    setFiles([]);
    adjustHeight();
  };

  return (
    <form onSubmit={send} className="px-4 py-4">
      <div className="relative rounded-[28px] bg-secondary ring-1 ring-inset flex flex-col gap-2 ring-zinc-800/70 px-4 py-3">

        {/* File previews */}
        {files.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={file.url}
                  alt={file.filename || "preview"}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-1 -right-1 bg-black/70 rounded-full p-1 text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block m-2 w-full resize-none bg-transparent text-zinc-200 placeholder:text-zinc-500 focus:outline-none overflow-hidden"
          style={{ height: "25px", lineHeight: "24px", maxHeight: `${24 * 5}px` }}
        />

        {/* Buttons */}
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

        {/* Hidden file input */}
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
