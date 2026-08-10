"use client";

import { GenericForm } from "@/components/landing/layout/generic-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuthControllerLogin, GOOGLE_AUTH_URL } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api-utils";
import { getAuthControllerGetProfileQueryKey } from "@/lib/api/react-query/auth/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: login, isPending, error, data, reset } = useAuthControllerLogin();
  const errorMessage = getErrorMessage(error, data);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login({ data: values });

      if (response.statusCode === 200) {
        // Invalidate profile query to fetch the newly logged-in user
        await queryClient.invalidateQueries({
          queryKey: getAuthControllerGetProfileQueryKey(),
        });

        toast.success("Login successful! Welcome back.");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md relative">
        {isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-lg animate-in fade-in">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>

        <CardContent>
          <GenericForm
            title="Login"
            schema={loginSchema}
            error={errorMessage}
            defaultValues={{
              email: "",
              password: "",
            }}
            onSubmit={handleSubmit}
            onReset={reset}
            submitText="Log in"
            fields={[
              {
                name: "email",
                label: "Email Address",
                type: "email",
                placeholder: "john.doe@example.com",
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                placeholder: "••••••••",
              },
            ]}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="grid gap-4">
            <Button variant="outline" className="w-full" asChild>
              <a href={GOOGLE_AUTH_URL} className="flex items-center">
                <svg width="24px" height="24px" className="mr-2 h-6 w-6" viewBox="-3 0 262 262">
                  <path
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    fill="#4285F4"
                  />
                  <path
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    fill="#34A853"
                  />
                  <path
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    fill="#FBBC05"
                  />
                  <path
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    fill="#EB4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </a>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/login/magic-link">Log in with Magic Link</Link>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center border-t bg-muted/50 py-4">
          <div className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
