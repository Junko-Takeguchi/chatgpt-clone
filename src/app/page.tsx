import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/chat");
}