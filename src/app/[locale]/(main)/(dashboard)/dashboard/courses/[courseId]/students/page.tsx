import { setRequestLocale } from "next-intl/server";
import { CourseStudentsClient } from "@/components/dashboard/courses/students/course-students-client";

interface CourseStudentsPageProps {
  params: Promise<{
    locale: string;
    courseId: string;
  }>;
}

export default async function CourseStudentsPage({ params }: CourseStudentsPageProps) {
  const { locale, courseId } = await params;
  setRequestLocale(locale);

  return <CourseStudentsClient courseId={courseId} />;
}
