import { notFound } from "next/navigation";
import { getInstitutionBySubdomain } from "@/lib/institution";
import { signIn } from "./actions";

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

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-8">
      <div>
        {institution.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={institution.logo_url} alt={institution.name} className="h-10" />
        ) : null}
        <h1 className="mt-4 text-xl font-semibold">Sign in to {institution.name}</h1>
      </div>

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <form action={signInWithSubdomain} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-md px-3 py-2 font-medium text-white"
          style={{ backgroundColor: "var(--institution-primary)" }}
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
