import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import permitApi from "./lib/permitApi";

const isPublicRoute = createRouteMatcher(["/profile/create"]);

const isProtectedRoute = createRouteMatcher(["/home(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const userId = (await auth()).userId;
  const { origin } = req.nextUrl;

  if (isProtectedRoute(req)) await auth.protect();

  // get project_id and environment_id
  const { project_id, environment_id } = await permitApi
    .get("/v2/api-key/scope")
    .then((res) => res.data);

  // check if user's profile is complete (based on their existence in Permit)
  let isProfileComplete = false;

  try {
    await permitApi.get(
      `/v2/facts/${project_id}/${environment_id}/users/${userId}`
    );
    isProfileComplete = true;
  } catch {
    isProfileComplete = false;
  }

  // if it's a public route, the user is signed in and the profile is complete, redirect to home
  if (isPublicRoute(req) && isProfileComplete)
    return NextResponse.redirect(`${origin}/home`);

  // if the user has not completed their profile and is trying to access a protected route, redirect to profile creation page
  if (!isProfileComplete && isProtectedRoute(req)) {
    return NextResponse.redirect(`${origin}/profile/create`);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
