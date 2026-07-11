import { requireAdmin } from "@/lib/admin-auth";
import { adminThemeVars } from "@/lib/admin-theme";
import { hankenGrotesk, jetbrainsMono } from "@/lib/fonts";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/admin/top-bar";

function initialOf(text: string | null | undefined, fallback = "?") {
  const t = (text ?? "").trim();
  return t ? t[0]!.toUpperCase() : fallback;
}

const ROLE_LABELS: Record<string, string> = {
  institution_admin: "Institution admin",
  super_admin: "Super admin",
};

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const { institution, user, role } = await requireAdmin(subdomain);

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const base = `/t/${subdomain}/admin`;
  const meName = profile?.full_name ?? user.email ?? "You";

  return (
    <div
      className={`${hankenGrotesk.variable} ${jetbrainsMono.variable}`}
      style={{
        ...adminThemeVars(institution.primary_color),
        fontFamily: "var(--font-hanken), system-ui, sans-serif",
        color: "var(--text)",
        background: "var(--bg)",
        minHeight: "100vh",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Material Symbols icon font. display=block is deliberate: it hides the
          glyph until the font loads instead of flashing raw ligature text
          ("hub", "palette", …), so swap is wrong here. */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
      />
      <div style={{ display: "grid", gridTemplateColumns: "248px 1fr", minHeight: "100vh" }}>
        <Sidebar
          base={base}
          brandName={institution.name}
          subdomain={institution.subdomain}
          brandInitial={initialOf(institution.name)}
          meName={meName}
          meInitial={initialOf(meName)}
          roleLabel={ROLE_LABELS[role] ?? role}
        />
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            background: "var(--bg)",
          }}
        >
          <TopBar base={base} />
          <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
            <div style={{ animation: "dc-fade-up .3s ease both", maxWidth: 1080, margin: "0 auto" }}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
