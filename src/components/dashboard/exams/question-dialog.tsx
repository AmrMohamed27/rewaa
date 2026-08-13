"use client";

import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionFormContent } from "@/components/dashboard/questions/question-form-content";
import { ExamSection, Question } from "@/types/exam";

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: ExamSection[];
  initialQuestion?: Question | null;
  initialSectionId?: string;
  examGrade?: string;
  examSubject?: string;
  examTeacherName?: string;
  onSave: (question: Question, sectionId: string, keepOpen?: boolean) => void;
}

export function QuestionDialog({
  open,
  onOpenChange,
  sections,
  initialQuestion,
  initialSectionId,
  examGrade,
  examSubject,
  examTeacherName,
  onSave,
}: QuestionDialogProps) {
  const t = useTranslations("exams.questionDialog");

  const handleSaveInternal = (question: Question, sectionId?: string, keepOpen?: boolean) => {
    onSave(question, sectionId || sections[0]?.id || "", keepOpen);
    if (!keepOpen) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialQuestion ? t("editQuestionTitle") : t("addQuestionTitle")}
          </DialogTitle>
          <DialogDescription>{t("dialogSubtitle")}</DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <QuestionFormContent
            initialQuestion={initialQuestion}
            sections={sections}
            initialSectionId={initialSectionId}
            examGrade={examGrade}
            examSubject={examSubject}
            examTeacherName={examTeacherName}
            onSave={handleSaveInternal}
            onCancel={() => onOpenChange(false)}
            showSaveAndAddAnother={!initialQuestion}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
