"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Course } from "@/types/course";

interface CourseBannerProps {
  course: Course;
}

export function CourseBanner({ course }: CourseBannerProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("courses");
  const tNew = useTranslations("courses.new");

  const formatGrade = (gradeKey: string) => {
    return tNew.has(`grades.${gradeKey}` as Parameters<typeof tNew.has>[0])
      ? tNew(`grades.${gradeKey}` as Parameters<typeof tNew>[0])
      : gradeKey;
  };

  const formatSubject = (subjectKey: string) => {
    return tNew.has(`subjects.${subjectKey}` as Parameters<typeof tNew.has>[0])
      ? tNew(`subjects.${subjectKey}` as Parameters<typeof tNew>[0])
      : subjectKey;
  };

  const formatPrice = (price: number, currency: string, isFree: boolean) => {
    if (isFree || price === 0) return t("card.free");
    return `${price.toLocaleString(isAr ? "ar-EG" : "en-US")} ${
      isAr ? (currency === "EGP" ? t("card.egp") : currency) : currency
    }`;
  };

  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/60 bg-muted shadow-xs">
      <Image src={course.coverImage} alt={course.title} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 text-white">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-md text-xs font-bold bg-primary text-primary-foreground">
            {formatGrade(course.grade)}
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-semibold bg-black/60 backdrop-blur-xs">
            {formatSubject(course.subject)}
          </span>
        </div>
        <div className="text-lg font-bold">
          {formatPrice(course.price, course.currency, course.isFree)}
        </div>
      </div>
    </div>
  );
}
