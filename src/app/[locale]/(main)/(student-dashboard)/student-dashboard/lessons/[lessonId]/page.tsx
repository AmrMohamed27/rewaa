import { StudentLessonDetailsClient } from "@/components/dashboard/student/lessons/StudentLessonDetailsClient";

export default async function StudentLessonDetailsPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  return <StudentLessonDetailsClient lessonId={lessonId} />;
}
