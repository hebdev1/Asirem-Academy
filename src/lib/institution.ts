import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Institution = Tables<"institutions">;

export const getInstitutionBySubdomain = cache(
  async (subdomain: string): Promise<Institution | null> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("institutions")
      .select("*")
      .eq("subdomain", subdomain)
      .maybeSingle();
    return data;
  },
);
