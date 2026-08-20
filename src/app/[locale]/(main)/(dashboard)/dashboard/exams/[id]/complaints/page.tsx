import { notFound } from "next/navigation";
import { getStoredExams } from "@/lib/exams-storage";
import { ExamComplaintsClient } from "@/components/dashboard/exams/complaints/exam-complaints-client";

interface ExamComplaintsPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ExamComplaintsPage({ params }: ExamComplaintsPageProps) {
  const { locale, id } = await params;
  const storedExams = getStoredExams(locale);
  const exam = storedExams.find((e) => e.id === id);

  if (!exam) {
    notFound();
  }

  return <ExamComplaintsClient examId={id} />;
}
