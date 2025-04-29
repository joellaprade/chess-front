import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const result = await fetch(`${req.nextUrl.origin}/api/validate-session`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });
  const isValidSession = (await result.json()).isValidSession;

  const { pathname } = req.nextUrl;
  const unprotectedRoutes = ["/", "/login", "/signup", "/about"];
  const isProtectedRoute = !unprotectedRoutes.includes(pathname);
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-pathname", pathname);
  const res = NextResponse.next({
    request: {
      headers: reqHeaders,
    },
  });

  res.headers.set("x-pathname", pathname);

  console.log(res.headers.get("x-pathname"));
  console.log(req.headers.get("x-pathname"));

  if (!isValidSession && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isValidSession && pathname == "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/|api/|assets/|favicon).*)"],
};
