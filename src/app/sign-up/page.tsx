import { signUpAndCreateInstitution } from "./actions";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-8">
      <div>
        <h1 className="text-xl font-semibold">Launch your school</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create your account and your institution in one step.
        </p>
      </div>

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <form action={signUpAndCreateInstitution} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Your name
          <input
            type="text"
            name="fullName"
            required
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </label>
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
            minLength={8}
            autoComplete="new-password"
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </label>
        <hr className="my-2 border-gray-200" />
        <label className="flex flex-col gap-1 text-sm">
          School name
          <input
            type="text"
            name="institutionName"
            required
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Subdomain
          <div className="flex items-center gap-1">
            <input
              type="text"
              name="subdomain"
              required
              pattern="[a-z0-9][a-z0-9-]*[a-z0-9]?"
              placeholder="my-school"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            <span className="text-sm text-gray-500">.platform.com</span>
          </div>
        </label>
        <button
          type="submit"
          className="mt-2 rounded-md bg-indigo-600 px-3 py-2 font-medium text-white"
        >
          Create my school
        </button>
      </form>
    </main>
  );
}
