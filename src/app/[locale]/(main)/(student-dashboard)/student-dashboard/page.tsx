"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Award, LogOut } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function StudentDashboardPage() {
  const router = useRouter();
  const tAuth = useTranslations("auth.roles");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    document.cookie = "rewaa_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "rewaa_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">بوابة الطالب (Student Portal)</h1>
            <p className="text-sm text-muted-foreground">مرحباً بك في منصة رواء التعليمية للطلاب</p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الدورات التفاعلية</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <CardDescription className="text-xs pt-1">
              ستتوفر صفحات الدورات والدروس هنا قريباً
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الاختبارات والتقييمات</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <CardDescription className="text-xs pt-1">
              ستتوفر امتحانات الطلاب والنتائج هنا قريباً
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">نوع الحساب الحالي</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{tAuth("student")}</div>
            <CardDescription className="text-xs pt-1">
              تم التوجيه بنجاح إلى بوابة الطلاب
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
