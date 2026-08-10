import VerifyEmailUI from "@/components/landing/auth/VerifyEmailUI";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <VerifyEmailUI email={email} />;
}
