import { StudentDetailsClient } from "@/components/dashboard/students/student-details-client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <StudentDetailsClient studentId={id} />;
}
