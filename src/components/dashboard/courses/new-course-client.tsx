/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormMarkdownEditor } from "@/components/ui/form-markdown-editor";
import { FormRadioGroup } from "@/components/ui/form-radio-group";
import { FormSectionCard } from "@/components/ui/form-section-card";
import { FormToggleSetting } from "@/components/ui/form-toggle-setting";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStoredCourses, saveStoredCourses } from "@/lib/courses-storage";
import { cn } from "@/lib/utils";
import { Course } from "@/types/course";
import "@mdxeditor/editor/style.css";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Loader2,
  MapPin,
  Sparkles,
  Tag,
  Upload,
  User,
  Users,
  Video,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SUBJECT_COVER_PLACEHOLDERS: Record<string, string> = {
  physics: "/courses/physics.jpg",
  chemistry: "/courses/chemistry.jpg",
  biology: "/courses/biology.webp",
  mathematics: "/courses/math.jpg",
  english: "/courses/english.png",
  arabic: "/courses/arabic.jpg",
};

const DEFAULT_COVER_PLACEHOLDER = "/courses/physics.jpg";

interface NewCourseClientProps {
  initialCourseId?: string;
}

export function NewCourseClient({ initialCourseId }: NewCourseClientProps = {}) {
  const t = useTranslations("courses.new");
  const locale = useLocale();
  const router = useRouter();

  // Loading State
  const [isLoaded, setIsLoaded] = useState(!initialCourseId);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewVideoLink, setPreviewVideoLink] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);

  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [period, setPeriod] = useState<"monthly" | "yearly" | "termBased">("monthly");

  const [isFree, setIsFree] = useState(false);
  const [coursePrice, setCoursePrice] = useState<number | "">("");
  const [currency, setCurrency] = useState("EGP");
  const [hasOffer, setHasOffer] = useState(false);
  const [offerPercentage, setOfferPercentage] = useState<number | "">("");

  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [timeLimitValue, setTimeLimitValue] = useState<number | "">("");
  const [isSplitToGroups, setIsSplitToGroups] = useState(false);
  const [venue, setVenue] = useState<"online" | "center" | "all">("all");

  // Active step state: 1 = Info & Price, 2 = Curriculum & Lectures
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(initialCourseId || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load existing course data if editing
  useEffect(() => {
    if (!initialCourseId) {
      setIsLoaded(true);
      return;
    }
    const courses = getStoredCourses(locale);
    const existing = courses.find((c) => c.id === initialCourseId);

    if (existing) {
      // Direct value assignments
      setTitle(existing.title || "");
      setDescription(existing.description || "");
      setPreviewVideoLink(existing.previewVideoLink || "");
      if (existing.coverImage) setCoverImage(existing.coverImage);
      setTeacherName(existing.teacherName || "");

      // Period parsing
      const exPeriod = (existing.period || "").toLowerCase();
      if (exPeriod.includes("year")) {
        setPeriod("yearly");
      } else if (exPeriod.includes("term")) {
        setPeriod("termBased");
      } else {
        setPeriod("monthly");
      }

      setIsFree(Boolean(existing.isFree));
      setCoursePrice(existing.price ?? "");
      setCurrency(existing.currency || "EGP");
      setHasOffer(Boolean(existing.hasOffer));
      if (existing.offerPercentage) {
        const parsedPct = parseInt(existing.offerPercentage.replace(/\D/g, ""), 10);
        setOfferPercentage(isNaN(parsedPct) ? "" : parsedPct);
      }
      setHasTimeLimit(Boolean(existing.hasTimeLimit));
      setTimeLimitValue(existing.timeLimitValue ?? "");
      setIsSplitToGroups(Boolean(existing.isSplitToGroups));
      setVenue(existing.venue || "all");

      // Matching for Grade
      const knownGrades: Record<string, string[]> = {
        grade1: [t("grades.grade1"), "الأول", "1st", "10", "grade1"],
        grade2: [t("grades.grade2"), "الثاني", "2nd", "11", "grade2"],
        grade3: [t("grades.grade3"), "الثالث", "3rd", "12", "grade3"],
        university: [t("grades.university"), "جامع", "University", "university"],
      };
      const exGrade = (existing.grade || "").toLowerCase();
      const matchedGradeKey =
        Object.keys(knownGrades).find((key) =>
          knownGrades[key].some((val) => val && exGrade.includes(val.toLowerCase())),
        ) ||
        (["grade1", "grade2", "grade3", "university"].includes(existing.grade)
          ? existing.grade
          : "");
      setGrade(matchedGradeKey);

      // Matching for Subject
      const knownSubjects: Record<string, string[]> = {
        mathematics: [t("subjects.mathematics"), "رياضيات", "math", "calculus"],
        physics: [t("subjects.physics"), "فيزياء", "physic"],
        chemistry: [t("subjects.chemistry"), "كيمياء", "chemist"],
        biology: [t("subjects.biology"), "أحياء", "احياء", "biolog"],
        english: [t("subjects.english"), "إنجليزية", "انجليزية", "english"],
        arabic: [t("subjects.arabic"), "عربية", "عربى", "arabic"],
      };
      const exSubj = (existing.subject || "").toLowerCase();
      const matchedSubjKey =
        Object.keys(knownSubjects).find((key) =>
          knownSubjects[key].some((val) => val && exSubj.includes(val.toLowerCase())),
        ) ||
        (["mathematics", "physics", "chemistry", "biology", "english", "arabic"].includes(
          existing.subject,
        )
          ? existing.subject
          : "");
      setSubject(matchedSubjKey);
    }

    // Unblock the form rendering once values are populated
    setIsLoaded(true);
  }, [initialCourseId, locale, t]);

  // Helper to resolve cover image or fallback based on selected subject
  const resolveCoverImage = () => {
    if (coverImage) return coverImage;
    return SUBJECT_COVER_PLACEHOLDERS[subject] || DEFAULT_COVER_PLACEHOLDER;
  };

  // File Upload preview simulator
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent, isDraftOnly = false) => {
    e.preventDefault();
    if (isDraftOnly) {
      setIsSavingDraft(true);
    } else {
      setIsSubmitting(true);
    }

    const existingCourses = getStoredCourses(locale);
    const courseIdToUse =
      createdCourseId || `course-${Math.floor(100000 + Math.random() * 900000)}`;
    setCreatedCourseId(courseIdToUse);

    const existingCourse = existingCourses.find((c) => c.id === courseIdToUse);
    const finalCoverImage = resolveCoverImage();

    const updatedCourse: Course = {
      id: courseIdToUse,
      coverImage: finalCoverImage,
      title: title || (locale === "ar" ? "مسودة دورة جديدة" : "New Course Draft"),
      description: description || "",
      previewVideoLink: previewVideoLink || undefined,
      subject: subject
        ? t(`subjects.${subject}`)
        : existingCourse?.subject || (locale === "ar" ? "عام" : "General"),
      grade: grade
        ? t(`grades.${grade}`)
        : existingCourse?.grade || (locale === "ar" ? "جميع المراحل" : "All Grades"),
      teacherName: teacherName || (locale === "ar" ? "معلم جديد" : "New Teacher"),
      period: period,
      date: existingCourse?.date || new Date().toISOString().split("T")[0],
      numberOfLessons: existingCourse?.numberOfLessons || 0,
      price: isFree ? 0 : Number(coursePrice) || 0,
      isFree: isFree,
      currency: currency,
      hasOffer: hasOffer,
      offerPercentage: hasOffer && offerPercentage ? `${offerPercentage}%` : undefined,
      hasTimeLimit: hasTimeLimit,
      timeLimitValue: hasTimeLimit && timeLimitValue ? Number(timeLimitValue) : undefined,
      isSplitToGroups: isSplitToGroups,
      venue: venue,
      numberOfParticipants: existingCourse?.numberOfParticipants || 0,
      isDraft: existingCourse ? existingCourse.isDraft : true,
      sections: existingCourse?.sections || [],
    };

    try {
      const filtered = existingCourses.filter((c) => c.id !== courseIdToUse);
      const updatedCourses = [updatedCourse, ...filtered];
      saveStoredCourses(locale, updatedCourses);
    } catch (err) {
      console.error("Failed to save course:", err);
    }

    setTimeout(() => {
      setIsSavingDraft(false);
      setIsSubmitting(false);

      if (isDraftOnly) {
        setSuccessMessage(t("actions.draftSaved"));
        setTimeout(() => {
          router.push("/dashboard/courses");
        }, 1200);
      } else {
        // Proceed to Step 2 (Curriculum & Lectures)
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 400);
  };

  // Step indicator setup
  const isInfoAndPriceComplete =
    Boolean(title && description && grade && subject && teacherName) &&
    (isFree || Boolean(coursePrice));

  const steps = [
    {
      id: 1,
      label: t("steps.infoAndPrice"),
      icon: FileText,
      complete: isInfoAndPriceComplete,
    },
    {
      id: 2,
      label: t("steps.lectures"),
      icon: BookOpen,
      complete: false,
    },
  ];

  // Prevent form render until data successfully hydrates
  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {locale === "ar" ? "جاري تحميل بيانات الدورة..." : "Loading course data..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0">
          <Link href={`/${locale}/dashboard/courses`}>
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {initialCourseId ? t("editTitle") : t("title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {initialCourseId ? t("editSubtitle") : t("subtitle")}
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {successMessage}
        </div>
      )}

      {/* Main layout: Sidebar + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Helper Sidebar (4 cols on lg) */}
        <aside className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
          {/* 1. Steps timeline div */}
          <Card className="bg-card border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="size-4 text-primary shrink-0" />
                {t("timelineTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 rtl:pl-0 rtl:pr-6 space-y-6 before:absolute before:left-2.5 rtl:before:left-auto rtl:before:right-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {steps.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.id;
                  const isDone = step.complete && step.id < currentStep;

                  return (
                    <div key={step.id} className="relative flex items-center gap-3">
                      <span
                        className={`absolute -left-6 rtl:-left-auto rtl:-right-6 flex size-5 items-center justify-center rounded-full text-xs font-semibold ring-4 ring-background transition-colors ${
                          isDone
                            ? "bg-emerald-500 text-white"
                            : isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="size-3.5" /> : step.id}
                      </span>
                      <div className="flex items-center gap-2 min-w-0">
                        <StepIcon
                          className={`size-4 shrink-0 ${
                            isActive
                              ? "text-primary"
                              : isDone
                                ? "text-emerald-500"
                                : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium truncate ${
                            isActive
                              ? "text-foreground font-semibold"
                              : isDone
                                ? "text-foreground"
                                : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 2. Disclaimer div */}
          <Card className="border shadow-xs border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                <HelpCircle className="size-4 shrink-0" />
                {t("disclaimerTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("disclaimerDescription")}
              </p>
            </CardContent>
          </Card>
        </aside>

        {/* Main Form Area (8 cols on lg) */}
        <main className="lg:col-span-8 order-1 lg:order-2">
          {currentStep === 1 ? (
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
              {/* 1. MAIN INFORMATION */}
              <FormSectionCard
                title={t("sections.mainInfo.title")}
                description={t("sections.mainInfo.description")}
                icon={BookOpen}
                contentClassName="space-y-4"
              >
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="course-title" className="text-sm font-medium text-foreground">
                    {t("fields.title")} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="course-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("fields.titlePlaceholder")}
                    required
                  />
                </div>

                {/* Description (Markdown) */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="course-description"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("fields.description")} <span className="text-destructive">*</span>
                  </label>
                  <FormMarkdownEditor
                    value={description}
                    onChange={setDescription}
                    placeholder={t("fields.descriptionPlaceholder")}
                  />
                </div>

                {/* Preview Video Link */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="course-preview-video"
                    className="text-sm font-medium text-foreground flex items-center gap-1.5"
                  >
                    <Video className="size-4 text-muted-foreground" />
                    {t("fields.previewVideoLink")}
                  </label>
                  <Input
                    id="course-preview-video"
                    type="url"
                    value={previewVideoLink}
                    onChange={(e) => setPreviewVideoLink(e.target.value)}
                    placeholder={t("fields.previewVideoLinkPlaceholder")}
                  />
                </div>

                {/* Cover Image Upload Area */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <ImageIcon className="size-4 text-muted-foreground" />
                    {t("fields.coverImage")}
                  </label>
                  <div className="relative border-2 border-dashed border-input hover:border-primary/50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center gap-3 bg-muted/20 text-center">
                    {coverImage ? (
                      <div className="flex flex-col items-center gap-2 w-full">
                        <Image
                          src={coverImage}
                          alt="Cover Preview"
                          width={300}
                          height={300}
                          className="max-h-40 w-auto rounded-lg object-cover border shadow-xs"
                        />
                        <span className="text-xs text-muted-foreground font-mono">
                          {coverFileName}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 rounded-full bg-background border shadow-xs text-muted-foreground">
                          <Upload className="size-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {t("fields.coverImageDrag")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("fields.coverImageNote")}
                          </p>
                        </div>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 size-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </FormSectionCard>

              {/* 2. CATEGORY INFORMATION */}
              <FormSectionCard
                title={t("sections.categoryInfo.title")}
                description={t("sections.categoryInfo.description")}
                icon={Tag}
                contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* Grade - Removed `|| undefined` */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("fields.grade")} <span className="text-destructive">*</span>
                  </label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("fields.selectGrade")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade1">{t("grades.grade1")}</SelectItem>
                      <SelectItem value="grade2">{t("grades.grade2")}</SelectItem>
                      <SelectItem value="grade3">{t("grades.grade3")}</SelectItem>
                      <SelectItem value="university">{t("grades.university")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject - Removed `|| undefined` */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("fields.subject")} <span className="text-destructive">*</span>
                  </label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("fields.selectSubject")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">{t("subjects.mathematics")}</SelectItem>
                      <SelectItem value="physics">{t("subjects.physics")}</SelectItem>
                      <SelectItem value="chemistry">{t("subjects.chemistry")}</SelectItem>
                      <SelectItem value="biology">{t("subjects.biology")}</SelectItem>
                      <SelectItem value="english">{t("subjects.english")}</SelectItem>
                      <SelectItem value="arabic">{t("subjects.arabic")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Teacher Name */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="teacher-name"
                    className="text-sm font-medium text-foreground flex items-center gap-1.5"
                  >
                    <User className="size-4 text-muted-foreground" />
                    {t("fields.teacherName")} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="teacher-name"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder={t("fields.teacherNamePlaceholder")}
                    className="h-8 py-2"
                    required
                  />
                </div>

                {/* Period - Removed `|| undefined` */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("fields.period")} <span className="text-destructive">*</span>
                  </label>
                  <Select value={period} onValueChange={(val) => setPeriod(val as typeof period)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("fields.selectPeriod")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">{t("periodOptions.monthly")}</SelectItem>
                      <SelectItem value="yearly">{t("periodOptions.yearly")}</SelectItem>
                      <SelectItem value="termBased">{t("periodOptions.termBased")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormSectionCard>

              {/* 3. PRICE INFORMATION */}
              <FormSectionCard
                title={t("sections.priceInfo.title")}
                description={t("sections.priceInfo.description")}
                icon={Coins}
                contentClassName="space-y-5"
              >
                {/* isFree Toggle */}
                <FormToggleSetting
                  id="is-free-toggle"
                  title={t("fields.isFree")}
                  subtitle={t("fields.isFreeSubtitle")}
                  checked={isFree}
                  onCheckedChange={setIsFree}
                />

                {!isFree && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                    {/* Course Price */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="course-price" className="text-sm font-medium text-foreground">
                        {t("fields.coursePrice")} <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="course-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={coursePrice}
                        onChange={(e) =>
                          setCoursePrice(e.target.value ? Number(e.target.value) : "")
                        }
                        placeholder="299.00"
                        required={!isFree}
                      />
                    </div>

                    {/* Currency - Removed `|| undefined` */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-foreground">
                        {t("fields.currency")}
                      </label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="w-full h-12! py-3!">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EGP">{t("currencies.EGP")}</SelectItem>
                          <SelectItem value="USD">{t("currencies.USD")}</SelectItem>
                          <SelectItem value="SAR">{t("currencies.SAR")}</SelectItem>
                          <SelectItem value="AED">{t("currencies.AED")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* hasOffer Toggle */}
                <FormToggleSetting
                  id="has-offer-toggle"
                  title={t("fields.hasOffer")}
                  subtitle={t("fields.hasOfferSubtitle")}
                  checked={hasOffer}
                  onCheckedChange={setHasOffer}
                />

                {/* offerPercentage (conditional) */}
                {hasOffer && (
                  <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 max-w-sm">
                    <label
                      htmlFor="offer-percentage"
                      className="text-sm font-medium text-foreground"
                    >
                      {t("fields.offerPercentage")} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="offer-percentage"
                      type="number"
                      min="1"
                      max="100"
                      value={offerPercentage}
                      onChange={(e) =>
                        setOfferPercentage(e.target.value ? Number(e.target.value) : "")
                      }
                      placeholder="20"
                      required={hasOffer}
                    />
                  </div>
                )}
              </FormSectionCard>

              {/* 4. ADVANCED SETTINGS */}
              <FormSectionCard
                title={t("sections.advancedSettings.title")}
                description={t("sections.advancedSettings.description")}
                icon={Layers}
                contentClassName="space-y-5"
              >
                {/* hasTimeLimit Toggle */}
                <FormToggleSetting
                  id="has-time-limit-toggle"
                  title={t("fields.hasTimeLimit")}
                  subtitle={t("fields.hasTimeLimitSubtitle")}
                  icon={Clock}
                  checked={hasTimeLimit}
                  onCheckedChange={setHasTimeLimit}
                />

                {/* timeLimitValue (conditional) */}
                {hasTimeLimit && (
                  <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 max-w-sm">
                    <label htmlFor="time-limit-val" className="text-sm font-medium text-foreground">
                      {t("fields.timeLimitValue")} <span className="text-destructive">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Input
                        id="time-limit-val"
                        type="number"
                        min="1"
                        value={timeLimitValue}
                        onChange={(e) =>
                          setTimeLimitValue(e.target.value ? Number(e.target.value) : "")
                        }
                        placeholder="90"
                        required={hasTimeLimit}
                      />
                    </div>
                  </div>
                )}

                {/* isSplitToGroups Toggle */}
                <FormToggleSetting
                  id="is-split-to-groups-toggle"
                  title={t("fields.isSplitToGroups")}
                  subtitle={t("fields.isSplitToGroupsSubtitle")}
                  icon={Users}
                  checked={isSplitToGroups}
                  onCheckedChange={setIsSplitToGroups}
                />

                {/* Venue (Radio Group with 3 options) */}
                <FormRadioGroup
                  name="venue-option"
                  title={t("fields.venue")}
                  subtitle={t("fields.venueSubtitle")}
                  icon={MapPin}
                  value={venue}
                  onValueChange={(val) => setVenue(val as typeof venue)}
                  options={[
                    {
                      id: "online",
                      label: t("venues.online.label"),
                      desc: t("venues.online.desc"),
                    },
                    {
                      id: "center",
                      label: t("venues.center.label"),
                      desc: t("venues.center.desc"),
                    },
                    {
                      id: "all",
                      label: t("venues.all.label"),
                      desc: t("venues.all.desc"),
                    },
                  ]}
                />
              </FormSectionCard>

              {/* CTA Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSavingDraft || isSubmitting}
                >
                  {isSavingDraft
                    ? initialCourseId
                      ? t("actions.savingChanges")
                      : t("actions.savingDraft")
                    : initialCourseId
                      ? t("actions.saveChanges")
                      : t("actions.saveDraft")}
                </Button>
                <Button type="submit" disabled={isSubmitting || isSavingDraft}>
                  {isSubmitting
                    ? initialCourseId
                      ? t("actions.updating")
                      : t("actions.creating")
                    : initialCourseId
                      ? t("actions.updateCourse")
                      : t("actions.createCourse")}
                </Button>
              </div>
            </form>
          ) : (
            /* STEP 2: COURSE CURRICULUM & LECTURES */
            <Step2CurriculumView
              courseId={createdCourseId!}
              locale={locale}
              isEditing={Boolean(initialCourseId)}
              onBackToStep1={() => setCurrentStep(1)}
              onFinish={() => router.push("/dashboard/courses")}
            />
          )}
        </main>
      </div>
    </div>
  );
}

import { LessonDialog } from "./lesson-dialog";

/* STEP 2 COMPONENT WITH 4 ACTION BUTTONS AND DIALOGS */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseSection, Lesson, CourseVenue } from "@/types/course";
import {
  ArrowDown,
  ArrowUp,
  FileQuestion,
  FolderPlus,
  ListOrdered,
  Video as VideoIcon,
  Edit2,
  FileText as FileTextIcon,
  Paperclip,
  Clock as ClockIcon,
} from "lucide-react";

interface Step2CurriculumViewProps {
  courseId: string;
  locale: string;
  isEditing?: boolean;
  onBackToStep1: () => void;
  onFinish: () => void;
}

function Step2CurriculumView({
  courseId,
  locale,
  isEditing,
  onBackToStep1,
  onFinish,
}: Step2CurriculumViewProps) {
  const t = useTranslations("courses.new");

  // State for sections list
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [activeDialog, setActiveDialog] = useState<
    "section" | "lesson" | "exam" | "arrange" | null
  >(null);
  const [editingLesson, setEditingLesson] = useState<{ lesson: Lesson; sectionId: string } | null>(
    null,
  );

  // Parent Course Context for auto-filling
  const [parentCourseContext, setParentCourseContext] = useState({
    grade: "",
    subject: "",
    teacherName: "",
    venue: "all" as CourseVenue,
  });

  // Load existing sections and parent course info
  useEffect(() => {
    if (!courseId) return;
    const courses = getStoredCourses(locale);
    const existing = courses.find((c) => c.id === courseId);
    if (existing) {
      if (existing.sections) setSections(existing.sections);
      setParentCourseContext({
        grade: existing.grade || "",
        subject: existing.subject || "",
        teacherName: existing.teacherName || "",
        venue: existing.venue || "all",
      });
    }
  }, [courseId, locale]);

  // Dialog Form states: Section
  const [newSecTitle, setNewSecTitle] = useState("");
  const [newSecIsLinkedExam, setNewSecIsLinkedExam] = useState(false);
  const [newSecIsReqPass, setNewSecIsReqPass] = useState(false);

  // Dialog Form states: Exam
  const [newExamTargetSecId, setNewExamTargetSecId] = useState("");
  const [newExamTitle, setNewExamTitle] = useState("");
  const [newExamPassingScore, setNewExamPassingScore] = useState<number | "">(70);
  const [newExamTotalGrade, setNewExamTotalGrade] = useState<number | "">(100);

  // Sync sections to localStorage course object
  const syncSectionsToStorage = (updatedSections: CourseSection[]) => {
    try {
      const courses = getStoredCourses(locale);
      const targetIndex = courses.findIndex((c) => c.id === courseId);
      if (targetIndex !== -1) {
        const totalLessonsCount = updatedSections.reduce((acc, sec) => acc + sec.lessons.length, 0);
        courses[targetIndex] = {
          ...courses[targetIndex],
          sections: updatedSections,
          numberOfLessons: totalLessonsCount,
        };
        saveStoredCourses(locale, courses);
      }
    } catch (err) {
      console.error("Failed to sync sections:", err);
    }
  };

  // Handlers for creating objects
  const handleAddSection = () => {
    if (!newSecTitle.trim()) return;
    const secId = `sec-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSec: CourseSection = {
      id: secId,
      title: newSecTitle,
      isDraft: false,
      isLinkedToExam: newSecIsLinkedExam,
      isRequiredPassExamForNextSection: newSecIsReqPass,
      lessons: [],
      tests: [],
    };
    const updated = [...sections, newSec];
    setSections(updated);
    syncSectionsToStorage(updated);
    setNewSecTitle("");
    setNewSecIsLinkedExam(false);
    setNewSecIsReqPass(false);
    setActiveDialog(null);
  };

  const handleSaveLesson = (targetSecId: string, savedLesson: Lesson) => {
    const updated = sections.map((sec) => {
      const lessonExistsInSec = sec.lessons.some((l) => l.id === savedLesson.id);
      if (sec.id === targetSecId) {
        if (lessonExistsInSec) {
          return {
            ...sec,
            lessons: sec.lessons.map((l) => (l.id === savedLesson.id ? savedLesson : l)),
          };
        } else {
          return {
            ...sec,
            lessons: [...sec.lessons.filter((l) => l.id !== savedLesson.id), savedLesson],
          };
        }
      } else if (lessonExistsInSec) {
        return {
          ...sec,
          lessons: sec.lessons.filter((l) => l.id !== savedLesson.id),
        };
      }
      return sec;
    });

    setSections(updated);
    syncSectionsToStorage(updated);
    setEditingLesson(null);
    setActiveDialog(null);
  };

  const handleAddExam = () => {
    if (!newExamTitle.trim() || !newExamTargetSecId) return;
    const updated = sections.map((sec) => {
      if (sec.id === newExamTargetSecId) {
        return {
          ...sec,
          isLinkedToExam: true,
          linkedExam: {
            sectionId: sec.id,
            examContent: {
              id: `exam-${Math.floor(1000 + Math.random() * 9000)}`,
              title: newExamTitle,
              passingScore: Number(newExamPassingScore) || 70,
              totalGrade: Number(newExamTotalGrade) || 100,
              questions: [],
            },
          },
        };
      }
      return sec;
    });
    setSections(updated);
    syncSectionsToStorage(updated);
    setNewExamTitle("");
    setNewExamTargetSecId("");
    setActiveDialog(null);
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSections(updated);
    syncSectionsToStorage(updated);
  };

  const buttons = [
    { key: "section", label: t("actions.addSection"), icon: FolderPlus },
    { key: "lesson", label: t("actions.addLesson"), icon: VideoIcon },
    { key: "exam", label: t("actions.addExam"), icon: FileQuestion },
    { key: "arrange", label: t("actions.arrangeSections"), icon: ListOrdered },
  ] as const;

  return (
    <div className="space-y-6">
      {/* 4 ACTION BUTTONS AT TOP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activeDialog === btn.key;
          return (
            <button
              key={btn.key}
              type="button"
              onClick={() => {
                if (btn.key === "lesson") setEditingLesson(null);
                setActiveDialog(btn.key);
              }}
              className={cn(
                "py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5 border shadow-2xs group cursor-pointer",
                isActive
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-card text-primary border-input hover:bg-primary hover:text-white hover:border-primary",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Curriculum View Card */}
      <FormSectionCard
        title={t("step2.title")}
        description={t("step2.subtitle")}
        icon={BookOpen}
        contentClassName="space-y-4"
      >
        {sections.length === 0 ? (
          <div className="py-12 px-4 text-center border-2 border-dashed rounded-xl bg-muted/20 space-y-3">
            <FolderPlus className="size-10 text-muted-foreground mx-auto" />
            <p className="text-sm font-medium text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t("step2.noSections")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((sec, sIdx) => (
              <div key={sec.id} className="border rounded-xl p-4 bg-muted/20 space-y-3">
                {/* Section Header */}
                <div className="flex items-center justify-between font-semibold text-foreground text-base">
                  <span className="flex items-center gap-2">
                    <span className="size-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                      {sIdx + 1}
                    </span>
                    {sec.title}
                  </span>
                  {sec.isLinkedToExam && !sec.linkedExam && (
                    <span className="text-xs font-normal px-2.5 py-1 rounded-md bg-warning-bg/10 text-warning dark:warning-bg border border-warning/20">
                      {t("step2.pleaseAddExamBadge")}
                    </span>
                  )}
                </div>

                {/* Section Lessons & Linked Exam */}
                {sec.lessons.length > 0 || (sec.isLinkedToExam && sec.linkedExam) ? (
                  <div className="pl-6 rtl:pl-0 rtl:pr-6 space-y-2 border-l rtl:border-l-0 rtl:border-r border-border">
                    {sec.lessons.map((les, lIdx) => (
                      <div
                        key={les.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-2 px-3 rounded-lg bg-background border gap-2"
                      >
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {les.type === "text" ? (
                            <FileTextIcon className="size-4 text-emerald-500 shrink-0" />
                          ) : (
                            <VideoIcon className="size-4 text-primary shrink-0" />
                          )}
                          <span className="font-semibold text-foreground">
                            {lIdx + 1}. {les.title}
                          </span>

                          {/* Badges for Lesson attributes */}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {les.type === "text" ? "Text" : "Video & Text"}
                          </span>

                          {(les.hasPdfAttachments || (les.pdfFiles && les.pdfFiles.length > 0)) && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                              <Paperclip className="size-3" />
                              PDFs ({(les.pdfFiles || []).length || 1})
                            </span>
                          )}

                          {les.isLinkedToExam && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                              <FileQuestion className="size-3" />
                              Exam Linked
                            </span>
                          )}

                          {les.publishStatus === "scheduled" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                              <ClockIcon className="size-3" />
                              Scheduled
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => {
                              setEditingLesson({ lesson: les, sectionId: sec.id });
                              setActiveDialog("lesson");
                            }}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Linked Exam item under lessons */}
                    {sec.isLinkedToExam && sec.linkedExam && (
                      <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-warning/10 border border-warning/20">
                        <span className="font-medium text-warning dark:warning-bg flex items-center gap-2">
                          <FileQuestion className="size-3.5 text-warning dark:warning-bg" />
                          {sec.linkedExam.examContent.title}
                        </span>
                        <span className="text-warning dark:warning-bg text-[11px] font-medium">
                          {sec.linkedExam.examContent.passingScore}% /{" "}
                          {sec.linkedExam.examContent.totalGrade}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic pl-6 rtl:pl-0 rtl:pr-6">
                    {t("step2.noLessons")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </FormSectionCard>

      {/* Step 2 Bottom Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" type="button" onClick={onBackToStep1}>
          {t("actions.backToMainInfo")}
        </Button>
        <Button type="button" onClick={onFinish} className="gap-2">
          <CheckCircle2 className="size-4" />
          {isEditing ? t("actions.saveAndPublish") : t("actions.finishAndPublish")}
        </Button>
      </div>

      {/* DIALOG 1: ADD SECTION */}
      <Dialog
        open={activeDialog === "section"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("step2.addSectionDialog.title")}</DialogTitle>
            <DialogDescription>{t("step2.addSectionDialog.subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="sec-title" className="text-sm font-medium text-foreground">
                {t("step2.addSectionDialog.sectionTitle")}
              </label>
              <Input
                id="sec-title"
                value={newSecTitle}
                onChange={(e) => setNewSecTitle(e.target.value)}
                placeholder={t("step2.addSectionDialog.sectionTitlePlaceholder")}
              />
            </div>
            <FormToggleSetting
              id="link-exam-toggle"
              title={t("step2.addSectionDialog.isLinkedToExam")}
              subtitle={t("step2.addSectionDialog.isLinkedToExamSubtitle")}
              checked={newSecIsLinkedExam}
              onCheckedChange={setNewSecIsLinkedExam}
            />
            {newSecIsLinkedExam && (
              <FormToggleSetting
                id="req-pass-toggle"
                title={t("step2.addSectionDialog.isRequiredPassExam")}
                subtitle={t("step2.addSectionDialog.isRequiredPassExamSubtitle")}
                checked={newSecIsReqPass}
                onCheckedChange={setNewSecIsReqPass}
              />
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={() => setActiveDialog(null)}>
              {t("actions.cancel")}
            </Button>
            <Button type="button" onClick={handleAddSection} disabled={!newSecTitle.trim()}>
              {t("actions.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: LESSON DIALOG (ADD & EDIT) */}
      <LessonDialog
        open={activeDialog === "lesson"}
        onOpenChange={(open) => {
          if (!open) setEditingLesson(null);
          setActiveDialog(open ? "lesson" : null);
        }}
        sections={sections}
        initialLesson={editingLesson?.lesson || null}
        initialSectionId={editingLesson?.sectionId}
        parentCourseContext={parentCourseContext}
        onSave={handleSaveLesson}
      />

      {/* DIALOG 3: ADD EXAM */}
      <Dialog
        open={activeDialog === "exam"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("step2.addExamDialog.title")}</DialogTitle>
            <DialogDescription>{t("step2.addExamDialog.subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="exam-sec" className="text-sm font-medium text-foreground">
                {t("step2.addExamDialog.targetSection")}
              </label>
              <Select value={newExamTargetSecId} onValueChange={setNewExamTargetSecId}>
                <SelectTrigger id="exam-sec">
                  <SelectValue placeholder={t("step2.addExamDialog.selectSection")} />
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
            <div className="flex flex-col gap-2">
              <label htmlFor="exam-title" className="text-sm font-medium text-foreground">
                {t("step2.addExamDialog.examTitle")}
              </label>
              <Input
                id="exam-title"
                value={newExamTitle}
                onChange={(e) => setNewExamTitle(e.target.value)}
                placeholder={t("step2.addExamDialog.examTitlePlaceholder")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="exam-score" className="text-sm font-medium text-foreground">
                  {t("step2.addExamDialog.passingScore")}
                </label>
                <Input
                  id="exam-score"
                  type="number"
                  value={newExamPassingScore}
                  onChange={(e) =>
                    setNewExamPassingScore(e.target.value ? Number(e.target.value) : "")
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="exam-grade" className="text-sm font-medium text-foreground">
                  {t("step2.addExamDialog.totalGrade")}
                </label>
                <Input
                  id="exam-grade"
                  type="number"
                  value={newExamTotalGrade}
                  onChange={(e) =>
                    setNewExamTotalGrade(e.target.value ? Number(e.target.value) : "")
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={() => setActiveDialog(null)}>
              {t("actions.cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleAddExam}
              disabled={!newExamTitle.trim() || !newExamTargetSecId}
            >
              {t("actions.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: ARRANGE SECTIONS */}
      <Dialog
        open={activeDialog === "arrange"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("step2.arrangeDialog.title")}</DialogTitle>
            <DialogDescription>{t("step2.arrangeDialog.subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 max-h-80 overflow-y-auto">
            {sections.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                {t("step2.noSections")}
              </p>
            ) : (
              sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/40"
                >
                  <span className="text-sm font-medium text-foreground">
                    {idx + 1}. {sec.title}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, "up")}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMoveSection(idx, "down")}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setActiveDialog(null)}>
              {t("step2.arrangeDialog.done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
