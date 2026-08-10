"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getErrorMessage } from "@/lib/api-utils";
import {
  getAuthControllerGetProfileQueryKey,
  useMagicLinkControllerVerify,
} from "@/lib/api/react-query/auth/auth"; // Adjust import path
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function ClientMagicLinkVerificationUI({
  token,
  initialStatus,
  errorMessage: propErrorMessage,
}: {
  token?: string;
  initialStatus?: "success" | "error";
  errorMessage?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasAttempted = useRef(false);

  const {
    mutate: verifyToken,
    isPending,
    isSuccess,
    isError: isVerificationError,
    error: verificationError,
    data,
  } = useMagicLinkControllerVerify({
    mutation: {
      onSuccess: async () => {
        // Handle success cleanly here instead of inside the useEffect
        await queryClient.invalidateQueries({
          queryKey: getAuthControllerGetProfileQueryKey(),
        });
        toast.success("Authentication successful!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      },
    },
  });

  const isError = isVerificationError || initialStatus === "error";
  useEffect(() => {
    if (!token || hasAttempted.current) return;

    hasAttempted.current = true;

    verifyToken({ data: { token } });
  }, [token, verifyToken]);

  // 3. Extract the error message cleanly
  const errorMessage = propErrorMessage || getErrorMessage(verificationError, data);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {isPending && "Verifying..."}
            {isSuccess && "Success!"}
            {isError && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {isPending && "Please wait while we verify your secure link."}
            {isSuccess && "You have been successfully authenticated."}
            {isError && "We couldn't verify your magic link."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center pb-6">
          {isPending && <Loader2 className="h-12 w-12 text-primary animate-spin" />}
          {isSuccess && (
            <CheckCircle2 className="h-12 w-12 text-green-500 animate-in zoom-in duration-300" />
          )}
          {isError && (
            <>
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-center text-sm text-muted-foreground">{errorMessage}</p>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t bg-muted/50 py-6">
          {isError && (
            <>
              <Button asChild variant="default" className="w-full">
                <Link href="/auth/login/magic-link">Request new link</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </>
          )}
          {isSuccess && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
