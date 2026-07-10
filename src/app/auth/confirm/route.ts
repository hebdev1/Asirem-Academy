import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (tokenHash && type) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error && data.user) {
      const pendingName = data.user.user_metadata?.pending_institution_name as
        | string
        | undefined;
      const pendingSubdomain = data.user.user_metadata?.pending_institution_subdomain as
        | string
        | undefined;

      if (pendingName && pendingSubdomain) {
        const { data: institution } = await supabase.rpc("create_institution", {
          p_name: pendingName,
          p_subdomain: pendingSubdomain,
        });

        if (institution) redirect(`/t/${institution.subdomain}/dashboard`);
      }

      redirect("/");
    }
  }

  redirect(`/sign-up?error=${encodeURIComponent("Invalid or expired confirmation link.")}`);
}
