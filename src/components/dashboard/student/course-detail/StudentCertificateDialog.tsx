"use client";

import { Logo } from "@/components/landing/layout/logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthControllerGetProfile } from "@/hooks/use-auth";
import { Course } from "@/types/course";
import { Award, CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface StudentCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  studentName?: string;
  isFullyCompleted?: boolean;
}

export function StudentCertificateDialog({
  open,
  onOpenChange,
  course,
  studentName: initialStudentName,
  isFullyCompleted = true,
}: StudentCertificateDialogProps) {
  const t = useTranslations("studentDashboard.courseDetails.certificateModal");
  const tHero = useTranslations("studentDashboard.hero");
  const locale = useLocale();
  const isAr = locale === "ar";

  // Fetch logged in profile exactly as in ProfileDropdown / StudentHomeHero
  const { data } = useAuthControllerGetProfile({
    query: {
      staleTime: 1000 * 60 * 5,
    },
  });

  const user = data?.data;

  const resolvedFirstName =
    isAr && (user as Record<string, unknown>)?.firstNameAr
      ? String((user as Record<string, unknown>).firstNameAr)
      : user?.firstName || "";
  const resolvedLastName =
    isAr && (user as Record<string, unknown>)?.lastNameAr
      ? String((user as Record<string, unknown>).lastNameAr)
      : user?.lastName || "";
  const resolvedFullName =
    `${resolvedFirstName} ${resolvedLastName}`.trim() ||
    (typeof (user as Record<string, unknown>)?.name === "string"
      ? ((user as Record<string, unknown>).name as string)
      : "") ||
    user?.email ||
    "";

  const displayName = initialStudentName || resolvedFullName || tHero("defaultStudentName");

  const issueDate = new Intl.DateTimeFormat(isAr ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl min-w-[95vw] p-0 overflow-hidden border-border/80 bg-card rounded-2xl sm:rounded-3xl">
        {/* Certificate Header Banner */}
        <div className="relative bg-linear-to-r from-primary/95 via-primary to-primary/80 p-6 text-primary-foreground text-center">
          <div className="absolute top-3 right-3 text-primary-foreground/20">
            <Logo logoOnly width={64} height={64} className="size-16" />
          </div>
          <div className="relative inline-flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-xs mb-3 ring-4 ring-white/20">
            <Award className="size-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-primary-foreground/90 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            {t("description")}
          </DialogDescription>
        </div>

        {/* Certificate Body Container */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="relative rounded-2xl border-2 border-primary/20 bg-muted/20 p-6 sm:p-8 text-center space-y-5 shadow-inner">
            {/* App Logo */}
            <div className="flex items-center justify-center">
              <Logo
                brandName={isAr ? "منصة رواء التعليمية" : "Rewaa Academy"}
                width={36}
                height={36}
                brandNameClassName="text-base font-extrabold text-foreground"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                {t("recipientLabel")}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight underline decoration-primary/40 underline-offset-8">
                {displayName}
              </div>
            </div>

            <div className="pt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              <span className="font-semibold text-foreground">{t("courseLabel")}: </span>
              <span className="font-bold text-primary">{course.title}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/60 text-xs text-start">
              <div>
                <div className="text-muted-foreground">{t("instructorLabel")}</div>
                <div className="font-bold text-foreground mt-0.5">{course.teacherName}</div>
              </div>
              <div className="text-end">
                <div className="text-muted-foreground">{t("issueDateLabel")}</div>
                <div className="font-bold text-foreground mt-0.5">{issueDate}</div>
              </div>
            </div>

            {/* Official Badge Stamp */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold mt-2">
              <CheckCircle2 className="size-4" />
              <span>{isFullyCompleted ? t("verified") : t("previewCertificate")}</span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <DialogFooter className="p-4 sm:p-6 bg-muted/30 border-t border-border/60 gap-2 flex-row justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
