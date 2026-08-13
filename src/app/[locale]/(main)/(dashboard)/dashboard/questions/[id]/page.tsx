import { QuestionDetailsClient } from "@/components/dashboard/questions/question-details-client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuestionDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <QuestionDetailsClient questionId={id} />;
}
