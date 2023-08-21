import { NextResponse, type NextRequest } from "next/server";
import * as jose from "jose";

const authRoutes = ["/signin"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || "";
  const url = req.url;
  if (!token) {
    if (authRoutes.some((route) => url.includes(route))) return;
    return NextResponse.redirect(new URL("/signin", url));
  }

  try {
    const { payload: dataToken } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "")
    );

    const tokenValid = Date.now() >= (dataToken?.exp || 0) * 1000;

    // if has token and current url is public -> redirect to dashboard page
    if (tokenValid && authRoutes.some((route) => url.includes(route))) {
      return NextResponse.redirect(new URL("/", url));
    }
    if (!tokenValid && !url.includes("/signin")) {
      return NextResponse.redirect(new URL("/signin", url));
    }
  } catch (error) {
    console.log(error, "error");
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
