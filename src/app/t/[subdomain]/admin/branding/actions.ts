"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export type BrandingResult = { ok: boolean; error?: string };

const SUBDOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

export async function updateBranding(
  currentSubdomain: string,
  _prev: BrandingResult,
  formData: FormData,
): Promise<BrandingResult> {
  const { institution } = await requireAdmin(currentSubdomain);

  const name = String(formData.get("name") ?? "").trim();
  const primary_color = String(formData.get("primary_color") ?? "").trim();
  const subdomain = String(formData.get("subdomain") ?? "")
    .trim()
    .toLowerCase();

  if (!name) return { ok: false, error: "School name can't be empty." };
  if (!SUBDOMAIN_RE.test(subdomain)) {
    return { ok: false, error: "Subdomain must be lowercase letters, numbers, or hyphens." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("institutions")
    .update({ name, primary_color, subdomain })
    .eq("id", institution.id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "That subdomain is already taken." };
    }
    return { ok: false, error: error.message };
  }

  if (subdomain !== currentSubdomain) {
    // The tenant moved; send the admin to the new URL.
    redirect(`/t/${subdomain}/admin/branding?saved=1`);
  }

  revalidatePath(`/t/${currentSubdomain}/admin`, "layout");
  return { ok: true };
}
