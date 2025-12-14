import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isProtectedRoute = (request: NextRequest) =>
  request.url.startsWith("/dashboard");

export const authProxy = async (request: NextRequest) => {
  const url = new URL("/api/auth/get-session", request.nextUrl.origin);
  const response = await fetch(url, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const session = await response.json();

  if (isProtectedRoute(request) && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
};
