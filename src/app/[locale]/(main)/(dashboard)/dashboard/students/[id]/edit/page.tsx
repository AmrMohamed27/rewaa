import { EditStudentClient } from "@/components/dashboard/students/edit-student-client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditStudentPage({ params }: PageProps) {
  const { id } = await params;
  return <EditStudentClient studentId={id} />;
}
