/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StudentForm, StudentFormData } from "@/components/dashboard/students/student-form";
import { getStudentById, updateStoredStudent } from "@/lib/students-storage";
import { Student } from "@/types/student";

interface EditStudentClientProps {
  studentId: string;
}

export function EditStudentClient({ studentId }: EditStudentClientProps) {
  const locale = useLocale();
  const router = useRouter();

  const tForm = useTranslations("studentsPage.form");
  const tDetails = useTranslations("studentsPage.details");

  const [student, setStudent] = React.useState<Student | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const found = getStudentById(locale, studentId);
    setStudent(found);
    setIsLoading(false);
  }, [studentId, locale]);

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

  const handleSubmit = (data: StudentFormData) => {
    updateStoredStudent(locale, studentId, {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      additionalName: data.additionalName,
      phoneNumber: data.phoneNumber,
      parentPhoneNumber: data.parentPhoneNumber,
      gender: data.gender,
      email: data.email,
      image: data.image,
      password: data.password || student.password,
      country: data.country,
      state: data.state,
      grade: data.grade,
      registrationType: data.registrationType,
    });

    router.push(`/${locale}/dashboard/students/${studentId}`);
  };

  const handleCancel = () => {
    router.push(`/${locale}/dashboard/students/${studentId}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Row with Standardized Round Back Button */}
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0">
          <Link href={`/${locale}/dashboard/students/${studentId}`}>
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {tForm("editTitle")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tForm("editSubtitle")}</p>
        </div>
      </div>

      {/* Main Student Form */}
      <StudentForm
        initialData={student}
        isEditing={true}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
