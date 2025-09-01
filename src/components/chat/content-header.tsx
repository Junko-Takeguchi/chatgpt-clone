import { Button } from "@/components/ui/button"
import { Share, Ellipsis } from "lucide-react"
import { ModelDropdown } from "./model-dropdown"

export function ContentHeader() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800/60 px-4 py-3">
      <div className="flex items-center gap-2">
        <ModelDropdown />
      </div>

      {/* Share + 3-Dots */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-fit px-3 cursor-pointer hover:bg-secondary text-white hover:text-white"
        >
          <Share className="h-4 w-4" />
          <span>Share</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-secondary cursor-pointer text-white hover:text-white"
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
