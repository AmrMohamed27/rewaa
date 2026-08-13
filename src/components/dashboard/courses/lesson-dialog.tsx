/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormToggleSetting } from "@/components/ui/form-toggle-setting";
import { FormMarkdownEditor } from "@/components/ui/form-markdown-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CourseSection,
  Lesson,
  LessonAttachment,
  CourseVenue,
  LessonType,
  LessonPublishStatus,
} from "@/types/course";
import {
  Video,
  FileText,
  Upload,
  FileCheck,
  ImageIcon,
  GraduationCap,
  BookOpen,
  User,
  MapPin,
  Calendar,
  Lock,
  Trash2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ParentCourseContext {
  grade: string;
  subject: string;
  teacherName: string;
  venue: CourseVenue;
}

interface LessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: CourseSection[];
  initialLesson?: Lesson | null;
  initialSectionId?: string;
  parentCourseContext: ParentCourseContext;
  onSave: (sectionId: string, lesson: Lesson) => void;
}

// Mock backend exams list for selection
const MOCK_BACKEND_EXAMS = [
  { id: "exam-backend-101", title: "Comprehensive Physics Midterm Exam - الفصل الأول" },
  { id: "exam-backend-102", title: "Electricity & Ohm's Law Quiz - اختبار قصير" },
  { id: "exam-backend-103", title: "Kirchhoff's Laws Mastery Test - امتحان كيرشوف" },
  { id: "exam-backend-104", title: "General Mathematics & Calculus Exam - امتحان الرياضيات" },
];

export function LessonDialog({
  open,
  onOpenChange,
  sections,
  initialLesson,
  initialSectionId,
  parentCourseContext,
  onSave,
}: LessonDialogProps) {
  const t = useTranslations("courses.new.step2.addLessonDialog");
  const tCourses = useTranslations("courses");
  const tGrades = useTranslations("courses.new.grades");
  const tSubjects = useTranslations("courses.new.subjects");

  // Form State
  const [targetSectionId, setTargetSectionId] = useState("");
  const [type, setType] = useState<LessonType>("videoAndText");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lectureVideoLink, setLectureVideoLink] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");

  // Attachments and Exams
  const [hasPdfAttachments, setHasPdfAttachments] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<LessonAttachment[]>([]);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [hasImageAttachments, setHasImageAttachments] = useState(false);
  const [imageFiles, setImageFiles] = useState<LessonAttachment[]>([]);

  const [isLinkedToExam, setIsLinkedToExam] = useState(false);
  const [linkedExamId, setLinkedExamId] = useState("");
  const [isRequiredPassExam, setIsRequiredPassExam] = useState(false);

  // Organization and publish status
  const [venue, setVenue] = useState<CourseVenue>(parentCourseContext.venue || "all");
  const [publishStatus, setPublishStatus] = useState<LessonPublishStatus>("published");
  const [scheduledPublishDate, setScheduledPublishDate] = useState("");

  // Populate state on open / initialLesson change
  useEffect(() => {
    if (open) {
      if (initialLesson) {
        setType(initialLesson.type || (initialLesson.lectureVideoLink ? "videoAndText" : "text"));
        setTitle(initialLesson.title || "");
        setDescription(initialLesson.description || initialLesson.writtenText || "");
        setLectureVideoLink(initialLesson.lectureVideoLink || "");
        setCoverImage(initialLesson.coverImage || "");

        const hasPdfs = Boolean(
          initialLesson.hasPdfAttachments ||
          (initialLesson.pdfFiles && initialLesson.pdfFiles.length > 0),
        );
        setHasPdfAttachments(hasPdfs);
        setPdfFiles(initialLesson.pdfFiles || []);

        const hasImgs = Boolean(
          initialLesson.hasImageAttachments ||
          (initialLesson.imageFiles && initialLesson.imageFiles.length > 0),
        );
        setHasImageAttachments(hasImgs);
        setImageFiles(initialLesson.imageFiles || []);

        setIsLinkedToExam(Boolean(initialLesson.isLinkedToExam));
        setLinkedExamId(initialLesson.linkedExamId || "");
        setIsRequiredPassExam(Boolean(initialLesson.isRequiredPassExam));

        setVenue(initialLesson.venue || parentCourseContext.venue || "all");
        setPublishStatus(initialLesson.publishStatus || "published");
        setScheduledPublishDate(initialLesson.scheduledPublishDate || "");
      } else {
        // Reset defaults for new lesson
        setType("videoAndText");
        setTitle("");
        setDescription("");
        setLectureVideoLink("");
        setCoverImage("");

        setHasPdfAttachments(false);
        setPdfFiles([]);
        setPdfError(null);

        setHasImageAttachments(false);
        setImageFiles([]);

        setIsLinkedToExam(false);
        setLinkedExamId("");
        setIsRequiredPassExam(false);

        setVenue(parentCourseContext.venue || "all");
        setPublishStatus("published");
        setScheduledPublishDate("");
      }

      // Default section ID
      if (initialSectionId) {
        setTargetSectionId(initialSectionId);
      } else if (sections.length > 0) {
        setTargetSectionId(sections[0].id);
      }
    }
  }, [open, initialLesson, initialSectionId, sections, parentCourseContext]);

  // Handle PDF upload simulation
  const handleAddPdfFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newPdf: LessonAttachment = {
        id: `pdf-${Date.now()}`,
        title: file.name,
        fileUrl: URL.createObjectURL(file),
        fileType: "pdf",
        sizeInBytes: file.size,
      };
      setPdfFiles((prev) => [...prev, newPdf]);
      setPdfError(null);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePdfFile = (id: string) => {
    setPdfFiles((prev) => prev.filter((p) => p.id !== id));
  };

  // Handle Image upload simulation
  const handleAddImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newImg: LessonAttachment = {
        id: `img-${Date.now()}`,
        title: file.name,
        fileUrl: URL.createObjectURL(file),
        fileType: "image",
        sizeInBytes: file.size,
      };
      setImageFiles((prev) => [...prev, newImg]);
    }
  };

  const handleRemoveImageFile = (id: string) => {
    setImageFiles((prev) => prev.filter((i) => i.id !== id));
  };

  // Save submit handler with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !targetSectionId) return;

    // Validation: PDF files required if toggle is true
    if (hasPdfAttachments && pdfFiles.length === 0) {
      setPdfError(t("pdfRequiredError"));
      return;
    }

    const selectedExamObj = MOCK_BACKEND_EXAMS.find((e) => e.id === linkedExamId);

    const updatedLesson: Lesson = {
      id: initialLesson?.id || `les-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      title: title.trim(),
      description: description.trim(),
      writtenText: description.trim(),
      lectureVideoLink: type === "videoAndText" ? lectureVideoLink.trim() : undefined,
      coverImage: coverImage.trim() || undefined,

      // Auto-filled course info
      grade: parentCourseContext.grade,
      subject: parentCourseContext.subject,
      teacherName: parentCourseContext.teacherName,

      // Attachments & Exams
      hasPdfAttachments,
      pdfFiles: hasPdfAttachments ? pdfFiles : [],
      hasImageAttachments,
      imageFiles: hasImageAttachments ? imageFiles : [],
      isLinkedToExam,
      linkedExamId: isLinkedToExam ? linkedExamId : undefined,
      linkedExamTitle: isLinkedToExam && selectedExamObj ? selectedExamObj.title : undefined,
      isRequiredPassExam: isLinkedToExam ? isRequiredPassExam : false,

      // Organization & publish status
      venue,
      lessonCategory: "course-dependent", // Locked to course-dependent when creating inside course
      publishStatus,
      scheduledPublishDate: publishStatus === "scheduled" ? scheduledPublishDate : undefined,
    };

    onSave(targetSectionId, updatedLesson);
    onOpenChange(false);
  };

  // Helper for grade translation
  const getGradeDisplay = (gKey: string) => {
    if (!gKey) return "";
    try {
      return tGrades.has(gKey as Parameters<typeof tGrades.has>[0])
        ? tGrades(gKey as Parameters<typeof tGrades>[0])
        : gKey;
    } catch {
      return gKey;
    }
  };

  // Helper for subject translation
  const getSubjectDisplay = (sKey: string) => {
    if (!sKey) return "";
    try {
      return tSubjects.has(sKey as Parameters<typeof tSubjects.has>[0])
        ? tSubjects(sKey as Parameters<typeof tSubjects>[0])
        : sKey;
    } catch {
      return sKey;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="size-5 text-primary" />
            {initialLesson ? t("editTitle") : t("title")}
          </DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {/* Target Section Selection */}
          <div className="flex flex-col gap-2">
            <label htmlFor="les-target-sec" className="text-sm font-semibold text-foreground">
              {t("targetSection")} <span className="text-destructive">*</span>
            </label>
            <Select value={targetSectionId} onValueChange={setTargetSectionId} required>
              <SelectTrigger id="les-target-sec">
                <SelectValue placeholder={t("selectSection")} />
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

          {/* GROUP 1: LESSON TYPE */}
          <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Video className="size-4 text-primary" />
              {t("groups.type")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("videoAndText")}
                className={cn(
                  "p-3.5 rounded-lg border text-start transition-all cursor-pointer flex flex-col gap-1",
                  type === "videoAndText"
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border bg-background hover:bg-muted/40",
                )}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <Video className="size-4 text-primary" />
                  <span>{t("typeOptions.videoAndText")}</span>
                </div>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {t("typeOptions.videoAndTextDesc")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setType("text")}
                className={cn(
                  "p-3.5 rounded-lg border text-start transition-all cursor-pointer flex flex-col gap-1",
                  type === "text"
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border bg-background hover:bg-muted/40",
                )}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <FileText className="size-4 text-primary" />
                  <span>{t("typeOptions.text")}</span>
                </div>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {t("typeOptions.textDesc")}
                </span>
              </button>
            </div>
          </div>

          {/* GROUP 2: MAIN INFORMATION */}
          <div className="space-y-4 p-4 rounded-xl border bg-muted/20">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              {t("groups.mainInfo")}
            </h3>

            {/* Title */}
            <div className="flex flex-col gap-2">
              <label htmlFor="les-title-input" className="text-sm font-medium text-foreground">
                {t("lessonTitle")} <span className="text-destructive">*</span>
              </label>
              <Input
                id="les-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("lessonTitlePlaceholder")}
                required
              />
            </div>

            {/* Description (Markdown) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="les-desc-input" className="text-sm font-medium text-foreground">
                {t("description")}
              </label>
              <FormMarkdownEditor
                value={description}
                onChange={setDescription}
                placeholder={t("descriptionPlaceholder")}
              />
            </div>
          </div>

          {/* GROUP 3: VIDEO & COVER IMAGE */}
          <div className="space-y-4 p-4 rounded-xl border bg-muted/20">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ImageIcon className="size-4 text-primary" />
              {t("groups.media")}
            </h3>

            {/* Video link if videoAndText */}
            {type === "videoAndText" && (
              <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1">
                <label htmlFor="les-video-link" className="text-sm font-medium text-foreground">
                  {t("lectureVideoLink")} <span className="text-destructive">*</span>
                </label>
                <Input
                  id="les-video-link"
                  type="url"
                  value={lectureVideoLink}
                  onChange={(e) => setLectureVideoLink(e.target.value)}
                  placeholder={t("lectureVideoLinkPlaceholder")}
                  required={type === "videoAndText"}
                />
              </div>
            )}

            {/* Cover Image */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="les-cover-image"
                className="text-sm font-medium text-foreground flex items-center gap-1.5"
              >
                <ImageIcon className="size-4 text-muted-foreground" />
                {t("coverImage")}
              </label>
              <div className="relative border-2 border-dashed border-input hover:border-primary/50 transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-muted/20 text-center">
                {coverImage ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="relative w-full max-w-xs h-32 rounded-lg overflow-hidden border shadow-xs">
                      <Image
                        src={coverImage}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <Upload className="size-3.5" />
                      <span>{tCourses("new.fields.coverImageDrag")}</span>
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-background border shadow-xs text-muted-foreground">
                      <Upload className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {tCourses("new.fields.coverImageDrag")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tCourses("new.fields.coverImageNote")}
                      </p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="absolute inset-0 size-full opacity-0 cursor-pointer"
                />
              </div>
              <Input
                id="les-cover-image"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder={t("coverImagePlaceholder")}
                className="text-xs"
              />
            </div>
          </div>

          {/* GROUP 4: ACADEMIC INFORMATION (AUTO-FILLED FROM COURSE) */}
          <div className="space-y-3 p-4 rounded-xl border bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="size-4 text-primary" />
                {t("groups.academic")}
              </h3>
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 flex items-center gap-1">
                <Lock className="size-3" />
                {t("autoFilledBadge")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Grade */}
              <div className="flex flex-col gap-1 bg-background p-3 rounded-lg border">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <GraduationCap className="size-3.5" />
                  {t("gradeLevel")}
                </span>
                <span className="text-sm font-bold text-foreground truncate">
                  {getGradeDisplay(parentCourseContext.grade) || parentCourseContext.grade || "N/A"}
                </span>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1 bg-background p-3 rounded-lg border">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <BookOpen className="size-3.5" />
                  {t("subject")}
                </span>
                <span className="text-sm font-bold text-foreground truncate">
                  {getSubjectDisplay(parentCourseContext.subject) ||
                    parentCourseContext.subject ||
                    "N/A"}
                </span>
              </div>

              {/* Teacher */}
              <div className="flex flex-col gap-1 bg-background p-3 rounded-lg border">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <User className="size-3.5" />
                  {t("teacherName")}
                </span>
                <span className="text-sm font-bold text-foreground truncate">
                  {parentCourseContext.teacherName || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* GROUP 5: ATTACHMENTS AND EXAMS */}
          <div className="space-y-4 p-4 rounded-xl border bg-muted/20">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileCheck className="size-4 text-primary" />
              {t("groups.attachmentsAndExams")}
            </h3>

            {/* Toggle PDF Attachments */}
            <FormToggleSetting
              id="les-pdf-toggle"
              title={t("hasPdfAttachments")}
              subtitle={t("hasPdfAttachmentsSubtitle")}
              checked={hasPdfAttachments}
              onCheckedChange={(val) => {
                setHasPdfAttachments(val);
                if (!val) setPdfError(null);
              }}
            />

            {/* PDF Upload / Files List Area */}
            {hasPdfAttachments && (
              <div className="space-y-3 p-3 rounded-lg bg-background border animate-in fade-in slide-in-from-top-1">
                {pdfError && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-destructive bg-destructive/10 p-2.5 rounded-md border border-destructive/20">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{pdfError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    PDF Files ({pdfFiles.length})
                  </span>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors">
                    <Upload className="size-3.5" />
                    <span>{t("uploadPdf")}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleAddPdfFile}
                    />
                  </label>
                </div>

                {pdfFiles.length > 0 ? (
                  <div className="space-y-2">
                    {pdfFiles.map((pdf) => (
                      <div
                        key={pdf.id}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/40 border text-xs"
                      >
                        <span className="font-medium truncate max-w-xs flex items-center gap-1.5">
                          <FileText className="size-3.5 text-primary shrink-0" />
                          {pdf.title}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleRemovePdfFile(pdf.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-2 border border-dashed rounded-md">
                    No PDF files attached yet. Click upload to attach at least 1 PDF.
                  </p>
                )}
              </div>
            )}

            {/* Toggle Image Attachments */}
            <FormToggleSetting
              id="les-img-toggle"
              title={t("hasImageAttachments")}
              subtitle={t("hasImageAttachmentsSubtitle")}
              checked={hasImageAttachments}
              onCheckedChange={setHasImageAttachments}
            />

            {/* Image Upload Area */}
            {hasImageAttachments && (
              <div className="space-y-3 p-3 rounded-lg bg-background border animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Explanatory Images ({imageFiles.length})
                  </span>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors">
                    <Upload className="size-3.5" />
                    <span>{t("uploadImage")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAddImageFile}
                    />
                  </label>
                </div>

                {imageFiles.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {imageFiles.map((img) => (
                      <div
                        key={img.id}
                        className="relative group rounded-lg overflow-hidden border bg-muted/40 h-20 flex items-center justify-center"
                      >
                        <Image
                          src={img.fileUrl}
                          alt={img.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImageFile(img.id)}
                          className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-2 border border-dashed rounded-md">
                    No explanatory images added yet.
                  </p>
                )}
              </div>
            )}

            {/* Toggle Link to Exam */}
            <FormToggleSetting
              id="les-exam-toggle"
              title={t("isLinkedToExam")}
              subtitle={t("isLinkedToExamSubtitle")}
              checked={isLinkedToExam}
              onCheckedChange={setIsLinkedToExam}
            />

            {/* Exam Select Component */}
            {isLinkedToExam && (
              <div className="space-y-3 p-3 rounded-lg bg-background border animate-in fade-in slide-in-from-top-1">
                <label htmlFor="les-exam-select" className="text-xs font-semibold text-foreground">
                  {t("selectExam")} <span className="text-destructive">*</span>
                </label>
                <Select
                  value={linkedExamId}
                  onValueChange={setLinkedExamId}
                  required={isLinkedToExam}
                >
                  <SelectTrigger id="les-exam-select">
                    <SelectValue placeholder={t("selectExam")} />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_BACKEND_EXAMS.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Toggle Have to pass exam */}
                <FormToggleSetting
                  id="les-pass-exam-toggle"
                  title={t("isRequiredPassExam")}
                  subtitle={t("isRequiredPassExamSubtitle")}
                  checked={isRequiredPassExam}
                  onCheckedChange={setIsRequiredPassExam}
                  className="mt-2"
                />
              </div>
            )}
          </div>

          {/* GROUP 6: ORGANIZATION AND PUBLISH STATUS */}
          <div className="space-y-4 p-4 rounded-xl border bg-muted/20">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {t("groups.organization")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Venue */}
              <div className="flex flex-col gap-2">
                <label htmlFor="les-venue-select" className="text-sm font-medium text-foreground">
                  {t("venue")}
                </label>
                <Select value={venue} onValueChange={(v) => setVenue(v as CourseVenue)}>
                  <SelectTrigger id="les-venue-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">{tCourses("venue.online")}</SelectItem>
                    <SelectItem value="center">{tCourses("venue.center")}</SelectItem>
                    <SelectItem value="all">{tCourses("venue.all")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lesson Category (Disabled / Locked to course-dependent when in course) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground flex items-center justify-between">
                  <span>{t("lessonCategory")}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-normal">
                    <Lock className="size-3 text-muted-foreground" />
                    {t("locked")}
                  </span>
                </label>
                <div className="h-10 px-3 py-2 rounded-md border bg-muted/50 text-muted-foreground text-sm font-medium flex items-center justify-between">
                  <span>{t("categoryOptions.courseDependent")}</span>
                  <Lock className="size-3.5 opacity-60" />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {t("categoryDisabledNote")}
                </span>
              </div>
            </div>

            {/* Publish Status */}
            <div className="flex flex-col gap-2">
              <label htmlFor="les-publish-status" className="text-sm font-medium text-foreground">
                {t("publishStatus")}
              </label>
              <Select
                value={publishStatus}
                onValueChange={(val) => setPublishStatus(val as LessonPublishStatus)}
              >
                <SelectTrigger id="les-publish-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">{t("statusOptions.published")}</SelectItem>
                  <SelectItem value="draft">{t("statusOptions.draft")}</SelectItem>
                  <SelectItem value="scheduled">{t("statusOptions.scheduled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Scheduled Date Time Input */}
            {publishStatus === "scheduled" && (
              <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1">
                <label
                  htmlFor="les-scheduled-date"
                  className="text-sm font-medium text-foreground flex items-center gap-1.5"
                >
                  <Calendar className="size-4 text-primary" />
                  {t("scheduledPublishDate")} <span className="text-destructive">*</span>
                </label>
                <Input
                  id="les-scheduled-date"
                  type="datetime-local"
                  value={scheduledPublishDate}
                  onChange={(e) => setScheduledPublishDate(e.target.value)}
                  required={publishStatus === "scheduled"}
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit">{initialLesson ? t("saveChanges") : t("createLesson")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
