import { AppSidebar } from "@/components/dashboard/layout/AppSidebar";
import { DashboardNavbar } from "@/components/dashboard/layout/DashboardNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getAuth } from "@/lib/api/client/auth/auth";
import { AuthControllerGetProfile200 } from "@/types/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { PageContainer } from "@/components/layout/PageContainer";

export default async function DashboardLayout({
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

  // Require active authentication cookie to access any page under (dashboard) group
  if (!authCookie || !authCookie.value) {
    redirect(`/${locale}/auth/login`);
  }

  let initialProfileData: AuthControllerGetProfile200 | undefined = undefined;
  let defaultOpen = true;

  try {
    const cookieString = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    initialProfileData = await getAuth().authControllerGetProfile({
      headers: {
        Cookie: cookieString,
      },
    });

    const sidebarState = cookieStore.get("sidebar_state");
    defaultOpen = sidebarState ? sidebarState.value === "true" : true;
  } catch (error) {
    console.error("Dashboard layout error:", error);
    redirect(`/${locale}/auth/login`);
  }

  if (!initialProfileData) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar initialProfileData={initialProfileData} />
      <div className="flex w-full flex-col flex-1">
        <DashboardNavbar initialProfileData={initialProfileData} />
        <main className="flex-1">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </SidebarProvider>
  );
}
