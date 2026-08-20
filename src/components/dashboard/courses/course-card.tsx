"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course } from "@/types/course";
import {
  Barcode,
  BookOpen,
  Globe,
  Globe2,
  House,
  MoreVertical,
  Pencil,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
  copiedId?: string | null;
  onPublishToggle?: (courseId: string) => void;
  onCopyLink?: (courseId: string) => void;
  onDeleteRequest?: (course: Course) => void;
  mode?: "dashboard" | "student";
  enrollHref?: string;
  isEnrolled?: boolean;
}

export function CourseCard({
  course,
  copiedId: _copiedId = null,
  onPublishToggle,
  onCopyLink: _onCopyLink,
  onDeleteRequest,
  mode = "dashboard",
  enrollHref,
  isEnrolled = false,
}: CourseCardProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("courses");
  const tNew = useTranslations("courses.new");
  const tStudent = useTranslations("studentDashboard.latestCourses");

  const formatGrade = (gradeKey: string) => {
    return tNew.has(`grades.${gradeKey}` as Parameters<typeof tNew.has>[0])
      ? tNew(`grades.${gradeKey}` as Parameters<typeof tNew>[0])
      : gradeKey;
  };

  // Format currency
  const formatPrice = (price: number, currency: string, isFree: boolean) => {
    if (isFree || price === 0) {
      return t("card.free");
    }
    return `${price.toLocaleString(isAr ? "ar-EG" : "en-US")} ${isAr ? (currency === "EGP" ? t("card.egp") : currency) : currency}`;
  };

  return (
    <div className="group flex flex-col bg-card rounded-xl border border-border/60 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      {/* Cover Image Container with Badge */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={course.coverImage}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20" />

        {/* Status Badge on top-start (hidden in student mode) */}
        {mode !== "student" && (
          <div className="absolute top-2.5 inset-s-2.5">
            {!course.isDraft ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-success-bg text-success shadow-xs">
                {t("status.published")}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning-bg text-warning backdrop-blur-xs">
                {t("status.draft")}
              </span>
            )}
          </div>
        )}

        {/* Venue Badge on top-end */}
        <div className="absolute top-2.5 inset-e-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-white backdrop-blur-xs">
            {course.venue === "online" ? (
              <Globe className="h-3 w-3" />
            ) : course.venue === "center" ? (
              <House className="h-3 w-3" />
            ) : (
              <Globe2 className="h-3 w-3" />
            )}
            {course.venue === "all"
              ? t("venue.all")
              : course.venue === "online"
                ? t("venue.online")
                : t("venue.center")}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Grade */}
        <div className="text-xs font-semibold text-primary/80 mb-1">
          {formatGrade(course.grade)}
        </div>

        {/* Course Title */}
        <h3 className="font-bold text-foreground line-clamp-2 text-base leading-snug mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Teacher Info */}
        {course.teacherName && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 truncate">
            <User className="size-3.5 text-primary/70 shrink-0" />
            <span className="font-medium truncate">{course.teacherName}</span>
          </div>
        )}

        {/* Info Row */}
        <div className="mt-auto pt-3 border-t border-border/40 flex flex-row gap-1 justify-between text-xs text-muted-foreground">
          {/* 1. Students Enrolled */}
          <div
            className="flex items-center gap-1.5 truncate"
            title={t("card.students", { count: course.numberOfParticipants })}
          >
            <Users className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate font-medium">
              {t("card.students", { count: course.numberOfParticipants })}
            </span>
          </div>

          {/* 2. Number of Lessons */}
          <div
            className="flex items-center gap-1.5 truncate"
            title={t("card.lessons", { count: course.numberOfLessons })}
          >
            <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate font-medium">
              {t("card.lessonsShort", { count: course.numberOfLessons })}
            </span>
          </div>

          {/* 3. Formatted Price (only for dashboard mode to avoid duplicate in student mode) */}
          {mode !== "student" && (
            <div className="flex items-center justify-end font-bold text-foreground truncate">
              <span>{formatPrice(course.price, course.currency, course.isFree)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons Row */}
        {mode === "student" ? (
          <div className="flex items-center justify-between gap-3 mt-4 pt-1">
            <Button
              asChild
              variant={isEnrolled ? "outline" : "default"}
              size="sm"
              className={
                isEnrolled
                  ? "w-full font-bold text-sm py-3.5! cursor-pointer border border-primary! text-primary hover:text-primary"
                  : "flex-1 font-bold text-sm py-3.5! cursor-pointer shadow-xs"
              }
            >
              <Link href={enrollHref || `/student-dashboard/courses/${course.id}`}>
                {isEnrolled ? tStudent("goToCourse") : tStudent("enrollNow")}
              </Link>
            </Button>
            {!isEnrolled && (
              <div className="font-bold text-sm sm:text-base text-foreground shrink-0">
                {formatPrice(course.price, course.currency, course.isFree)}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-4 pt-1">
            {!course.isDraft ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 font-bold text-sm border border-primary! text-primary hover:text-primary py-3.5! cursor-pointer"
              >
                <Link href={`/${locale}/dashboard/courses/${course.id}/edit`}>
                  {t("card.edit")}
                </Link>
              </Button>
            ) : (
              <Button
                onClick={() => onPublishToggle?.(course.id)}
                size="sm"
                className="flex-1 font-bold text-sm py-3.5! cursor-pointer"
              >
                {t("card.publishNow")}
              </Button>
            )}

            {/* Options Menu Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="shrink-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isAr ? "start" : "end"} className="min-w-40">
                {course.isDraft ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/dashboard/courses/${course.id}/edit`}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        <span>{t("card.edit")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteRequest?.(course)}
                      className="flex items-center gap-2 text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{t("card.delete")}</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/dashboard/courses/${course.id}/students`}
                        className="flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        <span>{t("card.viewStudents")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/dashboard/students/new?courseId=${course.id}`}
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>{t("card.addStudent")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/dashboard/courses/${course.id}/codes`}
                        className="flex items-center gap-2"
                      >
                        <Barcode className="h-4 w-4" />
                        <span>{t("card.viewActivationCodes")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteRequest?.(course)}
                      className="flex items-center gap-2 text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{t("card.delete")}</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
