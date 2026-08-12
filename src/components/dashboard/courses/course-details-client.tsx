/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Pencil,
  PlayCircle,
  Sparkles,
  User,
  Users,
  Video,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { getStoredCourses } from "@/lib/courses-storage";
import { mockCoursesData } from "@/lib/mockCoursesData";
import { Course } from "@/types/course";
import { DashboardCard } from "../overview/dashboard-card";
import { StatTile } from "../overview/stat-tile";

interface CourseDetailsClientProps {
  courseId: string;
}

export function CourseDetailsClient({ courseId }: CourseDetailsClientProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("courses");

  const [courses, setCourses] = React.useState<Course[]>([]);

  React.useEffect(() => {
    setCourses(getStoredCourses(locale));
  }, [locale]);

  // Find course from stored dataset or fallback to mock
  const courseList =
    courses.length > 0 ? courses : mockCoursesData[locale as "ar" | "en"] || mockCoursesData.ar;
  const course = courseList.find((c) => c.id === courseId) || courseList[0];

  const formatPrice = (price: number, currency: string, isFree: boolean) => {
    if (isFree || price === 0) return t("card.free");
    return `${price.toLocaleString(isAr ? "ar-EG" : "en-US")} ${isAr ? (currency === "EGP" ? t("card.egp") : currency) : currency}`;
  };

  // Calculate quick stats across sections
  const totalSections = course.sections.length;
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalExams = course.sections.reduce(
    (acc, s) => acc + (s.linkedExam ? 1 : 0) + s.tests.length,
    0,
  );

  return (
    <div className="space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href={`/${locale}/dashboard/courses`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            {isAr ? <ArrowRight className="size-3.5" /> : <ArrowLeft className="size-3.5" />}
            <span>{t("details.backToCourses")}</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {course.title}
            </h1>
            {!course.isDraft ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-success-bg text-success shadow-xs">
                {t("status.published")}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning-bg text-warning">
                {t("status.draft")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={`/${locale}/dashboard/courses/${course.id}/edit`}>
              <Pencil className="size-4" />
              <span>{t("details.editCourse")}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Grid: Overview & Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Banner Image & Info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/60 bg-muted shadow-xs">
            <Image
              src={course.coverImage}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 text-white">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-primary text-primary-foreground">
                  {course.grade}
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-black/60 backdrop-blur-xs">
                  {course.subject}
                </span>
              </div>
              <div className="text-lg font-bold">
                {formatPrice(course.price, course.currency, course.isFree)}
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <DashboardCard className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">{t("details.overview")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>

            {/* Preview Video if available */}
            {course.previewVideoLink && (
              <div className="pt-2 border-t border-border/40">
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-foreground">
                  <PlayCircle className="size-4 text-primary" />
                  <span>{t("details.previewVideo")}</span>
                </div>
                <a
                  href={course.previewVideoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-primary hover:underline font-medium"
                >
                  {course.previewVideoLink}
                </a>
              </div>
            )}
          </DashboardCard>

          {/* Sections & Content Breakdown */}
          <DashboardCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {t("details.sectionsAndContent")}
              </h2>
              <div className="text-xs text-muted-foreground font-medium">
                {t("details.totalSections", { count: totalSections })} •{" "}
                {t("details.totalLessons", { count: totalLessons })} •{" "}
                {t("details.totalExams", { count: totalExams })}
              </div>
            </div>

            {course.sections.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
                {t("details.noSections")}
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-3">
                {course.sections.map((section, idx) => (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className="border border-border/60 rounded-xl px-4 py-1 bg-muted/20"
                  >
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-start gap-2 pe-4">
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-foreground text-sm">{section.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {section.isLinkedToExam && (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-primary/5 text-primary border-primary/20"
                            >
                              {t("details.linkedExamBadge")}
                            </Badge>
                          )}
                          {section.isRequiredPassExamForNextSection && (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            >
                              {t("details.requiredPassBadge")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-3 border-t border-border/40 mt-2">
                      {/* Lessons List */}
                      {section.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-background border border-border/40 gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="size-4 text-primary shrink-0" />
                            <span className="text-xs font-semibold text-foreground">
                              {lesson.title}
                            </span>
                          </div>
                          {lesson.lectureVideoLink && (
                            <a
                              href={lesson.lectureVideoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                            >
                              <Video className="size-3.5" />
                              <span>{t("details.watchVideo")}</span>
                            </a>
                          )}
                        </div>
                      ))}

                      {/* Section Exam if present */}
                      {section.linkedExam && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-primary">
                            <div className="flex items-center gap-1.5">
                              <FileText className="size-4" />
                              <span>{section.linkedExam.examContent.title}</span>
                            </div>
                            <span>
                              {t("details.questionsCount", {
                                count: section.linkedExam.examContent.questions.length,
                              })}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground flex gap-4 pt-1">
                            <span>
                              {t("details.passingScore", {
                                score: section.linkedExam.examContent.passingScore,
                              })}
                            </span>
                            <span>
                              {t("details.totalGrade", {
                                grade: section.linkedExam.examContent.totalGrade,
                              })}
                            </span>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </DashboardCard>
        </div>

        {/* Right 4 Cols: Meta Data Sidebar & Key Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              label={t("details.totalStudents")}
              value={course.numberOfParticipants}
              icon={<Users className="size-4 text-primary" />}
            />
            <StatTile
              label={t("details.revenue")}
              value={`${(course.numberOfParticipants * course.price).toLocaleString()} ${t("card.egp")}`}
              icon={<DollarSign className="size-4 text-emerald-500" />}
            />
          </div>

          {/* Course Attributes Metadata */}
          <DashboardCard className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border/40 pb-2">
              {t("details.overview")}
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <User className="size-3.5 text-primary" />
                  {t("details.teacher")}
                </span>
                <span className="font-semibold text-foreground">{course.teacherName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <GraduationCap className="size-3.5 text-primary" />
                  {t("details.grade")}
                </span>
                <span className="font-semibold text-foreground">{course.grade}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <BookOpen className="size-3.5 text-primary" />
                  {t("details.subject")}
                </span>
                <span className="font-semibold text-foreground">{course.subject}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="size-3.5 text-primary" />
                  {t("details.period")}
                </span>
                <span className="font-semibold text-foreground">
                  {t(`period.${course.period}`)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Globe className="size-3.5 text-primary" />
                  {t("details.venue")}
                </span>
                <span className="font-semibold text-foreground">
                  {course.venue === "all"
                    ? t("venue.all")
                    : course.venue === "online"
                      ? t("venue.online")
                      : t("venue.center")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="size-3.5 text-primary" />
                  {t("details.timeLimit")}
                </span>
                <span className="font-semibold text-foreground">
                  {course.hasTimeLimit && course.timeLimitValue
                    ? t("details.timeLimitDays", { days: course.timeLimitValue })
                    : t("details.noTimeLimit")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="size-3.5 text-primary" />
                  {t("details.groupsSplit")}
                </span>
                <span className="font-semibold text-foreground">
                  {course.isSplitToGroups
                    ? t("details.groupsSplitYes")
                    : t("details.groupsSplitNo")}
                </span>
              </div>

              {course.hasOffer && course.offerPercentage && (
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Sparkles className="size-3.5 text-amber-500" />
                    {t("details.offerLabel")}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {course.offerPercentage}
                  </span>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
