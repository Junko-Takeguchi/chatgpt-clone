import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req : NextRequest) {
    try{
        const {initialText} = await req.json();
        console.log(initialText);

        const title = initialText?.trim() ? initialText.trim().slice(0, 40) : "New chat"

        const { userId } = await auth();
        
        if(!userId) return new NextResponse("Unauthorised", { status: 403 });

        const createdChat = await prisma?.chat.create({
            data: {
                userId: userId,
                title
            }
        });
        if(createdChat) return NextResponse.json({chatId : createdChat.id});
        else return NextResponse.json({ error: "error occured while creating chat" }, { status: 500 });
    }
    catch(e) {
        console.log(e);
        return NextResponse.json({ error: "error occured while creating chat" }, { status: 500 });
    }
}