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
import { Loader2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-utils";

export default function VerifyEmailUI({ email }: { email?: string }) {
  const [resendEmail, setResendEmail] = useState(email || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    mutateAsync: resendVerification,
    isPending: isResending,
    error,
    data,
  } = useAuthControllerResendVerification();

  const errorMessage = getErrorMessage(error, data);

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
      }
    } catch (err) {
      // Error is now handled by the errorMessage variable and displayed in the UI
      console.error("Resend verification error:", err);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Mail className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium text-foreground">{email || "your email address"}</span>.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-6">
          <p className="text-sm text-muted-foreground mb-4">
            Please click the link in the email to verify your account. If you don&apos;t see it,
            check your spam folder.
          </p>

          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md animate-in fade-in slide-in-from-top-1">
              {errorMessage}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t bg-muted/50 py-6">
          <Button asChild className="w-full">
            <Link href="/auth/login">Back to Login</Link>
          </Button>

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

                {errorMessage && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-2 rounded animate-in fade-in slide-in-from-top-1">
                    {errorMessage}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleResend} disabled={isResending || !resendEmail}>
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
        </CardFooter>
      </Card>
    </div>
  );
}
