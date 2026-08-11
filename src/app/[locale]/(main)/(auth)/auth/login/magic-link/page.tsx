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
import { Link } from "@/i18n/routing";
import { useState } from "react";
import { useTranslations } from "next-intl";
import * as z from "zod";

import { useMemo } from "react";

type MagicLinkFormValues = {
  email: string;
};

export default function MagicLinkRequestPage() {
  const t = useTranslations("auth");
  const tVal = useTranslations("validation");
  const tCommon = useTranslations("common");

  const magicLinkSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(tVal("invalidEmail")),
      }),
    [tVal],
  );

  const { mutateAsync: requestMagicLink, isPending, error } = useMagicLinkControllerRequest();
  if (error) {
    console.error("Magic link request error details:", error);
  }
  const errorMessage = error ? tCommon("genericError") : null;
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (values: MagicLinkFormValues) => {
    try {
      const response = await requestMagicLink({ data: values });
      if (response.statusCode === 200) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Magic link submission error:", err);
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
            <CardTitle className="text-3xl font-bold tracking-tight">
              {t("magicLink.checkEmail")}
            </CardTitle>
            <CardDescription className="text-balance pt-2">
              {t("magicLink.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button asChild variant="outline">
              <Link href="/auth/login">{t("magicLink.backToLogin")}</Link>
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
          <CardTitle className="text-3xl font-bold tracking-tight">
            {t("magicLink.title")}
          </CardTitle>
          <CardDescription>{t("magicLink.subtitle")}</CardDescription>
        </CardHeader>

        <CardContent>
          <GenericForm
            title={t("magicLink.submitText")}
            schema={magicLinkSchema}
            error={errorMessage}
            defaultValues={{
              email: "",
            }}
            onSubmit={handleSubmit}
            submitText={t("magicLink.submitText")}
            fields={[
              {
                name: "email",
                label: t("login.emailLabel"),
                type: "email",
                placeholder: t("login.emailPlaceholder"),
              },
            ]}
          />
        </CardContent>

        <CardFooter className="justify-center border-t bg-muted/50 py-4">
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
