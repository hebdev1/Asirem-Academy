import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/admin/icon";
import { PageHeader, StatusBadge, statusColors } from "@/components/admin/ui";

const ROLE_LABELS: Record<string, string> = {
  institution_admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  super_admin: "Super admin",
};

function initialOf(name: string | null, fallback: string) {
  const t = (name ?? "").trim();
  return t ? t[0]!.toUpperCase() : fallback;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function PeoplePage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const { institution } = await requireAdmin(subdomain);

  const supabase = await createClient();
  const { data: memberships } = await supabase
    .from("memberships")
    .select("id, user_id, role, status, created_at")
    .eq("institution_id", institution.id)
    .order("created_at", { ascending: true });

  const rows = memberships ?? [];
  const userIds = rows.map((r) => r.user_id);

  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", userIds)
    : { data: [] as { id: string; full_name: string | null }[] };

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

  const gridCols = "2fr 1fr 1fr 1fr";

  return (
    <>
      <PageHeader
        title="People"
        subtitle={`Admins, teachers, and students at ${institution.name}.`}
        action={
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 11,
                padding: "11px 16px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                color: "var(--text)",
              }}
            >
              <Icon name="upload_file" size={19} />
              Import CSV
            </button>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 11,
                padding: "11px 18px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              <Icon name="group_add" size={19} />
              Invite people
            </button>
          </div>
        }
      />

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            padding: "11px 20px",
            fontSize: 12,
            color: "var(--faint)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: ".05em",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div>Name</div>
          <div>Role</div>
          <div>Status</div>
          <div>Joined</div>
        </div>

        {rows.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
            No members yet. Invite your first teacher or student to get started.
          </div>
        ) : (
          rows.map((m) => {
            const name = nameById.get(m.user_id) ?? "Pending member";
            const sc = statusColors(m.status);
            return (
              <div
                key={m.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: gridCols,
                  padding: "13px 20px",
                  alignItems: "center",
                  borderBottom: "1px solid var(--line)",
                  fontSize: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--accentSoft)",
                      color: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {initialOf(name, "P")}
                  </div>
                  <span style={{ fontWeight: 600 }}>{name}</span>
                </div>
                <div style={{ color: "var(--muted)" }}>{ROLE_LABELS[m.role] ?? m.role}</div>
                <div>
                  <StatusBadge text={m.status} bg={sc.bg} fg={sc.fg} />
                </div>
                <div style={{ color: "var(--muted)" }}>{formatDate(m.created_at)}</div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
