/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Check,
  CheckCircle2,
  FileText,
  HelpCircle,
  ListOrdered,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormMarkdownEditor } from "@/components/ui/form-markdown-editor";
import { FormToggleSetting } from "@/components/ui/form-toggle-setting";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExamSection,
  MCQOption,
  Question,
  QuestionDifficulty,
  QuestionKind,
  QuestionType,
} from "@/types/exam";

export interface QuestionFormContentProps {
  initialQuestion?: Question | null;
  sections?: ExamSection[];
  initialSectionId?: string;
  examGrade?: string;
  examSubject?: string;
  examTeacherName?: string;
  allowEditableAcademicProps?: boolean;
  onSave: (
    question: Question,
    sectionId?: string,
    keepOpen?: boolean,
    academicContext?: { examId?: string; grade?: string; subject?: string; teacherName?: string },
  ) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  showSaveAndAddAnother?: boolean;
}

export function QuestionFormContent({
  initialQuestion,
  sections,
  initialSectionId,
  examGrade,
  examSubject,
  examTeacherName,
  allowEditableAcademicProps = false,
  onSave,
  onCancel,
  submitLabel,
  cancelLabel,
  showSaveAndAddAnother = false,
}: QuestionFormContentProps) {
  const t = useTranslations("exams.questionDialog");
  const tNew = useTranslations("questionsPage.newPage");
  const tGrades = useTranslations("courses.new.grades");
  const tSubjects = useTranslations("courses.new.subjects");

  const [sectionId, setSectionId] = React.useState<string>(
    initialSectionId || (sections && sections[0]?.id ? sections[0].id : ""),
  );

  // Academic Context State when editable
  const [selectedGrade, setSelectedGrade] = React.useState<string>(examGrade || "grade1");
  const [selectedSubject, setSelectedSubject] = React.useState<string>(examSubject || "physics");
  const [teacherNameInput, setTeacherNameInput] = React.useState<string>(examTeacherName || "");

  // Input groups state
  const [type, setType] = React.useState<QuestionType>(initialQuestion?.type || "mcq");
  const [questionName, setQuestionName] = React.useState(initialQuestion?.questionName || "");
  const [questionContent, setQuestionContent] = React.useState(
    initialQuestion?.questionContent || "",
  );
  const [questionType, setQuestionType] = React.useState<QuestionKind>(
    initialQuestion?.questionType || "theoretical",
  );
  const [difficulty, setDifficulty] = React.useState<QuestionDifficulty>(
    initialQuestion?.difficulty || "medium",
  );
  const [grade, setGrade] = React.useState<number>(initialQuestion?.grade ?? 1);
  const [hasAnswerExplanation, setHasAnswerExplanation] = React.useState<boolean>(
    initialQuestion?.hasAnswerExplanation ?? false,
  );
  const [answerExplanation, setAnswerExplanation] = React.useState(
    initialQuestion?.answerExplanation || "",
  );

  // Requirements & Answers
  const [modelAnswer, setModelAnswer] = React.useState(initialQuestion?.modelAnswer || "");
  const [options, setOptions] = React.useState<MCQOption[]>(
    initialQuestion?.options || [
      { id: "opt-1", text: "" },
      { id: "opt-2", text: "" },
    ],
  );

  React.useEffect(() => {
    if (initialQuestion) {
      setType(initialQuestion.type);
      setQuestionName(initialQuestion.questionName);
      setQuestionContent(initialQuestion.questionContent);
      setQuestionType(initialQuestion.questionType);
      setDifficulty(initialQuestion.difficulty);
      setGrade(initialQuestion.grade ?? 1);
      setHasAnswerExplanation(initialQuestion.hasAnswerExplanation);
      setAnswerExplanation(initialQuestion.answerExplanation || "");
      setModelAnswer(initialQuestion.modelAnswer || "");
      setOptions(
        initialQuestion.options || [
          { id: "opt-1", text: "" },
          { id: "opt-2", text: "" },
        ],
      );
    }
  }, [initialQuestion]);

  const handleAddOption = () => {
    setOptions((prev) => [...prev, { id: `opt-${Date.now()}`, text: "" }]);
  };

  const handleUpdateOption = (id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  const handleDeleteOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((o) => o.id !== id));
    if (modelAnswer === id) setModelAnswer("");
  };

  const resetFormForNext = () => {
    setQuestionName("");
    setQuestionContent("");
    setModelAnswer("");
    setHasAnswerExplanation(false);
    setAnswerExplanation("");
    setOptions([
      { id: `opt-${Date.now()}-1`, text: "" },
      { id: `opt-${Date.now()}-2`, text: "" },
    ]);
  };

  const handleSaveInternal = (keepOpen: boolean = false) => {
    if (!questionName.trim()) return;

    const questionData: Question = {
      id: initialQuestion?.id || `q-${Date.now()}`,
      questionName: questionName.trim(),
      questionContent: questionContent.trim(),
      type,
      questionType,
      difficulty,
      grade: Number(grade) || 1,
      required: true,
      hasAnswerExplanation,
      answerExplanation: hasAnswerExplanation ? answerExplanation : undefined,
      modelAnswer,
      options: type === "mcq" ? options : undefined,
    };

    onSave(questionData, sectionId || undefined, keepOpen, {
      grade: selectedGrade,
      subject: selectedSubject,
      teacherName: teacherNameInput.trim() || undefined,
    });

    if (keepOpen) {
      resetFormForNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Section Selection if sections provided */}
      {sections && sections.length > 0 && (
        <div className="space-y-2">
          <Label className="font-semibold">{t("targetSection")}</Label>
          <Select value={sectionId} onValueChange={setSectionId}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectSectionPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {sections.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 1. Question Type Selection (Big Buttons with Icons & Titles) */}
      <div className="space-y-2">
        <Label className="font-semibold">{t("questionTypeSelector")}</Label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setType("mcq");
              setModelAnswer("");
            }}
            className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
              type === "mcq"
                ? "bg-primary/10 border-primary text-primary font-bold shadow-2xs"
                : "bg-card border-input hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <ListOrdered className="size-6 shrink-0" />
            <span className="text-xs">{t("types.mcq")}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setType("true/false");
              setModelAnswer("true");
            }}
            className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
              type === "true/false"
                ? "bg-primary/10 border-primary text-primary font-bold shadow-2xs"
                : "bg-card border-input hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <HelpCircle className="size-6 shrink-0" />
            <span className="text-xs">{t("types.trueFalse")}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setType("text");
              setModelAnswer("");
            }}
            className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
              type === "text"
                ? "bg-primary/10 border-primary text-primary font-bold shadow-2xs"
                : "bg-card border-input hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <FileText className="size-6 shrink-0" />
            <span className="text-xs">{t("types.text")}</span>
          </button>
        </div>
      </div>

      {/* 2. Basic Information Group */}
      <div className="space-y-4 border-t border-border/60 pt-4">
        <h3 className="text-sm font-bold text-foreground">{t("basicInfoGroup")}</h3>

        {/* Question Name / Title */}
        <div className="space-y-2">
          <Label htmlFor="q-name" className="font-semibold">
            {t("questionName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="q-name"
            value={questionName}
            onChange={(e) => setQuestionName(e.target.value)}
            placeholder={t("questionNamePlaceholder")}
          />
        </div>

        {/* Question Content Body */}
        <div className="space-y-2">
          <Label htmlFor="q-content" className="font-semibold">
            {t("questionContent")}
          </Label>
          <FormMarkdownEditor
            value={questionContent}
            onChange={setQuestionContent}
            placeholder={t("questionContentPlaceholder")}
          />
        </div>

        {/* Question Kind Classification & Difficulty Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold">{t("questionKind")}</Label>
            <Select value={questionType} onValueChange={(v) => setQuestionType(v as QuestionKind)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theoretical">{t("kinds.theoretical")}</SelectItem>
                <SelectItem value="practical">{t("kinds.practical")}</SelectItem>
                <SelectItem value="application-based">{t("kinds.applicationBased")}</SelectItem>
                <SelectItem value="analytical">{t("kinds.analytical")}</SelectItem>
                <SelectItem value="oral">{t("kinds.oral")}</SelectItem>
                <SelectItem value="skill-based">{t("kinds.skillBased")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">{t("difficulty")}</Label>
            <Select
              value={difficulty}
              onValueChange={(v) => setDifficulty(v as QuestionDifficulty)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">{t("difficulties.easy")}</SelectItem>
                <SelectItem value="medium">{t("difficulties.medium")}</SelectItem>
                <SelectItem value="hard">{t("difficulties.hard")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Answer Explanation Toggle */}
        <FormToggleSetting
          id="explanation-toggle"
          title={t("hasExplanationTitle")}
          subtitle={t("hasExplanationSubtitle")}
          checked={hasAnswerExplanation}
          onCheckedChange={setHasAnswerExplanation}
        />

        {hasAnswerExplanation && (
          <div className="space-y-2 pt-1">
            <Label className="font-semibold">{t("explanationContent")}</Label>
            <FormMarkdownEditor
              value={answerExplanation}
              onChange={setAnswerExplanation}
              placeholder={t("explanationPlaceholder")}
            />
          </div>
        )}
      </div>

      {/* 3. Academic Context Info Group */}
      <div className="space-y-4 border-t border-border/60 pt-4 bg-muted/20 p-4 rounded-xl">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {allowEditableAcademicProps ? tNew("academicGroupTitle") : t("autoFilledHeader")}
        </h3>

        {allowEditableAcademicProps ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Grade Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{tNew("selectGrade")}</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="bg-background text-xs">
                  <SelectValue placeholder={tNew("selectGradePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade1">{tGrades("grade1")}</SelectItem>
                  <SelectItem value="grade2">{tGrades("grade2")}</SelectItem>
                  <SelectItem value="grade3">{tGrades("grade3")}</SelectItem>
                  <SelectItem value="university">{tGrades("university")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subject Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{tNew("selectSubject")}</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-background text-xs">
                  <SelectValue placeholder={tNew("selectSubjectPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physics">{tSubjects("physics")}</SelectItem>
                  <SelectItem value="chemistry">{tSubjects("chemistry")}</SelectItem>
                  <SelectItem value="mathematics">{tSubjects("mathematics")}</SelectItem>
                  <SelectItem value="biology">{tSubjects("biology")}</SelectItem>
                  <SelectItem value="arabic">{tSubjects("arabic")}</SelectItem>
                  <SelectItem value="english">{tSubjects("english")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Teacher Name Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{tNew("teacherName")}</Label>
              <Input
                value={teacherNameInput}
                onChange={(e) => setTeacherNameInput(e.target.value)}
                placeholder={tNew("teacherNamePlaceholder")}
                className="bg-background text-xs"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground block">{t("grade")}</span>
              <Badge variant="secondary" className="font-semibold">
                {(() => {
                  if (!examGrade) return t("notSet");
                  try {
                    return tGrades(examGrade);
                  } catch {
                    return examGrade;
                  }
                })()}
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground block">{t("subject")}</span>
              <Badge variant="secondary" className="font-semibold">
                {(() => {
                  if (!examSubject) return t("notSet");
                  try {
                    return tSubjects(examSubject);
                  } catch {
                    return examSubject;
                  }
                })()}
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground block">{t("teacher")}</span>
              <Badge variant="secondary" className="font-semibold">
                {examTeacherName || t("notSet")}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* 4. Question Requirements (Grade & Answer specifics) */}
      <div className="space-y-4 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">{t("requirementsGroup")}</h3>
          <div className="flex items-center gap-2">
            <Label htmlFor="q-grade" className="text-xs font-semibold">
              {t("gradePoints")}
            </Label>
            <Input
              id="q-grade"
              type="number"
              min={1}
              max={100}
              className="w-20 h-8 text-center text-xs"
              value={grade}
              onChange={(e) => setGrade(parseInt(e.target.value, 10) || 1)}
            />
          </div>
        </div>

        {/* True / False Selection */}
        {type === "true/false" && (
          <div className="space-y-2 pt-2">
            <Label className="font-semibold text-xs">{t("selectCorrectTrueFalse")}</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setModelAnswer("true")}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer ${
                  modelAnswer === "true"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-2xs"
                    : "bg-card border-input hover:border-emerald-500/40 text-muted-foreground"
                }`}
              >
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>{t("trueOption")}</span>
              </button>

              <button
                type="button"
                onClick={() => setModelAnswer("false")}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer ${
                  modelAnswer === "false"
                    ? "bg-destructive/10 border-destructive text-destructive shadow-2xs"
                    : "bg-card border-input hover:border-destructive/40 text-muted-foreground"
                }`}
              >
                <XCircle className="size-4 text-destructive" />
                <span>{t("falseOption")}</span>
              </button>
            </div>
          </div>
        )}

        {/* MCQ Options List */}
        {type === "mcq" && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-xs">{t("mcqChoicesLabel")}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="h-7 text-xs gap-1"
              >
                <Plus className="size-3.5" />
                <span>{t("addChoice")}</span>
              </Button>
            </div>

            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModelAnswer(opt.id)}
                    className={`size-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      modelAnswer === opt.id
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-card border-input hover:border-emerald-500/50 text-muted-foreground"
                    }`}
                    title={t("markAsCorrect")}
                  >
                    {modelAnswer === opt.id ? (
                      <Check className="size-4 stroke-3" />
                    ) : (
                      <span className="text-xs font-semibold">{idx + 1}</span>
                    )}
                  </button>

                  <Input
                    value={opt.text}
                    onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
                    placeholder={`${t("choicePlaceholder")} ${idx + 1}`}
                    className="text-xs"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    disabled={options.length <= 2}
                    onClick={() => handleDeleteOption(opt.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text Question Model Answer */}
        {type === "text" && (
          <div className="space-y-2 pt-2">
            <Label className="font-semibold text-xs">{t("modelAnswerLabel")}</Label>
            <FormMarkdownEditor
              value={modelAnswer}
              onChange={setModelAnswer}
              placeholder={t("modelAnswerPlaceholder")}
            />
          </div>
        )}
      </div>

      {/* Action Buttons Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelLabel || t("actions.cancel")}
          </Button>
        )}

        {showSaveAndAddAnother && (
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSaveInternal(true)}
            disabled={!questionName.trim()}
          >
            {t("actions.saveAndAddAnother")}
          </Button>
        )}

        <Button
          type="button"
          onClick={() => handleSaveInternal(false)}
          disabled={!questionName.trim()}
          className="font-semibold min-w-32"
        >
          {submitLabel || (initialQuestion ? t("actions.saveChanges") : t("actions.saveQuestion"))}
        </Button>
      </div>
    </div>
  );
}
