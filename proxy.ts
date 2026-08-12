import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

import {getLocaleRouteAction} from "./lib/locale-routing";

const INTERNAL_REWRITE_HEADER = "x-warhounds-guide-locale-rewrite";
const LOCALE_HEADER = "x-next-intl-locale";

export default function proxy(request: NextRequest) {
  const action = getLocaleRouteAction(request.nextUrl.pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, action.locale);

  if (
    action.type === "redirect" &&
    request.headers.get(INTERNAL_REWRITE_HEADER) !== "1"
  ) {
    return NextResponse.redirect(new URL(action.pathname, request.url));
  }

  if (action.type === "rewrite") {
    requestHeaders.set(INTERNAL_REWRITE_HEADER, "1");
    return NextResponse.rewrite(new URL(action.pathname, request.url), {
      request: {headers: requestHeaders},
    });
  }

  return NextResponse.next({request: {headers: requestHeaders}});
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
