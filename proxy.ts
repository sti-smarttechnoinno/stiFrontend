import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "fr", "ar"];
const defaultLocale = "en";

// Routes that should NOT get locale prefixes like /en or /ar
const skippedPrefixes = ["/console", "/gate", "/api", "/_next", "/assets", "/storage"];

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().split("-")[0])
      .find((lang) => locales.includes(lang));
    if (preferred) return preferred;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sti_admin_token")?.value;

  // Protect /console and /console/* routes
  if (pathname.startsWith("/console")) {
    if (!token) {
      const loginUrl = new URL("/gate/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Handle /gate/login route: DO NOT redirect to /en/gate/login
  if (pathname.startsWith("/gate")) {
    if (token) {
      return NextResponse.redirect(new URL("/console", request.url));
    }
    return NextResponse.next();
  }

  if (skippedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const middleware = proxy;

export const config = {
  matcher: ["/((?!_next|assets|storage|favicon\\.ico|site\\.webmanifest).*)"],
};
