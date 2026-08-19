"use client";

import { CourseCard } from "@/components/dashboard/courses/course-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getStoredCourses } from "@/lib/courses-storage";
import { getEnrolledCourseIds } from "@/lib/student-enrollment-storage";
import { Course } from "@/types/course";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface StudentLatestCoursesProps {
  enrolledCourseIds?: string[];
}

export function StudentLatestCourses({
  enrolledCourseIds: propEnrolledCourseIds,
}: StudentLatestCoursesProps) {
  const locale = useLocale();
  const t = useTranslations("studentDashboard.latestCourses");

  const [storedCourses, setStoredCourses] = useState<Course[]>([]);
  const [activeEnrolledIds, setActiveEnrolledIds] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Track whether we can scroll forward (towards the end of the list) or backward (towards the start)
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);
  const isRtl = locale === "ar";

  useEffect(() => {
    const loadCourses = () => {
      setStoredCourses(getStoredCourses(locale));
      setActiveEnrolledIds(getEnrolledCourseIds());
    };

    loadCourses();
    window.addEventListener("rewaa_courses_updated", loadCourses);
    window.addEventListener("rewaa_student_enrollment_updated", loadCourses);
    window.addEventListener("storage", loadCourses);
    return () => {
      window.removeEventListener("rewaa_courses_updated", loadCourses);
      window.removeEventListener("rewaa_student_enrollment_updated", loadCourses);
      window.removeEventListener("storage", loadCourses);
    };
  }, [locale]);

  // Determine latest 6 published courses not enrolled in
  const latestCourses = useMemo(() => {
    const excludedIds = new Set(propEnrolledCourseIds ?? activeEnrolledIds);

    return storedCourses
      .filter((c) => !c.isDraft && !excludedIds.has(c.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [storedCourses, propEnrolledCourseIds, activeEnrolledIds]);

  // Handle scroll check
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const isAr = locale === "ar";

    if (maxScroll <= 0) {
      setCanScrollStart(false);
      setCanScrollEnd(false);
      return;
    }

    if (isAr) {
      // Browsers handle RTL scrollLeft in different ways:
      // Modern standard Chromium/Firefox/Safari: 0 at start, negative values (0 to -maxScroll) as you scroll left.
      // Other legacy implementations may use positive values (0 to maxScroll).
      const scrollMagnitude = Math.abs(scrollLeft);
      setCanScrollStart(scrollMagnitude > 5);
      setCanScrollEnd(scrollMagnitude < maxScroll - 5);
    } else {
      setCanScrollStart(scrollLeft > 5);
      setCanScrollEnd(scrollLeft < maxScroll - 5);
    }
  }, [locale]);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [latestCourses, checkScroll]);

  const handleScroll = (direction: "start" | "end") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isAr = locale === "ar";
    const cardWidth = 320; // approximate width of card + gap

    // In LTR: "end" scrolls right (+cardWidth), "start" scrolls left (-cardWidth)
    // In RTL: "end" scrolls visually to the left (-cardWidth), "start" scrolls visually to the right (+cardWidth)
    let scrollDelta = direction === "end" ? cardWidth : -cardWidth;
    if (isAr) {
      scrollDelta = -scrollDelta;
    }

    el.scrollBy({ left: scrollDelta, behavior: "smooth" });
  };

  if (latestCourses.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 w-full">
      {/* Header with Title, Navigation Controls, and View All */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full cursor-pointer disabled:opacity-30"
              onClick={() => handleScroll("start")}
              disabled={!canScrollStart}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full cursor-pointer disabled:opacity-30"
              onClick={() => handleScroll("end")}
              disabled={!canScrollEnd}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary hover:bg-primary/10 gap-1.5 font-semibold text-sm h-8 px-3 rounded-lg group"
          >
            <Link href="/student-dashboard/courses/explore">
              <span>{t("viewAll")}</span>
              <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={scrollContainerRef}
        dir={isRtl ? "rtl" : "ltr"}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none -mx-1 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {latestCourses.map((course) => (
          <div key={course.id} className="w-70 sm:w-[320px] shrink-0 snap-start flex flex-col">
            <CourseCard
              course={course}
              mode="student"
              enrollHref={`/student-dashboard/courses/${course.id}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
