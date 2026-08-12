"use client";

import { BookOpen, FileText, Video } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "../overview/dashboard-card";
import { Course } from "@/types/course";

interface CourseSectionsProps {
  course: Course;
}

export function CourseSections({ course }: CourseSectionsProps) {
  const t = useTranslations("courses");

  const totalSections = course.sections.length;
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalExams = course.sections.reduce(
    (acc, s) => acc + (s.linkedExam ? 1 : 0) + s.tests.length,
    0,
  );

  return (
    <DashboardCard className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{t("details.sectionsAndContent")}</h2>
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
                      <span className="text-xs font-semibold text-foreground">{lesson.title}</span>
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
  );
}
