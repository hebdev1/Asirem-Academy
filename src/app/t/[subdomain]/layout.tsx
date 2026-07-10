import { notFound } from "next/navigation";
import { getInstitutionBySubdomain } from "@/lib/institution";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const institution = await getInstitutionBySubdomain(subdomain);

  if (!institution) notFound();

  const themeStyle = {
    "--institution-primary": institution.primary_color ?? "#4f46e5",
  } as React.CSSProperties;

  return (
    <div style={themeStyle} data-institution-id={institution.id}>
      {children}
    </div>
  );
}
