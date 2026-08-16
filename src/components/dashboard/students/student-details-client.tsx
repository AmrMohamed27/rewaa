/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Edit2,
  Eye,
  FileCheck2,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Users,
  Wallet,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

import { DashboardCard } from "@/components/dashboard/overview/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStoredCourses } from "@/lib/courses-storage";
import { getStoredExams } from "@/lib/exams-storage";
import { getStudentById, updateStoredStudent } from "@/lib/students-storage";
import { Course } from "@/types/course";
import { Exam } from "@/types/exam";
import { RegistrationType, Student, StudentTransaction, TransactionType } from "@/types/student";
import { BalanceTransactionDialog } from "./balance-transaction-dialog";
import { StudentInvoiceModal } from "./student-invoice-modal";
import { StudentReportModal } from "./student-report-modal";

interface StudentDetailsClientProps {
  studentId: string;
}

const REGISTRATION_TYPE_BADGES: Record<RegistrationType, string> = {
  center: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  online: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  hybrid: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  external: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

function formatDate(iso?: string, locale: string = "ar") {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Mock mock transactions generator if student has none stored
function getMockStudentTransactions(studentId: string): StudentTransaction[] {
  return [
    {
      id: `tx-${studentId}-101`,
      studentId,
      type: "deposit",
      amount: 500,
      notes: "إيداع رصيد من السنتر / Center deposit",
      createdAt: "2026-02-15T14:30:00Z",
    },
    {
      id: `tx-${studentId}-102`,
      studentId,
      type: "withdraw",
      amount: 150,
      notes: "اشتراك في دورة الفيزياء الحديثة / Modern Physics Course",
      createdAt: "2026-02-18T10:15:00Z",
    },
  ];
}

export function StudentDetailsClient({ studentId }: StudentDetailsClientProps) {
  const locale = useLocale();

  const t = useTranslations("studentsPage");
  const tDetails = useTranslations("studentsPage.details");
  const tModal = useTranslations("studentsPage.transactionModal");
  const tGrades = useTranslations("courses.new.grades");

  const [student, setStudent] = React.useState<Student | null>(null);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [exams, setExams] = React.useState<Exam[]>([]);
  const [transactions, setTransactions] = React.useState<StudentTransaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [isTransactionOpen, setIsTransactionOpen] = React.useState(false);
  const [selectedInvoiceTransaction, setSelectedInvoiceTransaction] =
    React.useState<StudentTransaction | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = React.useState(false);
  const [isReportOpen, setIsReportOpen] = React.useState(false);

  React.useEffect(() => {
    const found = getStudentById(locale, studentId);
    const allCourses = getStoredCourses(locale);
    const allExams = getStoredExams(locale);
    setStudent(found);
    setCourses(allCourses);
    setExams(allExams);
    setTransactions(getMockStudentTransactions(studentId));
    setIsLoading(false);
  }, [studentId, locale]);

  const formatGrade = React.useCallback(
    (key?: string) => {
      if (!key) return "";
      return tGrades.has(key as Parameters<typeof tGrades.has>[0])
        ? tGrades(key as Parameters<typeof tGrades>[0])
        : key;
    },
    [tGrades],
  );

  if (isLoading) {
    return (
      <div className="p-12 text-center text-muted-foreground animate-pulse">
        {tDetails("personalInfoSubtitle")}...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <Users className="size-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">{tDetails("notFoundTitle")}</h2>
        <p className="text-sm text-muted-foreground">{tDetails("notFoundDesc")}</p>
        <Button asChild variant="outline">
          <Link href={`/${locale}/dashboard/students`}>
            <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
            {tDetails("backToStudents")}
          </Link>
        </Button>
      </div>
    );
  }

  const fullName = [student.firstName, student.middleName, student.lastName, student.additionalName]
    .filter(Boolean)
    .join(" ");

  const regTypeLabel = t(
    `registrationTypes.${student.registrationType}` as Parameters<typeof t>[0],
  );

  const enrolledCoursesList = courses.slice(0, student.coursesCount || 3);

  // Performance calculation numbers (mocked intelligently per student)
  const avgScore = 88;
  const examsCount = 12;
  const correctQuestions = 140;
  const wrongQuestions = 20;
  const totalQuestions = correctQuestions + wrongQuestions;
  const correctPct = Math.round((correctQuestions / totalQuestions) * 100);

  const handleTransactionSubmit = ({
    type,
    amount,
    notes,
  }: {
    type: TransactionType;
    amount: number;
    notes?: string;
  }) => {
    if (!student) return;
    const current = student.balance ?? 0;
    let newBalance = current;

    if (type === "deposit" || type === "refund") {
      newBalance = current + amount;
    } else if (type === "withdraw") {
      newBalance = Math.max(0, current - amount);
    } else if (type === "adjustment") {
      newBalance = amount;
    }

    const updated = updateStoredStudent(locale, student.id, { balance: newBalance });
    if (updated) {
      setStudent(updated);
      const newTx: StudentTransaction = {
        id: `tx-${student.id}-${Date.now().toString().slice(-4)}`,
        studentId: student.id,
        type,
        amount,
        notes,
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const handleOpenInvoice = (tx: StudentTransaction) => {
    setSelectedInvoiceTransaction(tx);
    setIsInvoiceOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 1: STUDENT INFO BANNER / HEADER CARD
          - Image/Avatar
          - Full Name
          - Subtitle: Grade + Joined Date + Location
          - CTAs: Edit, Manage Balance, Send Message
      ────────────────────────────────────────────────────────────────────────────── */}
      <DashboardCard className="overflow-hidden border-border/80 shadow-xs">
        <div className="p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 bg-linear-to-r from-primary/5 via-card to-card">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-start">
            {/* Standard Round Back Button Header Navigation Component */}
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full shrink-0"
              >
                <Link href={`/${locale}/dashboard/students`}>
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>

            {/* Avatar / Image Div */}
            <div className="relative size-20 sm:size-24 rounded-2xl overflow-hidden bg-primary/10 border-2 border-primary/20 shrink-0 flex items-center justify-center shadow-xs">
              {student.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={student.image} alt={fullName} className="size-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-primary">
                  {locale === "ar"
                    ? `${student.firstName[0]}. ${student.lastName[0]}.`
                    : `${student.firstName[0]}${student.lastName[0]}`}
                </span>
              )}
            </div>

            {/* Student Meta Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  {fullName}
                </h1>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${REGISTRATION_TYPE_BADGES[student.registrationType]}`}
                >
                  {regTypeLabel}
                </Badge>
              </div>

              {/* Subtitle: Grade + Joined Date + Country & State */}
              <p className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1">
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <GraduationCap className="size-3.5 text-primary" />
                  {formatGrade(student.grade)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  {tDetails("joinedIn", { date: formatDate(student.createdAt, locale) })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  {student.country} - {student.state}
                </span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1" dir="ltr">
                  <Phone className="size-3 text-muted-foreground" />
                  {student.phoneNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="size-3 text-muted-foreground" />
                  {student.email}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center sm:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
            {/* Edit Button */}
            <Button asChild variant="outline" size="sm" className="gap-2 font-semibold">
              <Link href={`/${locale}/dashboard/students/${student.id}/edit`}>
                <Edit2 className="size-3.5" />
                <span>{tDetails("editStudent")}</span>
              </Link>
            </Button>

            {/* Generate Report Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsReportOpen(true)}
              className="gap-2 border-primary/30 text-primary hover:bg-primary/10 font-semibold"
            >
              <FileText className="size-3.5" />
              <span>{tDetails("generateReport")}</span>
            </Button>

            {/* Manage Balance Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsTransactionOpen(true)}
              className="gap-2 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 font-semibold"
            >
              <Wallet className="size-3.5" />
              <span>{tDetails("manageBalance")}</span>
            </Button>

            {/* Send Message CTA (No-op for now) */}
            <Button size="sm" variant="default" className="gap-2 font-semibold shadow-xs">
              <MessageSquare className="size-3.5" />
              <span>{tDetails("sendMessage")}</span>
            </Button>
          </div>
        </div>
      </DashboardCard>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 2: METRICS & STATS DIV
          - Average score in exams
          - Current balance
          - Number of courses enrolled in
          - Number of exams performed
          - Performance in questions: progress bar (green correct, red wrong)
      ────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Avg Score */}
        <DashboardCard className="p-4 flex flex-col items-center justify-center text-center gap-2 bg-card hover:border-primary/40 transition-colors">
          <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-foreground">{avgScore}%</p>
            <p className="text-xs text-muted-foreground font-medium">{tDetails("avgExamScore")}</p>
          </div>
        </DashboardCard>

        {/* Metric 2: Current Balance */}
        <DashboardCard className="p-4 flex flex-col items-center justify-center text-center gap-2 bg-linear-to-br from-emerald-500/10 via-card to-card border-emerald-500/20">
          <div className="size-11 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Wallet className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-foreground" dir="ltr">
              {student.balance ?? 0} {tDetails("currency")}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              {tDetails("currentBalance")}
            </p>
          </div>
        </DashboardCard>

        {/* Metric 3: Courses Count */}
        <DashboardCard className="p-4 flex flex-col items-center justify-center text-center gap-2 bg-card hover:border-primary/40 transition-colors">
          <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-foreground">{student.coursesCount || 0}</p>
            <p className="text-xs text-muted-foreground font-medium">
              {tDetails("enrolledCoursesCount")}
            </p>
          </div>
        </DashboardCard>

        {/* Metric 4: Exams Performed */}
        <DashboardCard className="p-4 flex flex-col items-center justify-center text-center gap-2 bg-card hover:border-primary/40 transition-colors">
          <div className="size-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <FileCheck2 className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-foreground">{examsCount}</p>
            <p className="text-xs text-muted-foreground font-medium">
              {tDetails("examsPerformed")}
            </p>
          </div>
        </DashboardCard>

        {/* Metric 5: Performance in Questions (Green / Red Progress Bar) */}
        <DashboardCard className="p-4 space-y-2 bg-card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground">{tDetails("questionPerformance")}</span>
            <span className="font-mono text-muted-foreground">{correctPct}%</span>
          </div>

          {/* Dual Segment Progress Bar */}
          <div className="h-3 w-full rounded-full bg-rose-500/20 overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${correctPct}%` }}
              title={`${correctQuestions} ${tDetails("correctQuestions")}`}
            />
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${100 - correctPct}%` }}
              title={`${wrongQuestions} ${tDetails("wrongQuestions")}`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="size-2 rounded-full bg-emerald-500 inline-block" />
              {correctQuestions} {tDetails("correctQuestions")}
            </span>
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
              <span className="size-2 rounded-full bg-rose-500 inline-block" />
              {wrongQuestions} {tDetails("wrongQuestions")}
            </span>
          </div>
        </DashboardCard>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 3: TAB SELECTOR DIV
          - Courses
          - Exams
          - Billing History
      ────────────────────────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-xl w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="courses" className="rounded-lg text-xs sm:text-sm font-bold">
            <BookOpen className="size-4 me-2 hidden sm:inline-block" />
            {tDetails("tabs.courses")}
          </TabsTrigger>
          <TabsTrigger value="exams" className="rounded-lg text-xs sm:text-sm font-bold">
            <FileCheck2 className="size-4 me-2 hidden sm:inline-block" />
            {tDetails("tabs.exams")}
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg text-xs sm:text-sm font-bold">
            <Wallet className="size-4 me-2 hidden sm:inline-block" />
            {tDetails("tabs.billingHistory")}
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: COURSES ───────────────────────────────────────────────────── */}
        <TabsContent value="courses" className="space-y-4">
          {enrolledCoursesList.length === 0 ? (
            <DashboardCard className="p-8 text-center text-muted-foreground border-dashed">
              {tDetails("noCoursesEnrolled")}
            </DashboardCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledCoursesList.map((course, idx) => {
                const progressPct = 75 - idx * 15;
                const courseExamsCount = 4 - idx;
                const courseCorrectAnswers = 35 - idx * 5;

                return (
                  <DashboardCard
                    key={course.id}
                    className="p-5 space-y-4 hover:border-primary/40 transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {formatGrade(course.grade)}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-mono" dir="ltr">
                          #{course.id}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-foreground text-base line-clamp-1">
                          {course.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{course.teacherName}</p>
                      </div>

                      {/* Course Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">
                            {tDetails("coursesTab.progress")}
                          </span>
                          <span className="text-primary">{progressPct}%</span>
                        </div>
                        <Progress value={progressPct} className="h-2" />
                      </div>
                    </div>

                    {/* Stats & Joined Date Under Course Card */}
                    <div className="pt-3 border-t border-border/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <FileCheck2 className="size-3.5 text-primary" />
                          {tDetails("coursesTab.examsPerformed", { count: courseExamsCount })}
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-3.5" />
                          {tDetails("coursesTab.correctQuestions", { count: courseCorrectAnswers })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                        <span>{tDetails("coursesTab.joinedDate")}:</span>
                        <span className="font-medium text-foreground">
                          {formatDate(student.createdAt, locale)}
                        </span>
                      </div>
                    </div>
                  </DashboardCard>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ─── TAB 2: EXAMS ────────────────────────────────────────────────────── */}
        <TabsContent value="exams" className="space-y-4">
          {exams.length === 0 ? (
            <DashboardCard className="p-8 text-center text-muted-foreground border-dashed">
              {tDetails("examsTab.empty")}
            </DashboardCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.slice(0, 6).map((exam, i) => {
                const score = 90 - i * 6;
                const isPassed = score >= 60;
                return (
                  <DashboardCard
                    key={exam.id}
                    className="p-4 space-y-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          isPassed
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        }`}
                      >
                        {isPassed ? tDetails("examsTab.passed") : tDetails("examsTab.failed")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(exam.createdAt, locale)}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-foreground text-sm line-clamp-1">
                        {exam.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{exam.courseTitle}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">{tDetails("examsTab.score")}</span>
                        <span
                          className={
                            isPassed ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"
                          }
                        >
                          {score}%
                        </span>
                      </div>
                      <Progress value={score} className="h-1.5" />
                    </div>
                  </DashboardCard>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ─── TAB 3: BILLING HISTORY ───────────────────────────────────────────── */}
        <TabsContent value="billing" className="space-y-4">
          <DashboardCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-30">{tDetails("billingTab.id")}</TableHead>
                    <TableHead>{tDetails("billingTab.type")}</TableHead>
                    <TableHead>{tDetails("billingTab.amount")}</TableHead>
                    <TableHead>{tDetails("billingTab.date")}</TableHead>
                    <TableHead>{tDetails("billingTab.notes")}</TableHead>
                    <TableHead className="text-end">{tDetails("billingTab.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {tDetails("billingTab.empty")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => {
                      const isDeposit = tx.type === "deposit" || tx.type === "refund";
                      return (
                        <TableRow key={tx.id} className="hover:bg-muted/20">
                          <TableCell className="font-mono font-medium text-xs" dir="ltr">
                            #{tx.id}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                isDeposit
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              }`}
                            >
                              {tModal(`types.${tx.type}` as Parameters<typeof tModal>[0])}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-foreground" dir="ltr">
                            {isDeposit ? "+" : "-"}
                            {tx.amount} {tDetails("currency")}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatDate(tx.createdAt, locale)}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-50 truncate">
                            {tx.notes || "-"}
                          </TableCell>
                          <TableCell className="text-end">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOpenInvoice(tx)}
                                className="h-8 gap-1 text-xs font-semibold hover:text-primary"
                              >
                                <Eye className="size-3.5" />
                                <span>{tDetails("billingTab.viewInvoice")}</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>

      {/* Balance Transaction Dialog */}
      <BalanceTransactionDialog
        studentName={fullName}
        currentBalance={student.balance ?? 0}
        isOpen={isTransactionOpen}
        onClose={() => setIsTransactionOpen(false)}
        onConfirm={handleTransactionSubmit}
      />

      {/* Printable Invoice Modal */}
      {selectedInvoiceTransaction && (
        <StudentInvoiceModal
          student={student}
          transaction={selectedInvoiceTransaction}
          isOpen={isInvoiceOpen}
          onClose={() => {
            setIsInvoiceOpen(false);
            setSelectedInvoiceTransaction(null);
          }}
        />
      )}

      {/* Student Comprehensive Report Modal */}
      <StudentReportModal
        student={student}
        courses={courses}
        exams={exams}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        formatGrade={formatGrade}
      />
    </div>
  );
}
