"use client"

import { useState, type FormEvent, useEffect, useRef } from "react"
import { Paperclip, SendHorizonal } from "lucide-react"

export function ChatInput({
  placeholder = "Message ChatGPT",
  onSubmit,
  autoFocus,
}: {
  placeholder?: string
  onSubmit: (value: string) => void
  autoFocus?: boolean
}) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const adjustHeight = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    const computed = window.getComputedStyle(el)
    const parsed = Number.parseFloat(computed.lineHeight)
    const fallback = Number.parseFloat(computed.fontSize || "16") * 1.25
    const lineHeight = Number.isFinite(parsed) ? parsed : fallback
    const maxHeight = lineHeight * 9
    const newHeight = Math.min(el.scrollHeight, maxHeight)
    el.style.maxHeight = `${maxHeight}px`
    el.style.height = `${newHeight}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden"
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  const send = (e?: FormEvent) => {
    e?.preventDefault()
    const v = value.trim()
    if (!v) return
    onSubmit(v)
    setValue("")
  }

  return (
    <form onSubmit={send} className="px-4 py-4">
      {/* consistent layout for all heights */}
      <div className="relative min-h-12 rounded-[28px] bg-secondary ring-1 ring-inset flex flex-col ring-zinc-800/70 px-4 py-3 overflow-visible">
        <textarea
          ref={textareaRef}
          autoFocus={autoFocus}
          value={value}
          rows={1}
          onChange={(e) => setValue(e.target.value)}
          onInput={adjustHeight}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder={placeholder}
          aria-multiline="true"
          className="block w-full px-8 resize-none bg-transparent text-zinc-200 placeholder:text-zinc-500 focus:outline-none leading-6"
        />
        <div className="w-full flex justify-between">
          <button
            type="button"
            aria-label="Attach"
            className="rounded-full p-2 text-zinc-400 hover:bg-primary hover:text-zinc-200"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="submit"
            aria-label="Send"
            className="rounded-full bg-transparent p-2 text-zinc-200 hover:bg-primary shadow"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  )
}
