import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const {userId} = await auth();
        if(!userId) return NextResponse.json({message: "Unauthorized user"}, { status: 403 });

        const chats = await prisma.chat.findMany({
            where: {
                userId
            },
            include: {
                messages: true
            }
        });
        // console.log(chats);
        return NextResponse.json({message: "success", chats}, { status: 200 });
    }
    catch(e) {
        console.log(e);
        return NextResponse.json({
            message: "error occured while getting chats",
            error: e
        }, {
            status: 500
        })
    }
}