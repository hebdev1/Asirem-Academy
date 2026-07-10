import { notFound, redirect } from "next/navigation";
import { getInstitutionBySubdomain } from "@/lib/institution";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const institution = await getInstitutionBySubdomain(subdomain);
  if (!institution) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/t/${subdomain}/sign-in`);

  const { data: membership } = await supabase
    .from("memberships")
    .select("role, status")
    .eq("institution_id", institution.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    redirect(
      `/t/${subdomain}/sign-in?error=${encodeURIComponent("You are not a member of this school.")}`,
    );
  }

  const signOutWithSubdomain = signOut.bind(null, subdomain);

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{institution.name}</h1>
        <form action={signOutWithSubdomain}>
          <button type="submit" className="text-sm text-gray-500 underline">
            Sign out
          </button>
        </form>
      </div>
      <p className="mt-2 text-sm text-gray-500">Signed in as {user.email}</p>
      <p className="mt-1 text-sm text-gray-500">
        Role: <span className="font-medium">{membership.role}</span>
      </p>
    </main>
  );
}
