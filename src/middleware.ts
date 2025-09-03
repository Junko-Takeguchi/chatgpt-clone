// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const publicRoutes = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/auth(.*)" // if you have any auth-related API routes
]);

export default clerkMiddleware(async (auth, req) => {
  if (!publicRoutes(req)) {
    await auth.protect(); // Redirects unauthenticated users to /sign-in
  }
}, { debug: true });

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
