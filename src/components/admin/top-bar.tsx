"use client";

import { usePathname } from "next/navigation";
import { Icon } from "./icon";

const TITLES: { match: (rest: string) => boolean; title: string }[] = [
  { match: (r) => r === "" || r === "/", title: "Dashboard" },
  { match: (r) => r.startsWith("/branding"), title: "Branding" },
  { match: (r) => r.startsWith("/people"), title: "People" },
  { match: (r) => r.startsWith("/courses"), title: "Courses" },
];

export function TopBar({ base }: { base: string }) {
  const pathname = usePathname();
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const title = TITLES.find((t) => t.match(rest))?.title ?? "Dashboard";

  return (
    <header
      style={{
        height: 64,
        borderBottom: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 28px",
        background: "color-mix(in oklab, var(--bg), #fff 55%)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-.01em" }}>{title}</div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 10,
            padding: "8px 12px",
            width: 220,
            color: "var(--faint)",
          }}
        >
          <Icon name="search" size={18} />
          <span style={{ fontSize: 13 }}>Search…</span>
        </div>
        <button
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "1px solid var(--line)",
            background: "var(--card)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Icon name="notifications" size={20} style={{ color: "var(--muted)" }} />
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 9,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--accent)",
            }}
          />
        </button>
      </div>
    </header>
  );
}
