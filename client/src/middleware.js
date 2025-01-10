import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function middleware(request) {
  const path = await request.nextUrl.pathname;
  const token = await request.cookies.get("token")?.value;
  if (path == "/login" || path == "/signup" || path == "/forgotPassword") {
    if (token) {
      const decodedToken = jwt.decode(token);
      return NextResponse.redirect(new URL(`/`, request.url));
    }
    return NextResponse.next();
  } else {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}
export const config = {
  matcher: ["/", "/login", "/signup", "/forgotPassword"],
};
