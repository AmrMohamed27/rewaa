import { getAuth } from "@/lib/api/client/auth/auth";
import ClientVerificationUI from "@/components/landing/auth/ClientVerificationUI";
import { AxiosError } from "axios";

export default async function EmailVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token;

  if (!token) {
    return <ClientVerificationUI initialStatus="error" errorMessage="Missing token." />;
  }

  let initialStatus: "success" | "error" = "success";
  let errorMessage: string | undefined = undefined;

  try {
    // Await your API call directly on the server
    await getAuth().authControllerVerify({ token });
  } catch (error) {
    console.error("Email verification error:", error);
    initialStatus = "error";

    // Extract error message from API response if available
    const errorData = (
      error as AxiosError<{
        message?: string | string[];
      }>
    )?.response?.data;
    errorMessage = Array.isArray(errorData?.message)
      ? errorData?.message?.join(", ")
      : errorData?.message || (error as Error)?.message || "Invalid or expired token.";
  }

  return <ClientVerificationUI initialStatus={initialStatus} errorMessage={errorMessage} />;
}
