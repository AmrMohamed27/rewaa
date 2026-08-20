"use client";

import { ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { QuestionFormContent } from "@/components/dashboard/questions/question-form-content";
import { Button } from "@/components/ui/button";
import { addStoredQuestion } from "@/lib/questions-storage";
import { Question } from "@/types/exam";

export function NewQuestionClient() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("questionsPage.newPage");

  const handleSave = (
    newQuestion: Question,
    _sectionId?: string,
    _keepOpen?: boolean,
    academicContext?: { grade?: string; subject?: string; teacherName?: string },
  ) => {
    addStoredQuestion(locale, newQuestion, {
      grade: academicContext?.grade,
      subject: academicContext?.subject,
      teacherName: academicContext?.teacherName,
    });

    router.push(`/${locale}/dashboard/questions`);
  };

  const handleCancel = () => {
    router.push(`/${locale}/dashboard/questions`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Row with Standard Round Back Button */}
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0">
          <Link href={`/${locale}/dashboard/questions`}>
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("subtitle")}</p>
        </div>
      </div>

      {/* Question Form Content with editable grade, subject, and teacherName */}
      <QuestionFormContent
        examGrade="grade1"
        examSubject="physics"
        examTeacherName=""
        allowEditableAcademicProps={true}
        onSave={handleSave}
        onCancel={handleCancel}
        submitLabel={t("saveQuestion")}
        cancelLabel={t("cancel")}
      />
    </div>
  );
}
