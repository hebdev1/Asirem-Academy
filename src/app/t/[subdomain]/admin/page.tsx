import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/admin/icon";
import { Card, MetricCard } from "@/components/admin/ui";

function greeting(name: string) {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  return `Good ${part}, ${name}`;
}

const QUICK_ACTIONS = [
  { icon: "palette", label: "Customize branding", href: "branding" },
  { icon: "group_add", label: "Invite people", href: "people" },
  { icon: "library_books", label: "Review courses", href: "courses" },
];

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const { institution, user } = await requireAdmin(subdomain);
  const base = `/t/${subdomain}/admin`;

  const supabase = await createClient();

  const [{ data: profile }, membershipsRes] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    supabase
      .from("memberships")
      .select("role", { count: "exact" })
      .eq("institution_id", institution.id)
      .eq("status", "active"),
  ]);

  const rows = membershipsRes.data ?? [];
  const total = membershipsRes.count ?? rows.length;
  const students = rows.filter((r) => r.role === "student").length;
  const teachers = rows.filter((r) => r.role === "teacher").length;

  const firstName = (profile?.full_name ?? user.email ?? "there").split(/[\s@]/)[0];

  const metrics = [
    { icon: "group", value: total, label: "People" },
    { icon: "school", value: students, label: "Students" },
    { icon: "co_present", value: teachers, label: "Teachers" },
    { icon: "library_books", value: 0, label: "Courses" },
  ];

  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 4px" }}>
        {greeting(firstName)}
      </h2>
      <p style={{ margin: "0 0 22px", color: "var(--muted)", fontSize: 14 }}>
        Here&apos;s how {institution.name} is doing this week.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {metrics.map((m) => (
          <MetricCard key={m.label} icon={m.icon} value={m.value} label={m.label} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Recent activity</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "26px 0",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--accentSoft)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="history" size={24} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>No activity yet</div>
            <div style={{ fontSize: 13, color: "var(--muted)", maxWidth: 280 }}>
              Enrollments, submissions, and new members will show up here as your school comes to
              life.
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Quick actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.href}
                href={`${base}/${a.href}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: 13,
                  border: "1px solid var(--line)",
                  borderRadius: 11,
                  background: "var(--bg)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                <Icon name={a.icon} size={20} style={{ color: "var(--accent)" }} />
                {a.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
