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
import { useAuthControllerRegister, GOOGLE_AUTH_URL } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api-utils";
import { Loader2 } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import * as z from "zod";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, GraduationCap } from "lucide-react";

type RegisterFormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export default function RegisterPage() {
  const t = useTranslations("auth");
  const tRoles = useTranslations("auth.roles");
  const tVal = useTranslations("validation");
  const tCommon = useTranslations("common");

  const [selectedRole, setSelectedRole] = useState<"assistant" | "student">("assistant");

  const registerSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(tVal("invalidEmail")),
        password: z.string().min(8, tVal("passwordMinLength")).max(32),
        firstName: z.string().min(1, tVal("firstNameRequired")),
        lastName: z.string().min(1, tVal("lastNameRequired")),
      }),
    [tVal],
  );

  const router = useRouter();
  const { mutateAsync: register, isPending, error, data, reset } = useAuthControllerRegister();
  const rawErrorMessage = getErrorMessage(error, data);
  if (rawErrorMessage) {
    console.error("Register API error details:", { error, data, rawErrorMessage });
  }
  const errorMessage = rawErrorMessage ? tCommon("genericError") : null;

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await register({
        data: {
          ...values,
          role: selectedRole,
        } as unknown as typeof values,
      });

      if (response.statusCode === 201) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
      }
    } catch (err) {
      console.error("Register submission error:", err);
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
          <CardTitle className="text-3xl font-bold tracking-tight">{t("register.title")}</CardTitle>
          <CardDescription>{t("register.subtitle")}</CardDescription>

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
            title={t("register.submitText")}
            schema={registerSchema}
            error={errorMessage}
            defaultValues={{
              email: "",
              password: "",
              firstName: "",
              lastName: "",
            }}
            onSubmit={handleSubmit}
            onReset={reset}
            submitText={t("register.submitText")}
            fields={[
              {
                name: "firstName",
                label: t("register.firstNameLabel"),
                placeholder: t("register.firstNamePlaceholder"),
              },
              {
                name: "lastName",
                label: t("register.lastNameLabel"),
                placeholder: t("register.lastNamePlaceholder"),
              },
              {
                name: "email",
                label: t("register.emailLabel"),
                type: "email",
                placeholder: t("register.emailPlaceholder"),
              },
              {
                name: "password",
                label: t("register.passwordLabel"),
                type: "password",
                placeholder: t("register.passwordPlaceholder"),
              },
            ]}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t("login.or")}</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <a href={GOOGLE_AUTH_URL} className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>{t("login.googleAuth")}</span>
            </a>
          </Button>
        </CardContent>

        <CardFooter className="justify-center border-t-0 bg-transparent pt-2 pb-4">
          <div className="text-sm">
            {t("register.alreadyHaveAccount")}{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              {t("register.signIn")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
