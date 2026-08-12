import { NewCourseClient } from "@/components/dashboard/courses/new-course-client";

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  const { courseId } = await params;
  return <NewCourseClient initialCourseId={courseId} />;
}
