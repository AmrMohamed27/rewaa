import { StudentCourseDetailClient } from "@/components/dashboard/student/course-detail/StudentCourseDetailClient";

interface StudentCoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function StudentCoursePage({ params }: StudentCoursePageProps) {
  const { courseId } = await params;

  return <StudentCourseDetailClient courseId={courseId} />;
}
