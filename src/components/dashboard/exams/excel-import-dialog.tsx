"use client";

import { FileSpreadsheet, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExcelImportDisclaimerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExcelImportDisclaimerDialog({
  open,
  onOpenChange,
}: ExcelImportDisclaimerDialogProps) {
  const t = useTranslations("exams.step2.excelImport");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <FileSpreadsheet className="size-5" />
            <DialogTitle className="text-lg">{t("title")}</DialogTitle>
          </div>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Important Notice Box */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Info className="size-4 shrink-0" />
              <span>{t("noticeTitle")}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed ps-6">
              {t("noticeDescription")}
            </p>
          </div>

          {/* Excel Requirements Box */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              {t("requirementsTitle")}
            </h4>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
              <li>{t("req1")}</li>
              <li>{t("req2")}</li>
              <li>{t("req3")}</li>
              <li>{t("req4")}</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {t("gotIt")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
