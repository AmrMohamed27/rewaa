"use client";

import {
  Award,
  BookOpen,
  Clock,
  Download,
  FileCheck2,
  FileText,
  GraduationCap,
  HelpCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import { LogoIcon } from "@/components/landing/layout/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course } from "@/types/course";
import { Exam } from "@/types/exam";
import { Student } from "@/types/student";
import { pdf } from "@react-pdf/renderer";
import { StudentReportPDF } from "@/components/pdf/StudentReportPDF"; // Adjust path as needed

interface StudentReportModalProps {
  student: Student;
  courses: Course[];
  exams: Exam[];
  isOpen: boolean;
  onClose: () => void;
  formatGrade: (key?: string) => string;
}

export function StudentReportModal({
  student,
  courses,
  exams,
  isOpen,
  onClose,
  formatGrade,
}: StudentReportModalProps) {
  const locale = useLocale();
  const tDetails = useTranslations("studentsPage.details");
  const tReport = useTranslations("studentsPage.details.reportModal");

  const reportRef = React.useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  const fullName = [student.firstName, student.middleName, student.lastName, student.additionalName]
    .filter(Boolean)
    .join(" ");

  const generatedDateStr = new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const currentYear = new Date().getFullYear();

  // Metrics calculation
  const enrolledCoursesList = courses.slice(0, student.coursesCount || 3);
  const examsCount = 12;
  const correctQuestions = 140;
  const wrongQuestions = 20;
  const totalQuestions = correctQuestions + wrongQuestions;
  const avgPoints = 88; // out of 100

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;

    try {
      setIsGeneratingPdf(true);

      // Package all the required translations into a single object
      // This prevents React-PDF from trying to run context hooks inside its isolated renderer
      const strings = {
        grade: formatGrade(student.grade),
        currentYear: tReport("currentYear", { year: currentYear }),
        generatedAt: tReport("reportGeneratedAt", { date: generatedDateStr }),
        statsTitle: tReport("performanceStats.title"),
        statsSubtitle: tReport("performanceStats.subtitle"),
        questionsAnswered: tReport("performanceStats.questionsAnswered"),
        examsPerformed: tReport("performanceStats.examsPerformed"),
        coursesEnrolled: tReport("performanceStats.coursesEnrolled"),
        avgPoints: tReport("performanceStats.avgPoints"),
        examsTitle: tReport("examHistory.title"),
        examName: tReport("examHistory.examName"),
        courseName: tReport("examHistory.courseName"),
        date: tReport("examHistory.datePerformed"),
        tries: tReport("examHistory.tries"),
        result: tReport("examHistory.result"),
        coursesTitle: tReport("coursesOverview.title"),
      };

      // Generate the PDF as a blob in memory
      const blob = await pdf(
        <StudentReportPDF
          student={student}
          courses={courses}
          exams={exams}
          locale={locale}
          strings={strings}
        />,
      ).toBlob();

      // Create a temporary link to trigger the download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `student-report-${student.id}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF document:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[88vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-4 border-b border-border bg-muted/20">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            <span>{tReport("title")}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-6">
          <div
            ref={reportRef}
            className="student-report-print p-6 space-y-6 bg-white text-slate-900 rounded-xl"
          >
            {/* Top Logo & App Name Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <LogoIcon width={24} height={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-foreground">
                    رواء | Rewaa
                  </h2>
                  <p className="text-xs text-muted-foreground">{tReport("title")}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs font-mono px-3 py-1" dir="ltr">
                #{student.id}
              </Badge>
            </div>

            {/* 1st Div: Primary Background Header with Student Info */}
            <div className="bg-primary text-primary-foreground p-6 rounded-2xl text-center space-y-3 shadow-xs">
              {/* Centered Avatar Image 80x80 (rounded-full) */}
              <div className="size-20 rounded-full overflow-hidden border-4 border-white/20 mx-auto bg-white/10 flex items-center justify-center shadow-md">
                {student.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={student.image} alt={fullName} className="size-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-white">
                    {locale === "ar"
                      ? `${student.firstName[0]}. ${student.lastName[0]}.`
                      : `${student.firstName[0]}${student.lastName[0]}`}
                  </span>
                )}
              </div>

              {/* Full Name */}
              <h3 className="text-2xl font-black tracking-tight">{fullName}</h3>

              {/* Grade & Current Year */}
              <p className="text-sm font-medium text-white/90 flex items-center justify-center gap-2">
                <GraduationCap className="size-4" />
                <span>{formatGrade(student.grade)}</span>
                <span>•</span>
                <span>{tReport("currentYear", { year: currentYear })}</span>
              </p>

              {/* Horizontal Separator */}
              <hr className="border-white/20 my-3" />

              {/* Icon + Report generated at */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/80">
                <Clock className="size-3.5" />
                <span>{tReport("reportGeneratedAt", { date: generatedDateStr })}</span>
              </div>
            </div>

            {/* 2nd Div: Performance & Statistics */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <TrendingUp className="size-5 text-primary" />
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {tReport("performanceStats.title")}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {tReport("performanceStats.subtitle")}
                  </p>
                </div>
              </div>

              {/* 4 Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Stat 1: Questions Answered */}
                <div className="p-4 rounded-xl border border-border/60 bg-muted/30 text-center space-y-1">
                  <HelpCircle className="size-5 text-primary mx-auto" />
                  <p className="text-xl font-black text-foreground">{totalQuestions}</p>
                  <p className="text-xs font-semibold text-foreground">
                    {tReport("performanceStats.questionsAnswered")}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {tReport("performanceStats.correctAndWrong", {
                      correct: correctQuestions,
                      wrong: wrongQuestions,
                    })}
                  </p>
                </div>

                {/* Stat 2: Exams Performed */}
                <div className="p-4 rounded-xl border border-border/60 bg-muted/30 text-center space-y-1 flex flex-col justify-center">
                  <FileCheck2 className="size-5 text-purple-600 dark:text-purple-400 mx-auto" />
                  <p className="text-xl font-black text-foreground">{examsCount}</p>
                  <p className="text-xs font-semibold text-foreground">
                    {tReport("performanceStats.examsPerformed")}
                  </p>
                </div>

                {/* Stat 3: Courses Enrolled */}
                <div className="p-4 rounded-xl border border-border/60 bg-muted/30 text-center space-y-1 flex flex-col justify-center">
                  <BookOpen className="size-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="text-xl font-black text-foreground">{student.coursesCount || 0}</p>
                  <p className="text-xs font-semibold text-foreground">
                    {tReport("performanceStats.coursesEnrolled")}
                  </p>
                </div>

                {/* Stat 4: Average Points */}
                <div className="p-4 rounded-xl border border-border/60 bg-muted/30 text-center space-y-1 flex flex-col justify-center">
                  <Award className="size-5 text-amber-500 mx-auto" />
                  <p className="text-xl font-black text-foreground">{avgPoints} / 100</p>
                  <p className="text-xs font-semibold text-foreground">
                    {tReport("performanceStats.avgPoints")}
                  </p>
                </div>
              </div>
            </div>

            {/* 3rd Div: Exam History */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <FileCheck2 className="size-5 text-primary" />
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {tReport("examHistory.title")}
                  </h4>
                  <p className="text-xs text-muted-foreground">{tReport("examHistory.subtitle")}</p>
                </div>
              </div>

              {/* Exams History Table */}
              <div className="border border-border/60 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>{tReport("examHistory.examName")}</TableHead>
                      <TableHead>{tReport("examHistory.courseName")}</TableHead>
                      <TableHead>{tReport("examHistory.datePerformed")}</TableHead>
                      <TableHead className="text-center">{tReport("examHistory.tries")}</TableHead>
                      <TableHead className="text-end">{tReport("examHistory.result")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.slice(0, 5).map((exam, idx) => {
                      const score = 92 - idx * 7;
                      const isPassed = score >= 60;
                      return (
                        <TableRow key={exam.id}>
                          <TableCell className="font-bold text-xs text-foreground">
                            {exam.title}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {exam.courseTitle || "-"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(exam.createdAt).toLocaleDateString(
                              locale === "ar" ? "ar-EG" : "en-GB",
                              { year: "numeric", month: "short", day: "numeric" },
                            )}
                          </TableCell>
                          <TableCell className="text-center text-xs font-mono">1</TableCell>
                          <TableCell className="text-end">
                            <div
                              className="inline-flex items-center gap-1.5 font-bold text-xs"
                              dir="ltr"
                            >
                              <span>{score}%</span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  isPassed
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                }`}
                              >
                                {isPassed
                                  ? tDetails("examsTab.passed")
                                  : tDetails("examsTab.failed")}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 4th Div: Courses Overview */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <BookOpen className="size-5 text-primary" />
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {tReport("coursesOverview.title")}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {tReport("coursesOverview.subtitle")}
                  </p>
                </div>
              </div>

              {/* 1 Column List of Courses with Progress Bar */}
              <div className="space-y-3">
                {enrolledCoursesList.map((course, idx) => {
                  const progressPct = 80 - idx * 18;
                  return (
                    <div
                      key={course.id}
                      className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-foreground text-sm">{course.title}</span>
                        <span className="text-primary font-mono">{progressPct}%</span>
                      </div>
                      <Progress value={progressPct} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 pb-8 pe-8 border-t border-border bg-muted/20 gap-2">
          <Button variant="outline" onClick={onClose} disabled={isGeneratingPdf}>
            {tDetails("invoice.close")}
          </Button>
          <Button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="gap-2 font-bold"
          >
            {isGeneratingPdf ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {tReport("downloadPdf")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
