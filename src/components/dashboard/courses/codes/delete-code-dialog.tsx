"use client";

import { useTranslations } from "next-intl";
import { ActivationCode } from "@/types/activation-code";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteCodeDialogProps {
  codeToDelete: ActivationCode | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCodeDialog({ codeToDelete, onClose, onConfirm }: DeleteCodeDialogProps) {
  const t = useTranslations("groupCodesPage.deleteDialog");

  return (
    <Dialog open={!!codeToDelete} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{t("title")}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pt-1">
            {t("description", { code: codeToDelete?.code || "" })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
