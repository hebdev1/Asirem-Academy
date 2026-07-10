export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 p-8 text-center">
      <h1 className="text-xl font-semibold">Check your email</h1>
      <p className="text-sm text-gray-500">
        We sent a confirmation link{email ? ` to ${email}` : ""}. Click it to finish setting up
        your school.
      </p>
    </main>
  );
}
