import { CourseDetailsClient } from "@/components/dashboard/courses/course-details-client";

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { courseId } = await params;
  return <CourseDetailsClient courseId={courseId} />;
}
