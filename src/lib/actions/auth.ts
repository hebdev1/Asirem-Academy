"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut(subdomain: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/t/${subdomain}/sign-in`);
}
