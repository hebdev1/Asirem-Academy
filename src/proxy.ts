import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROOT_DOMAINS = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost")
  .split(",")
  .map((d) => d.trim());

/**
 * Resolves the tenant path for a request, or null if the request is already
 * targeting a route directly (root domain, or an explicit /t/<subdomain>
 * path used in local dev where wildcard subdomains aren't configured).
 */
function resolveTenantPath(request: NextRequest): string | null {
  // Port is irrelevant for tenancy and varies across dev/preview environments.
  const hostname = (request.headers.get("host") ?? "").split(":")[0];
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/t/")) return null;
  if (ROOT_DOMAINS.includes(hostname)) return null;

  const subdomain = hostname.split(".")[0];
  if (!subdomain || subdomain === "www") return null;

  return `/t/${subdomain}${pathname}`;
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
