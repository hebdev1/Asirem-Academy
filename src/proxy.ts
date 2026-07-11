import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROOT_DOMAINS = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost")
  .split(",")
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean);

/**
 * Resolves the tenant path for a request, or null if the request should be
 * served by the platform root (marketing / sign-up).
 *
 * A request is only treated as a tenant when the host is `<sub>.<rootDomain>`
 * for a configured root domain. Any host we don't recognize — the default
 * `*.vercel.app` deploy URL, an apex custom domain, a preview URL — falls
 * through to the root. Tenants are still always reachable via an explicit
 * `/t/<subdomain>` path (used in dev and for sharing before wildcard DNS).
 */
function resolveTenantPath(request: NextRequest): string | null {
  // Port is irrelevant for tenancy and varies across dev/preview environments.
  const hostname = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/t/")) return null;

  for (const root of ROOT_DOMAINS) {
    if (hostname === root) return null;
    const suffix = `.${root}`;
    if (hostname.endsWith(suffix)) {
      const subdomain = hostname.slice(0, -suffix.length);
      // Only a single left-most label counts (ignore www and deeper nesting).
      if (!subdomain || subdomain === "www" || subdomain.includes(".")) return null;
      return `/t/${subdomain}${pathname}`;
    }
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const tenantPath = resolveTenantPath(request);

  let response: NextResponse;
  if (tenantPath) {
    const url = request.nextUrl.clone();
    url.pathname = tenantPath;
    response = NextResponse.rewrite(url, { request });
  } else {
    response = NextResponse.next({ request });
  }

  // Refresh the Supabase auth session cookie on every request so server
  // components always see a valid session without each one re-verifying it.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
