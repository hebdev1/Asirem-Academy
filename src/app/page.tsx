import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Asirem Academy</h1>
      <p className="max-w-md text-lg text-gray-500">
        The fastest way for anyone to launch their own online school.
      </p>
      <Link
        href="/sign-up"
        className="rounded-full bg-indigo-600 px-6 py-3 font-medium text-white"
      >
        Launch your school
      </Link>
    </main>
  );
}
