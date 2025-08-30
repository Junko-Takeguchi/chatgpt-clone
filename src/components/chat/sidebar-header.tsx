import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SquarePen, Search, Book, Play, Grid } from "lucide-react"

export const SidebarHeader: React.FC = ()=> {
    return (
        <div className="px-3">
        <div className="flex flex-col gap-2">
            <Button asChild variant="ghost" className="flex items-center justify-start rounded-xl hover:text-zinc-300 text-zinc-200 hover:bg-secondary">
            <Link href="/chat" className="flex items-center gap-2">
                <SquarePen className="h-4 w-4" />
                New chat
            </Link>
            </Button>

            <Button variant="ghost" className="flex items-center justify-start rounded-xl hover:text-zinc-300 text-zinc-300 hover:bg-secondary">
            <Search className="h-4 w-4" />
            Search chats
            </Button>

            <Button variant="ghost" className="flex items-center justify-start rounded-xl hover:text-zinc-300 text-zinc-300 hover:bg-secondary">
            <Book className="h-4 w-4" />
            Library
            </Button>

            <Button variant="ghost" className="flex items-center justify-start rounded-xl hover:text-zinc-300 text-zinc-300 hover:bg-secondary">
            <Play className="h-4 w-4" />
            Sora
            </Button>

            <Button variant="ghost" className="flex items-center justify-start rounded-xl hover:text-zinc-300 text-zinc-300 hover:bg-secondary">
            <Grid className="h-4 w-4" />
            GPTs
            </Button>
        </div>
        </div>
    )
}

