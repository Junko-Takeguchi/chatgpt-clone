"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { InputButton, InputDisabledButton } from "../icons";

export function ChatInput({
  placeholder = "Message ChatGPT",
  onSubmit,
}: {
  placeholder?: string;
  onSubmit: (text: string, files?: any[]) => void;
}) {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isMultiline = value.split("\n").length > 1;
  const isInputEmpty = !value.trim() && files.length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isInputEmpty) send();
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
          { method: "POST", body: formData }
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

    setFiles((prev) => [...prev, ...uploaded]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isInputEmpty) return;

    onSubmit(value, files);
    setValue("");
    setFiles([]);
  };

  return (
    <form onSubmit={send} className="w-full">
      <div className="relative w-full max-w-[850px] mx-auto rounded-[28px] bg-secondary ring-1 ring-inset ring-zinc-800/70 px-4 py-3 flex flex-col gap-2">
        {/* File Previews */}
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

        {/* Input and Buttons */}
        {!isMultiline ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-zinc-400 hover:bg-[#424242] rounded-full hover:text-zinc-200"
            >
              <Plus className="h-6 w-6 text-white m-1" />
            </button>

            <textarea
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              ref={textareaRef}
              rows={1}
              className="w-full resize-none bg-transparent text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
            />

            {isInputEmpty ? (
              <button
                type="button"
                className="bg-[#424242] hover:bg-secondary rounded-full p-2 cursor-default"
                disabled
              >
                <InputDisabledButton className="h-5 w-5 text-white" />
              </button>
            ) : (
              <button
                type="submit"
                className="text-white bg-white rounded-full p-2 hover:cursor-pointer"
              >
                <InputButton className="h-5 w-5 text-black" />
              </button>
            )}
          </div>
        ) : (
          <>
            <textarea
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              ref={textareaRef}
              placeholder={placeholder}
              rows={Math.min(value.split("\n").length, 9)}
              className="w-full resize-none bg-transparent text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full p-2 text-zinc-400 hover:bg-primary hover:text-zinc-200"
              >
                <Plus className="h-6 w-6 text-white hover:bg-[#424242]" />
              </button>

              {isInputEmpty ? (
                <button
                type="button"
                className="bg-[#424242] hover:bg-secondary rounded-full p-2 cursor-default"
                disabled
              >
                <InputDisabledButton className="h-5 w-5 text-white" />
              </button>
              ) : (
                <button
                  type="submit"
                  className="text-white bg-white rounded-full p-2 hover:cursor-pointer"
                >
                  <InputButton className="h-5 w-5 text-black" />
                </button>
              )}
            </div>
          </>
        )}

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
