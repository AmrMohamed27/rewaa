"use client";

import { useTranslations } from "next-intl";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteCourseDialogProps {
  courseToDelete: Course | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCourseDialog({
  courseToDelete,
  onClose,
  onConfirm,
}: DeleteCourseDialogProps) {
  const t = useTranslations("courses");

  return (
    <Dialog open={!!courseToDelete} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{t("deleteDialog.title")}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pt-1">
            {t("deleteDialog.description", { title: courseToDelete?.title || "" })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("deleteDialog.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("deleteDialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
