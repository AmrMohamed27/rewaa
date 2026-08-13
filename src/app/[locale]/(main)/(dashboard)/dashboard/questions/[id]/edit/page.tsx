import { EditQuestionClient } from "@/components/dashboard/questions/edit-question-client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditQuestionPage({ params }: PageProps) {
  const { id } = await params;
  return <EditQuestionClient questionId={id} />;
}
