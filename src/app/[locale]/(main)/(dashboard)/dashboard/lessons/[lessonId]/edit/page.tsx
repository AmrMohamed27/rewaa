import { NewLessonClient } from "@/components/dashboard/lessons/new-lesson-client";

interface EditLessonPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function EditLessonPage({ params }: EditLessonPageProps) {
  const resolvedParams = await params;
  return <NewLessonClient initialLessonId={resolvedParams.lessonId} />;
}
