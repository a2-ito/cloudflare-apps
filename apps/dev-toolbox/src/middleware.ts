// middleware.ts
import { NextRequest, NextResponse } from "next/server";

//export function middleware(request: NextRequest) {
//  const url = new URL(request.url)
//
//  if (url.pathname === "/") {
//    return NextResponse.redirect(new URL("/ja", url))
//  }
//  return NextResponse.redirect(new URL("/ja", url))
//}

import { locales, defaultLocale, isLocale } from "@/i18n/config";

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  // ex: "ja,en-US;q=0.9,en;q=0.8"
  const langs = acceptLanguage
    .split(",")
    .map((l) => l.split(";")[0].toLowerCase());

  for (const lang of langs) {
    const base = lang.split("-")[0];
    //if (locales.includes(base)) {
    //  return base;
    //}
		if (isLocale(base)) {
			return base
		}
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("accept-language:", request.headers.get("accept-language"));

  // すでに /ja /en なら何もしない
  if (locales.some((locale) => pathname.startsWith(`/${locale}`))) {
    return NextResponse.next();
  }

  // 静的ファイルは無視
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // "/" のときだけリダイレクト
  if (pathname === "/") {
    const locale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
