"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUpAndCreateInstitution(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const institutionName = String(formData.get("institutionName") ?? "");
  const subdomain = String(formData.get("subdomain") ?? "")
    .trim()
    .toLowerCase();

  const supabase = await createClient();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Stashed on the user so the /auth/confirm callback can finish
      // creating the institution once the email is verified (if email
      // confirmation is required, signUp() won't return a session yet).
      data: {
        full_name: fullName,
        pending_institution_name: institutionName,
        pending_institution_subdomain: subdomain,
      },
    },
  });

  if (signUpError || !signUpData.user) {
    redirect(`/sign-up?error=${encodeURIComponent(signUpError?.message ?? "Sign up failed")}`);
  }

  if (!signUpData.session) {
    redirect(`/sign-up/check-email?email=${encodeURIComponent(email)}`);
  }

  const { data: institution, error: rpcError } = await supabase.rpc("create_institution", {
    p_name: institutionName,
    p_subdomain: subdomain,
  });

  if (rpcError || !institution) {
    redirect(
      `/sign-up?error=${encodeURIComponent(rpcError?.message ?? "Could not create your school")}`,
    );
  }

  redirect(`/t/${institution.subdomain}/dashboard`);
}
