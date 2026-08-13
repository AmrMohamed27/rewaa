/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Pencil,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownViewer } from "@/components/ui/markdown-viewer";
import { getQuestionById, QuestionWithContext } from "@/lib/questions-storage";
import { QuestionDifficulty, QuestionKind } from "@/types/exam";
import { DashboardCard } from "../overview/dashboard-card";

interface QuestionDetailsClientProps {
  questionId: string;
}

const DIFFICULTY_COLORS: Record<QuestionDifficulty, string> = {
  easy: "bg-green-100 text-green-700 border-green-300/40",
  medium: "bg-amber-100 text-amber-700 border-amber-300/40",
  hard: "bg-red-100 text-red-700 border-red-300/40",
};

export function QuestionDetailsClient({ questionId }: QuestionDetailsClientProps) {
  const locale = useLocale();
  const t = useTranslations("questionsPage.details");
  const tExams = useTranslations("exams");
  const tGrades = useTranslations("courses.new.grades");
  const tSubjects = useTranslations("courses.new.subjects");

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
        <h2 className="text-xl font-bold text-foreground">{t("notFoundTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("notFoundDesc")}</p>
        <Button asChild variant="outline">
          <Link href={`/${locale}/dashboard/questions`}>
            <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
            {t("backToQuestions")}
          </Link>
        </Button>
      </div>
    );
  }

  const formatGrade = (g?: string) => {
    if (!g) return "";
    try {
      return tGrades(g);
    } catch {
      return g;
    }
  };

  const formatSubject = (s?: string) => {
    if (!s) return "";
    try {
      return tSubjects(s);
    } catch {
      return s;
    }
  };

  const formatType = (type: string) => {
    if (type === "mcq") return tExams("questionDialog.types.mcq");
    if (type === "true/false") return tExams("questionDialog.types.trueFalse");
    return tExams("questionDialog.types.text");
  };

  const formatDifficulty = (d: QuestionDifficulty) => tExams(`questionDialog.difficulties.${d}`);

  const formatKind = (k: QuestionKind) =>
    tExams(`questionDialog.kinds.${k === "application-based" ? "applicationBased" : k}`);

  const isRtl = locale === "ar";

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header Row with Standard Round Back Button ──────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0">
            <Link href={`/${locale}/dashboard/questions`}>
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {question.questionName}
              </h1>
              <Badge
                variant="outline"
                className={`text-xs font-semibold ${DIFFICULTY_COLORS[question.difficulty]}`}
              >
                {formatDifficulty(question.difficulty)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {formatType(question.type)}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span>
                {[formatSubject(question.subject), formatGrade(question.academicGrade)]
                  .filter(Boolean)
                  .join(" • ")}
              </span>
              <span>•</span>
              <span className="font-medium text-foreground">{question.teacherName}</span>
            </p>
          </div>
        </div>

        {/* Action Button: Edit Question */}
        <Button
          asChild
          size="default"
          className="gap-2 shrink-0 self-start sm:self-auto shadow-xs font-semibold"
        >
          <Link href={`/${locale}/dashboard/questions/${question.id}/edit`}>
            <Pencil className="h-4 w-4" />
            <span>{t("editQuestion")}</span>
          </Link>
        </Button>
      </div>

      {/* ── Main 2-Column Grid (8 Cols / 4 Cols) ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Prompt & Content Card */}
          <DashboardCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>{t("contentTitle")}</span>
              </h2>
              <Badge
                variant="outline"
                className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              >
                {t("pointsValue", { count: question.grade || 1 })}
              </Badge>
            </div>

            <div className="text-sm text-foreground/90 leading-relaxed">
              <MarkdownViewer content={question.questionContent} isRtl={isRtl} />
            </div>

            {/* MCQ Options Choices */}
            {question.type === "mcq" && question.options && question.options.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-border/40">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("optionsHeader")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question.options.map((opt, idx) => {
                    const isCorrect = opt.id === question.modelAnswer;
                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                          isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 font-semibold shadow-2xs"
                            : "bg-muted/20 border-border/50 text-foreground/80"
                        }`}
                      >
                        <span
                          className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCorrect
                              ? "bg-emerald-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCorrect ? <CheckCircle2 className="size-3.5" /> : idx + 1}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Non-MCQ Model Answer Display */}
            {question.type !== "mcq" && question.modelAnswer && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 space-y-1.5 pt-3">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800 text-sm">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  {t("modelAnswer")}:
                </span>
                <p className="font-medium leading-relaxed">
                  {question.type === "true/false"
                    ? question.modelAnswer === "true"
                      ? t("trueValue")
                      : t("falseValue")
                    : question.modelAnswer}
                </p>
              </div>
            )}
          </DashboardCard>

          {/* Explanation Card if present */}
          {question.hasAnswerExplanation && question.answerExplanation && (
            <DashboardCard className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-base border-b border-border/60 pb-3">
                <Sparkles className="size-4" />
                <span>{t("explanationTitle")}</span>
              </div>
              <div className="text-xs text-foreground/90 leading-relaxed pt-1">
                <MarkdownViewer content={question.answerExplanation} isRtl={isRtl} />
              </div>
            </DashboardCard>
          )}
        </div>

        {/* Right Column (4 Cols - Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metrics Card */}
          <DashboardCard className="p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground border-b border-border/60 pb-3">
              {t("statsTitle")}
            </h2>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-1 text-center">
              <span className="text-xs text-muted-foreground block">
                {tExams("table.columns.timesUsed")}
              </span>
              <span className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                <RefreshCw className="size-5 text-amber-500" />
                {question.timesUsed || 1}
              </span>
            </div>
          </DashboardCard>

          {/* Metadata Card */}
          <DashboardCard className="p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground border-b border-border/60 pb-3">
              {t("metadataTitle")}
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{t("teacher")}</span>
                <span className="font-semibold text-foreground">{question.teacherName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{t("subject")}</span>
                <span className="font-semibold text-foreground">
                  {formatSubject(question.subject)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{t("grade")}</span>
                <span className="font-semibold text-foreground">
                  {formatGrade(question.academicGrade)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{t("type")}</span>
                <span className="font-semibold text-foreground">{formatType(question.type)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{t("kind")}</span>
                <span className="font-semibold text-foreground">
                  {formatKind(question.questionType)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{t("difficulty")}</span>
                <span className="font-semibold text-foreground">
                  {formatDifficulty(question.difficulty)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{t("points")}</span>
                <span className="font-semibold text-foreground">
                  {t("pointsValue", { count: question.grade || 1 })}
                </span>
              </div>

              {question.examId && (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">{t("linkedExam")}</span>
                  <Link
                    href={`/${locale}/dashboard/exams/${question.examId}`}
                    className="font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="size-3" />
                    <span>{question.examTitle || question.examId}</span>
                  </Link>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
