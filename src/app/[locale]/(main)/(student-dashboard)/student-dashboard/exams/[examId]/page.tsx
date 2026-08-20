import { StudentExamResultClient } from "@/components/dashboard/student/StudentExamResultClient";

interface StudentExamResultPageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function StudentExamResultPage({ params }: StudentExamResultPageProps) {
  const { examId } = await params;

  return <StudentExamResultClient examId={examId} />;
}
