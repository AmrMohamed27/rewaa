"use client";

import React, { useState } from "react";
import { dashboardMockData } from "@/lib/mockData";
import {
  DashboardBanner,
  TotalStudentsCard,
  EducationalContentCard,
  ClassesDistributionCard,
  ExamActivityCard,
  LastBillingRequestsCard,
  InvoiceDetailsModal,
  GovernoratesBreakdown,
  BillingRequest,
} from "@/components/dashboard/overview";

const DashboardPage = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<BillingRequest | null>(null);

  const {
    students,
    educationalContent,
    classesDistribution,
    examActivityToday,
    billingRequests,
    governorates,
  } = dashboardMockData;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ROW 1: Banner */}
      <DashboardBanner />

      {/* ROW 2: Total Students & Educational Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <TotalStudentsCard students={students} />
        <EducationalContentCard educationalContent={educationalContent} />
      </div>

      {/* ROW 3: Classes Distribution, Exam Activity, Last Billing Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-128">
        <ClassesDistributionCard
          classesDistribution={classesDistribution}
          totalStudents={students.total}
        />
        <ExamActivityCard examActivityToday={examActivityToday} />
        <LastBillingRequestsCard
          billingRequests={billingRequests}
          onSelectInvoice={setSelectedInvoice}
        />
      </div>

      {/* ROW 4: Governorates Breakdown */}
      <GovernoratesBreakdown governorates={governorates} />

      {/* INVOICE MODAL */}
      <InvoiceDetailsModal
        selectedInvoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};

export default DashboardPage;
