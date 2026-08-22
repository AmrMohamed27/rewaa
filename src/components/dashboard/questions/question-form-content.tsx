/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  BookOpen,
  Check,
  CheckCircle2,
  FileText,
  GraduationCap,
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
import { FormSectionCard } from "@/components/ui/form-section-card";
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
import { GradeSelect, SubjectSelect, TeacherSelect } from "@/components/ui/academic-selects";
import { SelectWithAdd } from "@/components/ui/select-with-add";
import {
  getStoredCustomQuestionKinds,
  saveStoredCustomQuestionKind,
  getStoredCustomSections,
  saveStoredCustomSection,
} from "@/lib/custom-categories-storage";
import { cn } from "@/lib/utils";
import { getStoredTeachers } from "@/lib/settings-storage";
import { Teacher } from "@/types/settings";
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
    academicContext?: { grade?: string; subject?: string; teacherName?: string },
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

  const [availableTeachers, setAvailableTeachers] = React.useState<Teacher[]>([]);

  React.useEffect(() => {
    const loadTeachers = () => {
      setAvailableTeachers(getStoredTeachers());
    };
    loadTeachers();
    window.addEventListener("rewaa_teachers_updated", loadTeachers);
    return () => window.removeEventListener("rewaa_teachers_updated", loadTeachers);
  }, []);

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
  const [answerExplanation, setAnswerExplanation] = React.useState<string>(
    initialQuestion?.answerExplanation || "",
  );
  // Custom question kinds state
  const [customQuestionKinds, setCustomQuestionKinds] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [customSectionsList, setCustomSectionsList] = React.useState<
    Array<{ id: string; name: string }>
  >([]);

  React.useEffect(() => {
    const loadCustomData = () => {
      setCustomQuestionKinds(getStoredCustomQuestionKinds());
      setCustomSectionsList(getStoredCustomSections());
    };
    loadCustomData();
    window.addEventListener("rewaa_custom_categories_updated", loadCustomData);
    window.addEventListener("rewaa_question_kinds_updated", loadCustomData);
    window.addEventListener("rewaa_custom_sections_updated", loadCustomData);
    return () => {
      window.removeEventListener("rewaa_custom_categories_updated", loadCustomData);
      window.removeEventListener("rewaa_question_kinds_updated", loadCustomData);
      window.removeEventListener("rewaa_custom_sections_updated", loadCustomData);
    };
  }, []);

  const handleAddQuestionKind = (name: string) => {
    saveStoredCustomQuestionKind(name);
  };

  const handleAddSection = (name: string) => {
    saveStoredCustomSection(name);
  };

  // Build combined question kinds options
  const defaultQuestionKindOptions = [
    { value: "theoretical", label: t("kinds.theoretical") },
    { value: "practical", label: t("kinds.practical") },
    { value: "application-based", label: t("kinds.applicationBased") },
    { value: "analytical", label: t("kinds.analytical") },
    { value: "oral", label: t("kinds.oral") },
    { value: "skill-based", label: t("kinds.skillBased") },
  ];

  const allQuestionKindOptions = [
    ...defaultQuestionKindOptions,
    ...customQuestionKinds
      .filter(
        (k) => !defaultQuestionKindOptions.some((d) => d.value === k.id || d.label === k.name),
      )
      .map((k) => ({ value: k.id, label: k.name })),
  ];

  // Build combined sections options
  const combinedSections = [
    ...(sections || []).map((s) => ({ value: s.id, label: s.title })),
    ...customSectionsList
      .filter((cs) => !(sections || []).some((s) => s.id === cs.id || s.title === cs.name))
      .map((cs) => ({ value: cs.id, label: cs.name })),
  ];

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

  const isAcademicValid =
    !allowEditableAcademicProps ||
    (Boolean(selectedGrade) && Boolean(selectedSubject) && Boolean(teacherNameInput.trim()));

  const isValid =
    Boolean(questionName.trim()) &&
    Boolean(questionContent.trim()) &&
    Boolean(questionType) &&
    Boolean(difficulty) &&
    isAcademicValid;

  const handleSaveInternal = (keepOpen: boolean = false) => {
    if (!isValid) return;

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
      {/* 1. Question Type Selection */}
      <FormSectionCard title={t("questionTypeSelector")} icon={ListOrdered}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setType("mcq");
              setModelAnswer("");
            }}
            className={cn(
              "p-4 rounded-xl border text-start transition-all cursor-pointer flex flex-col gap-1.5",
              type === "mcq"
                ? "border-primary bg-primary/10 ring-2 ring-primary/20 font-bold"
                : "border-border bg-card hover:bg-muted/40",
            )}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <ListOrdered className="size-4 text-primary" />
              <span>{t("types.mcq")}</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setType("true/false");
              setModelAnswer("true");
            }}
            className={cn(
              "p-4 rounded-xl border text-start transition-all cursor-pointer flex flex-col gap-1.5",
              type === "true/false"
                ? "border-primary bg-primary/10 ring-2 ring-primary/20 font-bold"
                : "border-border bg-card hover:bg-muted/40",
            )}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <HelpCircle className="size-4 text-primary" />
              <span>{t("types.trueFalse")}</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setType("text");
              setModelAnswer("");
            }}
            className={cn(
              "p-4 rounded-xl border text-start transition-all cursor-pointer flex flex-col gap-1.5",
              type === "text"
                ? "border-primary bg-primary/10 ring-2 ring-primary/20 font-bold"
                : "border-border bg-card hover:bg-muted/40",
            )}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <FileText className="size-4 text-primary" />
              <span>{t("types.text")}</span>
            </div>
          </button>
        </div>
      </FormSectionCard>

      {/* 2. Basic Information Group */}
      <FormSectionCard title={t("basicInfoGroup")} icon={BookOpen} contentClassName="space-y-4">
        {/* Target Section Selection if sections provided */}
        {(sections && sections.length > 0) || combinedSections.length > 0 ? (
          <div className="pb-2 border-b border-border/40">
            <SelectWithAdd
              value={sectionId}
              onValueChange={setSectionId}
              label={t("targetSection")}
              placeholder={t("selectSectionPlaceholder")}
              options={combinedSections}
              allowAdd
              onAddNewOption={handleAddSection}
              addDialogTitle="إضافة قسم جديد"
              addInputLabel="اسم القسم"
              addInputPlaceholder="مثال: القسم الأول - الأسئلة التمهيدية"
            />
          </div>
        ) : null}

        {/* Question Name / Title */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="q-name" className="text-sm font-medium text-foreground">
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="q-content" className="text-sm font-medium text-foreground">
            {t("questionContent")} <span className="text-destructive">*</span>
          </Label>
          <FormMarkdownEditor
            value={questionContent}
            onChange={setQuestionContent}
            placeholder={t("questionContentPlaceholder")}
          />
        </div>

        {/* Question Kind Classification & Difficulty Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectWithAdd
            value={questionType}
            onValueChange={(v) => setQuestionType(v as QuestionKind)}
            label={t("questionKind")}
            required
            options={allQuestionKindOptions}
            allowAdd
            onAddNewOption={handleAddQuestionKind}
            addDialogTitle="إضافة تصنيف / نوع سؤال جديد"
            addInputLabel="نوع / تصنيف السؤال"
            addInputPlaceholder="مثال: تطبيقي متقدم"
          />

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <span>{t("difficulty")}</span>
              <span className="text-destructive">*</span>
            </Label>
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
          <div className="flex flex-col gap-2 pt-1 animate-in fade-in slide-in-from-top-1">
            <Label className="text-sm font-medium text-foreground">{t("explanationContent")}</Label>
            <FormMarkdownEditor
              value={answerExplanation}
              onChange={setAnswerExplanation}
              placeholder={t("explanationPlaceholder")}
            />
          </div>
        )}
      </FormSectionCard>

      {/* 3. Academic Context Info Group */}
      {allowEditableAcademicProps && (
        <FormSectionCard
          title={allowEditableAcademicProps ? tNew("academicGroupTitle") : t("autoFilledHeader")}
          icon={GraduationCap}
        >
          {allowEditableAcademicProps ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GradeSelect
                value={selectedGrade}
                onValueChange={setSelectedGrade}
                label={tNew("selectGrade")}
                placeholder={tNew("selectGradePlaceholder")}
                required
              />
              <SubjectSelect
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                label={tNew("selectSubject")}
                placeholder={tNew("selectSubjectPlaceholder")}
                required
              />
              <TeacherSelect
                value={teacherNameInput}
                onValueChange={setTeacherNameInput}
                label={tNew("teacherName")}
                placeholder={tNew("teacherNamePlaceholder")}
                teachers={availableTeachers}
                required
              />
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
        </FormSectionCard>
      )}

      {/* 4. Question Requirements (Grade & Answer specifics) */}
      <FormSectionCard
        title={t("requirementsGroup")}
        icon={CheckCircle2}
        contentClassName="space-y-4"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="q-grade" className="text-sm font-medium text-foreground">
            {t("gradePoints")}
          </Label>
          <Input
            id="q-grade"
            type="number"
            min={1}
            max={100}
            className="w-24 h-9 text-center text-xs font-semibold"
            value={grade}
            onChange={(e) => setGrade(parseInt(e.target.value, 10) || 1)}
          />
        </div>

        {/* True / False Selection */}
        {type === "true/false" && (
          <div className="space-y-2 pt-2">
            <Label className="font-semibold text-xs text-foreground">
              {t("selectCorrectTrueFalse")}
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setModelAnswer("true")}
                className={cn(
                  "py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer",
                  modelAnswer === "true"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-2xs"
                    : "bg-card border-input hover:border-emerald-500/40 text-muted-foreground",
                )}
              >
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>{t("trueOption")}</span>
              </button>

              <button
                type="button"
                onClick={() => setModelAnswer("false")}
                className={cn(
                  "py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer",
                  modelAnswer === "false"
                    ? "bg-destructive/10 border-destructive text-destructive shadow-2xs"
                    : "bg-card border-input hover:border-destructive/40 text-muted-foreground",
                )}
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
              <Label className="font-semibold text-xs text-foreground">
                {t("mcqChoicesLabel")}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="h-8 text-xs gap-1.5"
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
                    className={cn(
                      "size-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors cursor-pointer",
                      modelAnswer === opt.id
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-card border-input hover:border-emerald-500/50 text-muted-foreground",
                    )}
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
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
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
            <Label className="font-semibold text-xs text-foreground">{t("modelAnswerLabel")}</Label>
            <FormMarkdownEditor
              value={modelAnswer}
              onChange={setModelAnswer}
              placeholder={t("modelAnswerPlaceholder")}
            />
          </div>
        )}
      </FormSectionCard>

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
            disabled={!isValid}
          >
            {t("actions.saveAndAddAnother")}
          </Button>
        )}

        <Button
          type="button"
          onClick={() => handleSaveInternal(false)}
          disabled={!isValid}
          className="font-semibold min-w-32"
        >
          {submitLabel || (initialQuestion ? t("actions.saveChanges") : t("actions.saveQuestion"))}
        </Button>
      </div>
    </div>
  );
}
