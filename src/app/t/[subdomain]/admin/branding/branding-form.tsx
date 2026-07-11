"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Icon } from "@/components/admin/icon";
import { Card } from "@/components/admin/ui";
import { DEFAULT_ACCENT } from "@/lib/admin-theme";
import { updateBranding, type BrandingResult } from "./actions";

const COLOR_CHOICES = [
  "#6d5efc",
  "#2563eb",
  "#0e9f6e",
  "#f59e0b",
  "#e0484d",
  "#8b5cf6",
];

const initialInitial = (s: string) => (s.trim()[0] ?? "?").toUpperCase();

function SaveButton({ dirty, saved }: { dirty: boolean; saved: boolean }) {
  const { pending } = useFormStatus();
  const label = pending ? "Saving…" : saved && !dirty ? "Saved" : "Save changes";
  const icon = pending ? "progress_activity" : saved && !dirty ? "check" : "save";
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "var(--accent)",
        color: "#fff",
        border: "none",
        borderRadius: 11,
        padding: "12px 22px",
        fontWeight: 600,
        fontSize: 14,
        cursor: pending ? "default" : "pointer",
        opacity: pending ? 0.8 : 1,
      }}
    >
      <Icon name={icon} size={18} />
      {label}
    </button>
  );
}

export function BrandingForm({
  subdomain,
  initialName,
  initialSubdomain,
  initialColor,
  savedFromRedirect,
}: {
  subdomain: string;
  initialName: string;
  initialSubdomain: string;
  initialColor: string | null;
  savedFromRedirect: boolean;
}) {
  const [state, formAction] = useActionState<BrandingResult, FormData>(
    updateBranding.bind(null, subdomain),
    { ok: savedFromRedirect },
  );

  const [name, setName] = useState(initialName);
  const [sub, setSub] = useState(initialSubdomain);
  const [color, setColor] = useState(initialColor || DEFAULT_ACCENT);

  const dirty =
    name !== initialName || sub !== initialSubdomain || color !== (initialColor || DEFAULT_ACCENT);

  // Local accent drives the live preview + swatch rings instantly, before the save round-trip.
  const formStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: 20,
    "--accent": color,
  } as React.CSSProperties;

  return (
    <form action={formAction} style={formStyle}>
      <input type="hidden" name="primary_color" value={color} />

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Card padding={22}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Brand color</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {COLOR_CHOICES.map((hex) => {
              const selected = hex.toLowerCase() === color.toLowerCase();
              return (
                <button
                  type="button"
                  key={hex}
                  onClick={() => setColor(hex)}
                  aria-label={`Use ${hex}`}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: hex,
                    cursor: "pointer",
                    border: `3px solid ${selected ? "var(--text)" : "transparent"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  {selected ? <Icon name="check" size={24} /> : null}
                </button>
              );
            })}
          </div>
        </Card>

        <Card padding={22}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Identity</div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            School name
          </label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid var(--line)",
              borderRadius: 11,
              fontSize: 14,
              marginBottom: 18,
              background: "var(--bg)",
            }}
          />
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Subdomain
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--line)",
              borderRadius: 11,
              overflow: "hidden",
              background: "var(--bg)",
            }}
          >
            <input
              name="subdomain"
              value={sub}
              onChange={(e) => setSub(e.target.value.toLowerCase())}
              style={{
                flex: 1,
                padding: "12px 14px",
                border: "none",
                fontSize: 14,
                fontFamily: "var(--font-jetbrains)",
                background: "transparent",
              }}
            />
            <span
              style={{
                padding: "0 14px",
                color: "var(--faint)",
                fontFamily: "var(--font-jetbrains)",
                fontSize: 13,
              }}
            >
              .asirem.app
            </span>
          </div>
        </Card>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <SaveButton dirty={dirty} saved={state.ok} />
          {state.error ? (
            <span style={{ fontSize: 13, color: "#c53434", fontWeight: 500 }}>{state.error}</span>
          ) : null}
          {state.ok && !dirty && !state.error ? (
            <span style={{ fontSize: 13, color: "#0e9f6e", fontWeight: 500 }}>
              Branding updated.
            </span>
          ) : null}
        </div>
      </div>

      {/* Live preview */}
      <div>
        <div
          style={{
            fontSize: 12,
            color: "var(--faint)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: ".07em",
            marginBottom: 10,
          }}
        >
          Live preview
        </div>
        <div
          style={{
            background: "var(--card)",
            borderRadius: 18,
            boxShadow: "0 16px 40px rgba(20,20,15,.1)",
            overflow: "hidden",
            border: "1px solid var(--line)",
          }}
        >
          <div
            style={{
              height: 66,
              background: color,
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "0 18px",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "rgba(255,255,255,.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
              }}
            >
              {initialInitial(name)}
            </div>
            <div style={{ color: "#fff" }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{name || "Your school"}</div>
              <div style={{ fontSize: 10.5, fontFamily: "var(--font-jetbrains)", opacity: 0.8 }}>
                {sub || "subdomain"}.asirem.app
              </div>
            </div>
          </div>
          <div style={{ padding: 18 }}>
            <div
              style={{
                height: 80,
                borderRadius: 11,
                background: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color}, #000 22%))`,
                marginBottom: 12,
              }}
            />
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
              Foundations of Visual Design
            </div>
            <div
              style={{
                height: 34,
                borderRadius: 9,
                background: color,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: 12.5,
              }}
            >
              Enroll now
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
