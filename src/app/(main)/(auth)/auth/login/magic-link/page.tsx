"use client";

import { GenericForm } from "@/components/landing/layout/generic-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMagicLinkControllerRequest } from "@/hooks/use-auth";
import { Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import * as z from "zod";

const magicLinkSchema = z.object({
  email: z.email("Invalid email address"),
});

type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;

export default function MagicLinkRequestPage() {
  const { mutateAsync: requestMagicLink, isPending, error } = useMagicLinkControllerRequest();
  const errorMessage = Array.isArray(error?.message) ? error.message.join(", ") : error?.message;
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (values: MagicLinkFormValues) => {
    const response = await requestMagicLink({ data: values });
    if (response.statusCode === 200) {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md animate-in fade-in zoom-in duration-300">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Check your inbox</CardTitle>
            <CardDescription className="text-balance pt-2">
              We&apos;ve sent a magic link to your email address. Click the link to sign in
              instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button asChild variant="outline">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md relative">
        {isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-lg animate-in fade-in">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Magic Link</CardTitle>
          <CardDescription>Enter your email to receive a passwordless login link</CardDescription>
        </CardHeader>

        <CardContent>
          <GenericForm
            title="Request Magic Link"
            schema={magicLinkSchema}
            error={errorMessage}
            defaultValues={{
              email: "",
            }}
            onSubmit={handleSubmit}
            submitText="Send Magic Link"
            fields={[
              {
                name: "email",
                label: "Email Address",
                type: "email",
                placeholder: "john.doe@example.com",
              },
            ]}
          />
        </CardContent>

        <CardFooter className="justify-center border-t bg-muted/50 py-4">
          <div className="text-sm">
            Remember your password?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in with password
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
