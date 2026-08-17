import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    locale: string;
    courseId: string;
  }>;
}

export default async function CourseCodesRedirectPage({ params }: PageProps) {
  const { locale, courseId } = await params;
  redirect(`/${locale}/dashboard/courses/codes?courseId=${courseId}`);
}
