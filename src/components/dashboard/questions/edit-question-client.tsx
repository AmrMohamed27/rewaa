/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { QuestionFormContent } from "@/components/dashboard/questions/question-form-content";
import {
  getQuestionById,
  updateStoredQuestion,
  QuestionWithContext,
} from "@/lib/questions-storage";
import { Question } from "@/types/exam";

interface EditQuestionClientProps {
  questionId: string;
}

export function EditQuestionClient({ questionId }: EditQuestionClientProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("questionsPage.editPage");
  const tDetails = useTranslations("questionsPage.details");

  const [question, setQuestion] = React.useState<QuestionWithContext | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const found = getQuestionById(locale, questionId);
    setQuestion(found);
    setIsLoading(false);
  }, [questionId, locale]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading question details...
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">{tDetails("notFoundTitle")}</h2>
        <p className="text-sm text-muted-foreground">{tDetails("notFoundDesc")}</p>
        <Button asChild variant="outline">
          <Link href={`/${locale}/dashboard/questions`}>
            <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
            {tDetails("backToQuestions")}
          </Link>
        </Button>
      </div>
    );
  }

  const handleSave = (updated: Question) => {
    updateStoredQuestion(locale, updated);
    router.push(`/${locale}/dashboard/questions/${questionId}`);
  };

  const handleCancel = () => {
    router.push(`/${locale}/dashboard/questions/${questionId}`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Row with Standard Round Back Button */}
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0">
          <Link href={`/${locale}/dashboard/questions/${questionId}`}>
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

      {/* Main Question Form Card Container */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-6">
        <QuestionFormContent
          initialQuestion={question}
          examGrade={question.academicGrade}
          examSubject={question.subject}
          examTeacherName={question.teacherName}
          onSave={handleSave}
          onCancel={handleCancel}
          submitLabel={t("saveChanges")}
          cancelLabel={t("cancel")}
        />
      </div>
    </div>
  );
}
