import { getTranslations } from "next-intl/server";
import { StudentProfileClient } from "@/components/dashboard/student/StudentProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "studentDashboard.profilePage" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function StudentProfilePage() {
  return <StudentProfileClient />;
}
