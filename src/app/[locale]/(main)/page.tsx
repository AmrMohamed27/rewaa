import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const cookieName = process.env.COOKIE_NAME || "rewaa_auth";
  const authCookie = cookieStore.get(cookieName);

  if (!authCookie || !authCookie.value) {
    redirect(`/${locale}/auth/login`);
  }

  const roleCookie = cookieStore.get("rewaa_role");
  const userRole = roleCookie?.value;

  if (userRole === "student") {
    redirect(`/${locale}/student-dashboard`);
  }

  redirect(`/${locale}/dashboard`);
}
