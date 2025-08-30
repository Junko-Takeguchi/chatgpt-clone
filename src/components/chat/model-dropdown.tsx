"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const MODELS = ["ChatGPT 4o", "GPT-4", "GPT-3.5"]

export function ModelDropdown() {
  const [model, setModel] = useState(MODELS[0])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 rounded-xl bg-zinc-800/60 hover:text-zinc-300 text-zinc-300 hover:bg-zinc-700">
          {model} <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 border-none bg-zinc-900 hover:text-zinc-300 text-zinc-300 hover:bg-zinc-800/60">
        {MODELS.map((m) => (
          <DropdownMenuItem key={m} onClick={() => setModel(m)} className="focus:bg-zinc-800 focus:text-zinc-300">
            {m}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
