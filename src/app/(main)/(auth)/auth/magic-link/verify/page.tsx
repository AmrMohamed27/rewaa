import ClientMagicLinkVerificationUI from "@/components/landing/auth/ClientMagicLinkVerificationUI";

export default async function MagicLinkVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token;

  if (!token) {
    return (
      <ClientMagicLinkVerificationUI
        initialStatus="error"
        errorMessage="Missing verification token."
      />
    );
  }

  return <ClientMagicLinkVerificationUI token={token} />;
}
