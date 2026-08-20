import React, { Suspense } from "react";
import { BillingRequestsClient } from "@/components/dashboard/billing/billing-requests-client";

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-8 animate-pulse">Loading...</div>}>
      <BillingRequestsClient />
    </Suspense>
  );
}
