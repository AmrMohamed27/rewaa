import { notFound } from "next/navigation";
import { getStoredExams } from "@/lib/exams-storage";
import { ExamDetailsClient } from "@/components/dashboard/exams/exam-details-client";

interface ExamDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { locale, id } = await params;
  const storedExams = getStoredExams(locale);
  const exam = storedExams.find((e) => e.id === id);

  if (!exam) {
    notFound();
  }

  return <ExamDetailsClient examId={id} />;
}
