import { PageContainer } from "@/components/layout/PageContainer";
import { getAuth } from "@/lib/api/client/auth/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function StudentDashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const cookieName = process.env.COOKIE_NAME || "rewaa_auth";
  const authCookie = cookieStore.get(cookieName);

  if (!authCookie || !authCookie.value) {
    redirect(`/${locale}/auth/login`);
  }

  try {
    const cookieString = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const profile = await getAuth().authControllerGetProfile({
      headers: {
        Cookie: cookieString,
      },
    });

    if (profile.data?.role !== "student") {
      redirect(`/${locale}/dashboard`);
    }
  } catch (error) {
    console.error("Student dashboard layout error:", error);
    redirect(`/${locale}/auth/login`);
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  );
}
