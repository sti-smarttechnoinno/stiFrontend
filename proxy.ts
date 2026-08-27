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

  // Handle root "/" -> redirect to detected locale e.g. /fr
  if (pathname === "/" || pathname === "") {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // If path already starts with a valid locale prefix e.g. /fr, /ar, /en, /fr/ooredoo, etc.
  const hasValidLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasValidLocalePrefix) {
    return NextResponse.next();
  }

  // Handle old /ooredoo paths e.g. /ooredoo, /ooredoo/fr/about, /ooredoo/products
  if (pathname === "/ooredoo" || pathname.startsWith("/ooredoo/")) {
    const afterOoredoo = pathname.slice("/ooredoo".length); // e.g. "", "/fr", "/fr/about", "/products"
    
    // Check if it has /fr, /en, /ar after /ooredoo e.g. /ooredoo/fr/about
    const matchedLocaleInPath = locales.find(
      (l) => afterOoredoo === `/${l}` || afterOoredoo.startsWith(`/${l}/`)
    );

    if (matchedLocaleInPath) {
      const rest = afterOoredoo.slice(`/${matchedLocaleInPath}`.length);
      request.nextUrl.pathname = `/${matchedLocaleInPath}/ooredoo${rest}`;
      return NextResponse.redirect(request.nextUrl);
    }

    const locale = getLocale(request);
    const cleanSubPath = afterOoredoo.startsWith("/") ? afterOoredoo : `/${afterOoredoo}`;
    request.nextUrl.pathname = `/${locale}/ooredoo${cleanSubPath === "/" ? "" : cleanSubPath}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Handle /vivo paths e.g. /vivo, /vivo/fr/about, /vivo/products
  if (pathname === "/vivo" || pathname.startsWith("/vivo/")) {
    const afterVivo = pathname.slice("/vivo".length); // e.g. "", "/fr", "/fr/about", "/products"
    
    // Check if it has /fr, /en, /ar after /vivo e.g. /vivo/fr/about
    const matchedLocaleInPath = locales.find(
      (l) => afterVivo === `/${l}` || afterVivo.startsWith(`/${l}/`)
    );

    if (matchedLocaleInPath) {
      const rest = afterVivo.slice(`/${matchedLocaleInPath}`.length);
      request.nextUrl.pathname = `/${matchedLocaleInPath}/vivo${rest}`;
      return NextResponse.redirect(request.nextUrl);
    }

    const locale = getLocale(request);
    const cleanSubPath = afterVivo.startsWith("/") ? afterVivo : `/${afterVivo}`;
    request.nextUrl.pathname = `/${locale}/vivo${cleanSubPath === "/" ? "" : cleanSubPath}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Any other legacy unlocalized path e.g. /about, /products -> redirect to /${locale}/ooredoo/...
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}/ooredoo${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  return NextResponse.redirect(request.nextUrl);
}

export const middleware = proxy;

export const config = {
  matcher: ["/((?!_next|assets|storage|favicon\\.ico|site\\.webmanifest).*)"],
};
