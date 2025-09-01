"use client";

import { useState } from "react";
import { Check, ChevronDown, Sparkles, Atom } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Replace with correct path

const MODELS = [
  {
    name: "ChatGPT Go",
    description: "Our smartest model & more",
    upgrade: true,
    icon: <Sparkles className="w-4 h-4 text-white" />,
  },
  {
    name: "ChatGPT",
    description: "Great for everyday tasks",
    upgrade: false,
    icon: <Atom className="w-4 h-4 text-zinc-400" />,
  },
];

export function ModelDropdown() {
  const [model, setModel] = useState(MODELS[1].name); // Default to ChatGPT

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="px-4 py-2 text-lg font-normal focus:outline-none rounded-md bg-primary hover:text-white text-white hover:bg-secondary"
        >
          {model} <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72 border-none bg-secondary text-white py-1">
        {MODELS.map((m) => (
          <DropdownMenuItem
            key={m.name}
            onClick={() => setModel(m.name)}
            className="focus:bg-[#424242] px-4 py-2 cursor-pointer flex justify-between items-center gap-3"
          >
            {/* Left Section: Icon + Text */}
            <div className="flex items-start gap-3">
              <div className="pt-1">{m.icon}</div>
              <div className="flex flex-col">
                <span className="text-sm font-normal text-white">{m.name}</span>
                <span className="text-xs text-zinc-400">{m.description}</span>
              </div>
            </div>

            {/* Right Section: Upgrade badge + Check */}
            <div className="flex items-center gap-2 ml-auto">
              {m.upgrade && (
                <span className="text-xs text-zinc-400 border border-zinc-600 rounded-md px-2 py-0.5">
                  Upgrade
                </span>
              )}
              {model === m.name && (
                <Check className="w-4 h-4 text-zinc-300" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
