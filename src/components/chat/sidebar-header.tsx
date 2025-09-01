import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SquarePen, Search, Book, Play, Grid } from "lucide-react"
import { GPTsIcon, LibraryIcon, VideoIcon } from "../icons"

export const SidebarHeader: React.FC = ()=> {
    return (
        <div className="px-3">
        <div className="flex flex-col gap-2">
            <Button asChild variant="ghost" className="flex items-center font-normal justify-start rounded-xl hover:text-white text-zinc-200 hover:bg-secondary">
            <Link href="/chat" className="flex items-center gap-2">
                <SquarePen className="h-4 w-4" />
                New chat
            </Link>
            </Button>

            <Button variant="ghost" className="flex items-center font-normal justify-start rounded-xl hover:text-white text-white hover:bg-secondary">
            <Search className="h-4 w-4" />
            Search chats
            </Button>
            <br/>
            <Button variant="ghost" className="flex items-center font-normal justify-start rounded-xl hover:text-white text-white hover:bg-secondary">
                <LibraryIcon/>
                Library
            </Button>

            <Button variant="ghost" className="flex items-center font-normal justify-start rounded-xl hover:text-white text-white hover:bg-secondary">
                <VideoIcon/>
                Sora
            </Button>

            <Button variant="ghost" className="flex items-center font-normal justify-start rounded-xl hover:text-white text-white hover:bg-secondary">
                <GPTsIcon/>
                GPTs
            </Button>
        </div>
        </div>
    )
}

