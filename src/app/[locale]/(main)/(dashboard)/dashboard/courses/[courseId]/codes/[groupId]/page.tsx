import { GroupCodesClient } from "@/components/dashboard/courses/codes/group-codes-client";

interface PageProps {
  params: Promise<{
    courseId: string;
    groupId: string;
  }>;
}

export default async function GroupCodesPage({ params }: PageProps) {
  const { courseId, groupId } = await params;
  return <GroupCodesClient courseId={courseId} groupId={groupId} />;
}
