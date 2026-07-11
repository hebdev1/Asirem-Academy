import type { CSSProperties } from "react";

export const DEFAULT_ACCENT = "#6d5efc";

/**
 * Warm-grey palette from the Institution Admin design, plus the institution's
 * brand color as --accent. Every admin screen reads these CSS variables so a
 * branding change re-themes the whole area.
 */
export function adminThemeVars(accent: string | null): CSSProperties {
  const a = accent || DEFAULT_ACCENT;
  return {
    "--bg": "#f7f7f5",
    "--text": "#191916",
    "--muted": "#78776e",
    "--faint": "#a8a79d",
    "--line": "#e8e7e1",
    "--card": "#ffffff",
    "--accent": a,
    "--accentSoft": `color-mix(in oklab, ${a}, #fff 88%)`,
  } as CSSProperties;
}
