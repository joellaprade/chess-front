import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("sessionToken");
  const { pathname } = req.nextUrl;
  const unprotectedRoutes = ["/", "/login", "/signup", "/about"];
  const isProtectedRoute = !unprotectedRoutes.includes(pathname);

  // para intentos de acceso indebidos
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // para que logged users no tengan que re-log
  if (token && pathname == "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
}

export const config = {
  matcher: [
    // Match everything except paths that start with `/public`
    "/((?!_next/).*)",
  ],
};
