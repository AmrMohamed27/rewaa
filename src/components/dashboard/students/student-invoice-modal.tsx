"use client";

import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { LogoIcon } from "@/components/landing/layout/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Student, StudentTransaction } from "@/types/student";

interface StudentInvoiceModalProps {
  student: Student;
  transaction: StudentTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  autoPrint?: boolean;
}

export function StudentInvoiceModal({
  student,
  transaction,
  isOpen,
  onClose,
}: StudentInvoiceModalProps) {
  const tDetails = useTranslations("studentsPage.details");
  const tModal = useTranslations("studentsPage.transactionModal");

  const printRef = React.useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  if (!transaction) return null;

  const fullName = [student.firstName, student.middleName, student.lastName, student.additionalName]
    .filter(Boolean)
    .join(" ");

  const handleDownloadPdf = async () => {
    if (!printRef.current || isGeneratingPdf) return;

    try {
      setIsGeneratingPdf(true);
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Convert modern CSS colors (oklch, lab, oklab) to safe fallback RGB/hex for html2canvas
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.style) {
              const comp = window.getComputedStyle(htmlEl);
              const sanitizeColor = (val: string) =>
                val && (val.includes("lab") || val.includes("oklch") || val.includes("oklab"));

              if (sanitizeColor(comp.color)) {
                htmlEl.style.color = "#0f172a";
              }
              if (sanitizeColor(comp.backgroundColor)) {
                htmlEl.style.backgroundColor = htmlEl.classList.contains("bg-primary/10")
                  ? "#e0f2fe"
                  : "#f8fafc";
              }
              if (sanitizeColor(comp.borderColor)) {
                htmlEl.style.borderColor = "#cbd5e1";
              }
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      pdf.save(`invoice-${transaction.id}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF invoice:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const formattedDate = new Date(transaction.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isDeposit = transaction.type === "deposit" || transaction.type === "refund";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 flex flex-col overflow-hidden">
        <div ref={printRef} className="p-6 space-y-6 print:p-8 overflow-y-auto flex-1">
          {/* Printable Header with Logo & App Name */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <LogoIcon width={24} height={28} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-foreground">رواء | Rewaa</h2>
                <p className="text-xs text-muted-foreground">{tDetails("invoice.subtitle")}</p>
              </div>
            </div>
            <div className="text-end">
              <Badge
                variant="outline"
                className="text-xs font-mono px-3 py-1 bg-primary/5 text-primary border-primary/20"
                dir="ltr"
              >
                #{transaction.id}
              </Badge>
              <p className="text-[11px] text-muted-foreground mt-1">{formattedDate}</p>
            </div>
          </div>

          {/* Student & Invoice Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30 border border-border/60 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                {tDetails("invoice.billTo")}
              </span>
              <p className="font-bold text-foreground text-sm">{fullName}</p>
              <div className="flex justify-start">
                <p className="text-muted-foreground" dir="ltr">
                  {student.phoneNumber}
                </p>
              </div>
              <p className="text-muted-foreground">
                {student.country} - {student.state}
              </p>
            </div>

            <div className="space-y-1 text-end">
              <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                {tDetails("invoice.transactionDetails")}
              </span>
              <p className="font-semibold text-foreground">
                {tModal(`types.${transaction.type}` as Parameters<typeof tModal>[0])}
              </p>
              <p className="text-muted-foreground">{student.email}</p>
              <Badge
                variant="outline"
                className={`mt-1 font-bold ${
                  isDeposit
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                }`}
              >
                <CheckCircle2 className="size-3 me-1 inline-block" />
                {tDetails("invoice.statusCompleted")}
              </Badge>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium">
                {tDetails("invoice.amountLabel")}
              </span>
              {transaction.notes && (
                <p className="text-xs text-muted-foreground italic mt-0.5">{transaction.notes}</p>
              )}
            </div>
            <div className="text-2xl font-black text-primary" dir="ltr">
              {isDeposit ? "+" : "-"}
              {transaction.amount} {tDetails("currency")}
            </div>
          </div>

          {/* Footer Notes */}
          <div className="text-center pt-4 border-t border-border/40 text-[11px] text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">{tDetails("invoice.thankYou")}</p>
            <p>{tDetails("invoice.officialReceipt")}</p>
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 bg-muted/30 border-t border-border gap-2">
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
            {tDetails("invoice.print")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
