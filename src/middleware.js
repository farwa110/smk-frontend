import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/events(.*)", "/kunstvaerker(.*)", "/galleri(.*)", "/kvitering(.*)", "/sign-in(.*)", "/sign-up(.*)", "/forgot-password(.*)", "/auth(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
