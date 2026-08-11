"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CreditCard, ArrowUpRight, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dashboardMockData } from "@/lib/mockData";

export type BillingRequest = (typeof dashboardMockData.billingRequests)[number];

interface LastBillingRequestsCardProps {
  billingRequests: BillingRequest[];
  onSelectInvoice: (invoice: BillingRequest) => void;
}

export function LastBillingRequestsCard({
  billingRequests,
  onSelectInvoice,
}: LastBillingRequestsCardProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="lg:col-span-4 rounded-2xl border bg-card p-6 flex flex-col justify-between shadow-sm overflow-hidden">
      <div className="w-full flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="size-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                {t("lastBillingRequests")}
              </h2>
              <Badge
                variant="outline"
                className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              >
                {t("pendingRequestsCount", { count: billingRequests.length })}
              </Badge>
            </div>
            <Link
              href="/dashboard/billing"
              className="text-xs font-medium text-primary hover:underline shrink-0 inline-flex items-center gap-1"
            >
              {t("manageBilling")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {/* Table */}
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs">{t("billingTable.name")}</TableHead>
                  <TableHead className="text-xs">{t("billingTable.amount")}</TableHead>
                  <TableHead className="text-xs hidden sm:table-cell">
                    {t("billingTable.paymentMethod")}
                  </TableHead>
                  <TableHead className="text-xs text-end">{t("billingTable.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs font-medium">
                      {t(`studentsList.${req.studentKey}`)}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      {t("currencyEgp", { amount: req.amountValue })}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                      {t(`paymentMethods.${req.paymentMethodKey}`)}
                    </TableCell>
                    <TableCell className="text-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => onSelectInvoice(req)}
                        title={t("billingTable.viewInvoice")}
                      >
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
