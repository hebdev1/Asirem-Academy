import { requireAdmin } from "@/lib/admin-auth";
import { Icon } from "@/components/admin/icon";
import { PageHeader } from "@/components/admin/ui";

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  await requireAdmin(subdomain);

  // Courses are Phase-1 build step 3 (Course Builder) — schema not created yet,
  // so this is an intentional empty state, not a data-fetch failure.
  return (
    <>
      <PageHeader title="Courses" subtitle="All courses across your school." />

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: "56px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 15,
            background: "var(--accentSoft)",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="library_books" size={30} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>No courses yet</div>
        <div style={{ fontSize: 14, color: "var(--muted)", maxWidth: 360, lineHeight: 1.5 }}>
          The Course Builder is coming next. Teachers will create courses, sections, and lessons —
          and they&apos;ll appear here for you to review.
        </div>
        <button
          disabled
          style={{
            marginTop: 6,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--bg)",
            color: "var(--faint)",
            border: "1px solid var(--line)",
            borderRadius: 11,
            padding: "11px 18px",
            fontWeight: 600,
            fontSize: 14,
            cursor: "not-allowed",
          }}
        >
          <Icon name="add" size={19} />
          New course · soon
        </button>
      </div>
    </>
  );
}
