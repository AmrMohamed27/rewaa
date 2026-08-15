"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StudentForm, StudentFormData } from "@/components/dashboard/students/student-form";
import { addStoredStudent } from "@/lib/students-storage";

export function NewStudentClient() {
  const locale = useLocale();
  const router = useRouter();

  const tForm = useTranslations("studentsPage.form");

  const handleSubmit = (data: StudentFormData) => {
    addStoredStudent(locale, {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      additionalName: data.additionalName,
      phoneNumber: data.phoneNumber,
      parentPhoneNumber: data.parentPhoneNumber,
      gender: data.gender,
      email: data.email,
      password: data.password,
      country: data.country,
      state: data.state,
      grade: data.grade,
      registrationType: data.registrationType,
      coursesCount: 0,
    });

    router.push(`/${locale}/dashboard/students`);
  };

  const handleSaveDraft = (data: StudentFormData) => {
    addStoredStudent(locale, {
      firstName: data.firstName || "Draft Student",
      middleName: data.middleName,
      lastName: data.lastName || "Draft",
      additionalName: data.additionalName,
      phoneNumber: data.phoneNumber || "+2000000000",
      parentPhoneNumber: data.parentPhoneNumber || "+2000000000",
      gender: data.gender || "male",
      email: data.email || `draft-${Date.now()}@example.com`,
      password: data.password,
      country: data.country || "Egypt",
      state: data.state || "Cairo",
      grade: data.grade || "grade1",
      registrationType: data.registrationType || "center",
      coursesCount: 0,
    });

    router.push(`/${locale}/dashboard/students`);
  };

  const handleCancel = () => {
    router.push(`/${locale}/dashboard/students`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Row with Standardized Round Back Button */}
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0">
          <Link href={`/${locale}/dashboard/students`}>
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {tForm("createTitle")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tForm("createSubtitle")}</p>
        </div>
      </div>

      {/* Main Student Form */}
      <StudentForm onSubmit={handleSubmit} onSaveDraft={handleSaveDraft} onCancel={handleCancel} />
    </div>
  );
}
