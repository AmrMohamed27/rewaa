"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { CreditCard, Eye } from "lucide-react";
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
import { DashboardCard } from "./dashboard-card";
import { DashboardCardHeader } from "./dashboard-card-header";

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
    <DashboardCard className="lg:col-span-4 overflow-hidden">
      <div className="w-full flex flex-col h-full justify-between">
        <div>
          <DashboardCardHeader
            icon={<CreditCard className="size-5 text-primary" />}
            title={t("lastBillingRequests")}
            badge={
              <Badge
                variant="outline"
                className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              >
                {t("pendingRequestsCount", { count: billingRequests.length })}
              </Badge>
            }
            action={{
              label: t("manageBilling"),
              href: "/dashboard/billing",
            }}
          />

          {/* Table */}
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 *:rtl:text-start">
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
                    <TableCell className="text-start">
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
    </DashboardCard>
  );
}
