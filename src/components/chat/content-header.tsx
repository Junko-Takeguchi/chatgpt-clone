import { Button } from "@/components/ui/button"
import { Upload, Shield } from "lucide-react"
import { ModelDropdown } from "./model-dropdown"
import Image from "next/image"

export function ContentHeader() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800/60 px-4 py-3">
      <div className="flex items-center gap-2">
        <ModelDropdown />
      </div>

      {/* Reference header image (hidden) */}
      <div className="sr-only">
        <Image src="/images/search.png" alt="Reference input look" width={639} height={44} />
      </div>
    </header>
  )
}
