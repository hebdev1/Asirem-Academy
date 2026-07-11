import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./icon";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 22,
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "-.02em",
            margin: "0 0 4px",
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  style,
  padding = 20,
}: {
  children: ReactNode;
  style?: CSSProperties;
  padding?: number | string;
}) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function MetricCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: ReactNode;
  label: string;
}) {
  return (
    <Card padding={18}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: "var(--accent)" }}>
        <Icon name={icon} size={20} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>{label}</div>
    </Card>
  );
}

export function StatusBadge({
  text,
  bg,
  fg,
}: {
  text: string;
  bg: string;
  fg: string;
}) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 20,
        background: bg,
        color: fg,
      }}
    >
      {text}
    </span>
  );
}

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  active: { bg: "#e7f6ee", fg: "#0e9f6e" },
  invited: { bg: "#fdf2e3", fg: "#b7791f" },
  suspended: { bg: "#fdeaea", fg: "#c53434" },
  published: { bg: "#e7f6ee", fg: "#0e9f6e" },
  draft: { bg: "#f0eff5", fg: "#6d5efc" },
};

export function statusColors(status: string) {
  return STATUS_COLORS[status] ?? { bg: "#f0efe9", fg: "#78776e" };
}
