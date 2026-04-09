// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher(["/", "/events(.*)", "/kunstvaerker(.*)", "/galleri(.*)", "/sign-in(.*)", "/sign-up(.*)", "/forgot-password(.*)", "/auth(.*)"]);

// const isAdminRoute = createRouteMatcher(["/createevents(.*)", "/dashboard(.*)", "/changeevent(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isAdminRoute(req)) {
//     const { userId, sessionClaims } = await auth();
//     if (!userId || sessionClaims?.publicMetadata?.role !== "admin") {
//       return Response.redirect(new URL("/", req.url));
//     }
//   } else if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
// };

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher(["/", "/events(.*)", "/kvitering(.*)", "/kunstvaerker(.*)", "/dashboard(.*)", "/galleri(.*)", "/sign-in(.*)", "/sign-up(.*)", "/forgot-password(.*)", "/auth(.*)"]);

// const isAdminRoute = createRouteMatcher(["/createevents(.*)", "/dashboard(.*)", "/changeevent(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isAdminRoute(req)) {
//     const { userId, sessionClaims } = await auth();

//     // ✅ Check both possible locations of role
//     const role = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role;

//     if (!userId || role !== "admin") {
//       return Response.redirect(new URL("/", req.url));
//     }
//   } else if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
// };

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
