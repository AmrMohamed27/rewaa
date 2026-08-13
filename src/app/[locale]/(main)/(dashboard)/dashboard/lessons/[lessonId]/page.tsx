import { LessonDetailsClient } from "@/components/dashboard/lessons/lesson-details-client";

interface LessonDetailsPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonDetailsPage({ params }: LessonDetailsPageProps) {
  const resolvedParams = await params;
  return <LessonDetailsClient lessonId={resolvedParams.lessonId} />;
}
