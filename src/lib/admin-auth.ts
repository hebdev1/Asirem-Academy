import { notFound, redirect } from "next/navigation";
import { getInstitutionBySubdomain, type Institution } from "@/lib/institution";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type AdminContext = {
  institution: Institution;
  user: User;
  role: string;
};

const ADMIN_ROLES = ["institution_admin", "super_admin"];

/**
 * Guards an admin route. Resolves the tenant, requires an authenticated user
 * with an admin membership in this institution, and returns the context.
 * Redirects to sign-in (or the tenant home) otherwise.
 */
export async function requireAdmin(subdomain: string): Promise<AdminContext> {
  const institution = await getInstitutionBySubdomain(subdomain);
  if (!institution) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/t/${subdomain}/sign-in`);

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("institution_id", institution.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership || !ADMIN_ROLES.includes(membership.role)) {
    redirect(
      `/t/${subdomain}/sign-in?error=${encodeURIComponent(
        "You don't have admin access to this school.",
      )}`,
    );
  }

  return { institution, user, role: membership.role };
}
