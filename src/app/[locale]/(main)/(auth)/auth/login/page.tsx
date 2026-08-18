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
import { Link, useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, GraduationCap } from "lucide-react";

type LoginFormValues = {
  identifier: string;
  password: string;
};

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const tRoles = useTranslations("auth.roles");
  const tVal = useTranslations("validation");
  const tCommon = useTranslations("common");

  const [selectedRole, setSelectedRole] = useState<"assistant" | "student">("assistant");

  const loginSchema = useMemo(() => {
    if (selectedRole === "student") {
      return z.object({
        identifier: z
          .string()
          .min(1, tVal("phoneRequired"))
          .regex(/^[0-9+\s-]{8,15}$/, tVal("invalidPhone")),
        password: z.string().min(1, tVal("passwordRequired")),
      });
    }
    return z.object({
      identifier: z.string().email(tVal("invalidEmail")),
      password: z.string().min(1, tVal("passwordRequired")),
    });
  }, [selectedRole, tVal]);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: login, isPending, error, data, reset } = useAuthControllerLogin();
  const rawErrorMessage = getErrorMessage(error, data);
  if (rawErrorMessage) {
    console.error("Login API error details:", { error, data, rawErrorMessage });
  }
  const errorMessage = rawErrorMessage ? tCommon("genericError") : null;

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const payload = {
        password: values.password,
        role: selectedRole,
        ...(selectedRole === "student"
          ? { phone: values.identifier }
          : { email: values.identifier }),
      };

      const response = await login({
        data: payload as unknown as Parameters<typeof login>[0]["data"],
      });

      if (response.statusCode === 200) {
        await queryClient.invalidateQueries({
          queryKey: getAuthControllerGetProfileQueryKey(),
        });

        toast.success(t("loginSuccess"));
        if (selectedRole === "student") {
          router.push("/student-dashboard");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err) {
      console.error("Login submission error:", err);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="w-full relative border-none shadow-none ring-0">
        {isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-lg animate-in fade-in">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold tracking-tight">{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>

          <div className="pt-4">
            <Tabs
              value={selectedRole}
              onValueChange={(val) => setSelectedRole(val as "assistant" | "student")}
            >
              <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/70 rounded-xl">
                <TabsTrigger
                  value="assistant"
                  className="h-9 gap-2 text-xs font-semibold rounded-lg aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:shadow-sm transition-colors"
                >
                  <UserCheck className="h-4 w-4" />
                  {tRoles("assistant")}
                </TabsTrigger>
                <TabsTrigger
                  value="student"
                  className="h-9 gap-2 text-xs font-semibold rounded-lg aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:shadow-sm transition-colors"
                >
                  <GraduationCap className="h-4 w-4" />
                  {tRoles("student")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          <GenericForm
            key={selectedRole}
            title={t("submitText")}
            schema={loginSchema}
            error={errorMessage}
            defaultValues={{
              identifier: "",
              password: "",
            }}
            onSubmit={handleSubmit}
            onReset={reset}
            submitText={t("submitText")}
            extraActions={
              <>
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none cursor-pointer select-none"
                  >
                    {t("rememberMe")}
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t("forgotPasswordLink")}
                </Link>
              </>
            }
            fields={[
              {
                name: "identifier",
                label: selectedRole === "student" ? t("phoneLabel") : t("emailLabel"),
                type: selectedRole === "student" ? "tel" : "email",
                placeholder:
                  selectedRole === "student" ? t("phonePlaceholder") : t("emailPlaceholder"),
              },
              {
                name: "password",
                label: t("passwordLabel"),
                type: "password",
                placeholder: t("passwordPlaceholder"),
              },
            ]}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t("or")}</span>
            </div>
          </div>

          <div className="grid gap-4">
            <Button variant="outline" className="w-full" asChild>
              <a href={GOOGLE_AUTH_URL} className="flex items-center justify-center gap-2">
                <svg width="24px" height="24px" className="h-5 w-5" viewBox="-3 0 262 262">
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
                <span>{t("googleAuth")}</span>
              </a>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center border-t-0 bg-transparent pt-2 pb-4">
          <div className="text-sm">
            {t("noAccount")}{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              {t("signUp")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
