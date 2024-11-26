import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getCookies } from "./app/(cookies)/cookies";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    // Only "getToken" worked !

    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/home"));
    }
    const user = getCookies()

    if(user==null) return NextResponse.redirect(new URL("/login"));

  }
);

export const config = {
  matcher: ["/"],
};