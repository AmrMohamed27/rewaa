"use client";

import { useLocale } from "next-intl";
import React from "react";
import { getStoredCourses } from "@/lib/courses-storage";
import { mockCoursesData } from "@/lib/mockCoursesData";
import { Course } from "@/types/course";
import { CourseBanner } from "./course-banner";
import { CourseHeader } from "./course-header";
import { CourseMetrics } from "./course-metrics";
import { CourseOverview } from "./course-overview";
import { CourseSections } from "./course-sections";
import { CourseSidebar } from "./course-sidebar";

interface CourseDetailsClientProps {
  courseId: string;
}

export function CourseDetailsClient({ courseId }: CourseDetailsClientProps) {
  const locale = useLocale();
  const [courses, setCourses] = React.useState<Course[]>([]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCourses(getStoredCourses(locale));
  }, [locale]);

  // Find course from stored dataset or fallback to mock
  const courseList =
    courses.length > 0 ? courses : mockCoursesData[locale as "ar" | "en"] || mockCoursesData.ar;
  const course = courseList.find((c) => c.id === courseId) || courseList[0];

  console.log(course.description);
  return (
    <div className="space-y-8">
      {/* Top Header & Navigation */}
      <CourseHeader course={course} />

      {/* Main Grid: Overview & Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Banner Image & Info */}
        <div className="lg:col-span-8 space-y-6">
          <CourseBanner course={course} />
          <CourseOverview course={course} />
          <CourseSections course={course} />
        </div>

        {/* Right 4 Cols: Meta Data Sidebar & Key Stats */}
        <div className="lg:col-span-4 space-y-6">
          <CourseMetrics course={course} />
          <CourseSidebar course={course} />
        </div>
      </div>
    </div>
  );
}
