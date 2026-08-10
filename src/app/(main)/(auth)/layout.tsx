import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

/**
 * Layout component for the auth route group.
 * If user is already authenticated (has active session cookie), redirects to /dashboard.
 *
 * @param props - Component props containing children elements.
 */
export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieName = process.env.COOKIE_NAME || "rewaa_auth";
  const authCookie = cookieStore.get(cookieName);

  if (authCookie && authCookie.value) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
