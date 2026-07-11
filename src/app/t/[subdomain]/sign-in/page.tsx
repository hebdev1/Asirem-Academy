import { notFound } from "next/navigation";
import { getInstitutionBySubdomain } from "@/lib/institution";
import { adminThemeVars } from "@/lib/admin-theme";
import { hankenGrotesk, jetbrainsMono } from "@/lib/fonts";
import { Icon } from "@/components/admin/icon";
import { signIn } from "./actions";
import { SubmitButton } from "./submit-button";

function initialOf(name: string) {
  return (name.trim()[0] ?? "?").toUpperCase();
}

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { subdomain } = await params;
  const { error } = await searchParams;
  const institution = await getInstitutionBySubdomain(subdomain);

  if (!institution) notFound();

  const signInWithSubdomain = signIn.bind(null, subdomain);
  const inputClass =
    "h-12 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 text-[15px] text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]";

  return (
    <div
      className={`${hankenGrotesk.variable} ${jetbrainsMono.variable} flex min-h-screen items-center justify-center p-5 sm:p-8`}
      style={{
        ...adminThemeVars(institution.primary_color),
        fontFamily: "var(--font-hanken), system-ui, sans-serif",
        color: "var(--text)",
        background:
          "radial-gradient(120% 80% at 50% -10%, color-mix(in oklab, var(--accent), #fff 84%) 0%, var(--bg) 55%)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
      />

      <div className="grid w-full max-w-[940px] overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-[0_30px_80px_rgba(20,20,15,0.14)] md:grid-cols-[1.05fr_1fr]">
        {/* Brand panel */}
        <div
          className="relative hidden flex-col justify-between p-10 text-white md:flex"
          style={{
            background:
              "linear-gradient(150deg, var(--accent), color-mix(in oklab, var(--accent), #000 32%))",
          }}
        >
          <div className="flex items-center gap-3">
            {institution.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={institution.logo_url}
                alt={institution.name}
                className="h-10 w-10 rounded-[10px] object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/20 text-lg font-extrabold">
                {initialOf(institution.name)}
              </div>
            )}
            <span className="text-[15px] font-bold">{institution.name}</span>
          </div>

          <div>
            <h2 className="max-w-[300px] text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em]">
              Welcome back to your school.
            </h2>
            <p className="mt-3 max-w-[320px] text-[15px] leading-relaxed text-white/85">
              Sign in to reach your courses, learners, and everything happening at{" "}
              {institution.name}.
            </p>
          </div>

          {/* mini featured-course card echoing the design language */}
          <div className="w-[240px] rounded-2xl bg-white/12 p-3 backdrop-blur-sm">
            <div className="mb-3 h-16 rounded-xl bg-white/20" />
            <div className="text-[13px] font-bold">Foundations of Visual Design</div>
            <div className="mt-1 text-[11px] text-white/75">7 lessons · Beginner</div>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center p-8 sm:p-11">
          {/* logo shown here on mobile (brand panel hidden) */}
          <div className="mb-7 flex items-center gap-3 md:hidden">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[10px] text-lg font-extrabold text-white"
              style={{ background: "var(--accent)" }}
            >
              {initialOf(institution.name)}
            </div>
            <span className="text-[15px] font-bold">{institution.name}</span>
          </div>

          <h1 className="text-[26px] font-extrabold tracking-[-0.02em]">Sign in</h1>
          <p className="mt-1.5 text-[14px] text-[var(--muted)]">
            to <span className="font-semibold text-[var(--text)]">{institution.name}</span>
          </p>

          {error ? (
            <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#fdeaea] px-3.5 py-3 text-[13px] font-medium text-[#c53434]">
              <Icon name="error" size={18} style={{ marginTop: 1 }} />
              <span>{error}</span>
            </div>
          ) : null}

          <form action={signInWithSubdomain} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold">Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@school.edu"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold">Password</span>
                <span className="text-[12px] font-medium text-[var(--faint)]">
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={inputClass}
              />
            </label>
            <SubmitButton />
          </form>

          <p className="mt-6 text-[13px] text-[var(--muted)]">
            New school?{" "}
            <a href="/sign-up" className="font-semibold" style={{ color: "var(--accent)" }}>
              Launch yours on Asirem
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
