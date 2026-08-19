"use client";

import { StudentEnrolledCourses } from "@/components/dashboard/student/StudentEnrolledCourses";
import { StudentGeneralOverview } from "@/components/dashboard/student/StudentGeneralOverview";
import { StudentHomeHero } from "@/components/dashboard/student/StudentHomeHero";
import { StudentLatestCourses } from "@/components/dashboard/student/StudentLatestCourses";
import { StudentRecentAnnouncement } from "@/components/dashboard/student/StudentRecentAnnouncement";
import { useAuthControllerGetProfile } from "@/hooks/use-auth";
import { useLocale } from "next-intl";

export default function StudentDashboardPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data } = useAuthControllerGetProfile({
    query: {
      staleTime: 1000 * 60 * 5,
    },
  });

  const user = data?.data;
  const firstName = (isAr && user?.firstNameAr ? user.firstNameAr : user?.firstName) || "";
  const lastName = (isAr && user?.lastNameAr ? user.lastNameAr : user?.lastName) || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const studentName: string | undefined =
    fullName || (typeof user?.name === "string" ? user.name : undefined) || user?.email;

  return (
    <div className="space-y-8 w-full">
      <StudentHomeHero studentName={studentName} />
      <StudentGeneralOverview />
      <StudentRecentAnnouncement />
      <StudentEnrolledCourses />
      <StudentLatestCourses />
    </div>
  );
}
