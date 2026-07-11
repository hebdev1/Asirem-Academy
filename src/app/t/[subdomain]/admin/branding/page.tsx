import { requireAdmin } from "@/lib/admin-auth";
import { PageHeader } from "@/components/admin/ui";
import { BrandingForm } from "./branding-form";

export default async function BrandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { subdomain } = await params;
  const { saved } = await searchParams;
  const { institution } = await requireAdmin(subdomain);

  return (
    <>
      <PageHeader
        title="Branding"
        subtitle="Your school's identity. Changes apply across every learner and teacher screen."
      />
      <BrandingForm
        subdomain={subdomain}
        initialName={institution.name}
        initialSubdomain={institution.subdomain}
        initialColor={institution.primary_color}
        savedFromRedirect={saved === "1"}
      />
    </>
  );
}
