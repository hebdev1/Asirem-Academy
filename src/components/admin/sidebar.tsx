"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icon";

type NavItem = { label: string; icon: string; href: string };

export function Sidebar({
  base,
  brandName,
  subdomain,
  brandInitial,
  meName,
  meInitial,
  roleLabel,
}: {
  base: string; // e.g. /t/meridian/admin
  brandName: string;
  subdomain: string;
  brandInitial: string;
  meName: string;
  meInitial: string;
  roleLabel: string;
}) {
  const pathname = usePathname();

  const nav: NavItem[] = [
    { label: "Dashboard", icon: "grid_view", href: base },
    { label: "Branding", icon: "palette", href: `${base}/branding` },
    { label: "People", icon: "group", href: `${base}/people` },
    { label: "Courses", icon: "library_books", href: `${base}/courses` },
  ];

  return (
    <aside
      style={{
        background: "#fbfbf9",
        borderRight: "1px solid var(--line)",
        display: "flex",
        flexDirection: "column",
        padding: "18px 14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px 18px" }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          {brandInitial}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {brandName}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--faint)",
              fontFamily: "var(--font-jetbrains)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subdomain}.asirem.app
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        {nav.map((n) => {
          const active = n.href === base ? pathname === base : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                textAlign: "left",
                background: active ? "var(--accentSoft)" : "transparent",
                color: active ? "var(--accent)" : "var(--text)",
              }}
            >
              <Icon name={n.icon} size={21} />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 10px" }}>
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
            {meInitial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {meName}
            </div>
            <div style={{ fontSize: 11, color: "var(--faint)" }}>{roleLabel}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
