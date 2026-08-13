import { notFound } from "next/navigation";
import { getStoredExams } from "@/lib/exams-storage";
import { ExamFormClient } from "@/components/dashboard/exams/exam-form-client";

interface EditExamPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditExamPage({ params }: EditExamPageProps) {
  const { locale, id } = await params;
  const exams = getStoredExams(locale);
  const exam = exams.find((e) => e.id === id);

  if (!exam) {
    notFound();
  }

  return <ExamFormClient mode="edit" initialData={exam} />;
}
