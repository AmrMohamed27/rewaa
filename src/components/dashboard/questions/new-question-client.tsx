/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionFormContent } from "@/components/dashboard/questions/question-form-content";
import { getStoredExams } from "@/lib/exams-storage";
import { addStoredQuestion } from "@/lib/questions-storage";
import { Exam, Question } from "@/types/exam";

export function NewQuestionClient() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("questionsPage.newPage");

  const [exams, setExams] = React.useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = React.useState<string>("none");

  React.useEffect(() => {
    const loadedExams = getStoredExams(locale);
    setExams(loadedExams);
  }, [locale]);

  const currentSelectedExam = exams.find((e) => e.id === selectedExamId);

  const handleSave = (
    newQuestion: Question,
    _sectionId?: string,
    _keepOpen?: boolean,
    academicContext?: { grade?: string; subject?: string; teacherName?: string },
  ) => {
    addStoredQuestion(locale, newQuestion, {
      examId: selectedExamId,
      grade: currentSelectedExam?.grade || academicContext?.grade,
      subject: currentSelectedExam?.subject || academicContext?.subject,
      teacherName: currentSelectedExam?.teacherName || academicContext?.teacherName,
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

      {/* Exam Selector Box */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="space-y-2">
          <Label className="font-bold text-sm">{t("selectExam")}</Label>
          <Select value={selectedExamId} onValueChange={setSelectedExamId}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={t("selectExamPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("noExam")}</SelectItem>
              {exams.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.title} ({e.teacherName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Question Form Content with editable grade, subject, and teacherName */}
        <QuestionFormContent
          examGrade={currentSelectedExam?.grade || "grade1"}
          examSubject={currentSelectedExam?.subject || "physics"}
          examTeacherName={currentSelectedExam?.teacherName || ""}
          allowEditableAcademicProps={selectedExamId === "none"}
          onSave={handleSave}
          onCancel={handleCancel}
          submitLabel={t("saveQuestion")}
          cancelLabel={t("cancel")}
        />
      </div>
    </div>
  );
}
