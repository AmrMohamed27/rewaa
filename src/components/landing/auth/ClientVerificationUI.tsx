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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldLabel, Field as UIField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthControllerResendVerification } from "@/hooks/use-auth";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api-utils";

export default function ClientVerificationUI({
  initialStatus,
  errorMessage: initialErrorMessage,
}: {
  initialStatus: "success" | "error";
  errorMessage?: string;
}) {
  const [resendEmail, setResendEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    mutateAsync: resendVerification,
    isPending: isResending,
    error: mutationError,
    data: mutationData,
  } = useAuthControllerResendVerification();

  const mutationErrorMessage = getErrorMessage(mutationError, mutationData);

  const handleResend = async () => {
    if (!resendEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      const response = await resendVerification({ data: { email: resendEmail } });
      if (response.statusCode === 200) {
        toast.success("Verification email sent! Please check your inbox.");
        setIsDialogOpen(false);
        setResendEmail("");
      }
    } catch (err) {
      console.error("Resend error:", err);
    }
  };

  const status = initialStatus;

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {status === "success" &&
              "Your email has been successfully verified. You can now log in."}
            {status === "error" && "We couldn't verify your email address."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center pb-6">
          {status === "success" && (
            <CheckCircle2 className="h-12 w-12 text-green-500 animate-in zoom-in duration-300" />
          )}
          {status === "error" && (
            <>
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-center text-sm text-muted-foreground mb-2">
                {initialErrorMessage}
              </p>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t bg-muted/50 py-6">
          {status === "success" && (
            <Button asChild className="w-full">
              <Link href="/auth/login">Go to Login</Link>
            </Button>
          )}

          {(status === "error" || status === "success") && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Resend Verification</DialogTitle>
                  <DialogDescription>
                    Enter your email address and we&apos;ll send you a new verification link.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <UIField>
                    <FieldLabel htmlFor="resend-email">Email Address</FieldLabel>
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                    />
                  </UIField>

                  {mutationErrorMessage && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-2 rounded animate-in fade-in slide-in-from-top-1">
                      {mutationErrorMessage}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || !resendEmail}
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Verification Link"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {status === "error" && (
            <Button asChild variant="ghost" className="w-full">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
