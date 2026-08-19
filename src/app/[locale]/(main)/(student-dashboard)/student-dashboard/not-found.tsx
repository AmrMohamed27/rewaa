import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * 404 Not Found page component.
 * Displays a friendly message when a user navigates to a non-existent route.
 */
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Button asChild>
        <Link href="/student-dashboard">{t("returnHome")}</Link>
      </Button>
    </div>
  );
}
