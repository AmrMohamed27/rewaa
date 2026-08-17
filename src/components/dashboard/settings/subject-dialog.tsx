"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubjectItem } from "@/types/settings";

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectToEdit?: SubjectItem | null;
  onSave: (subject: { id?: string; name: string }) => void;
}

export function SubjectDialog({ open, onOpenChange, subjectToEdit, onSave }: SubjectDialogProps) {
  const t = useTranslations("settings.subjects.dialog");

  const [name, setName] = useState("");

  const [prevSubject, setPrevSubject] = useState<SubjectItem | null | undefined>(undefined);
  const [prevOpen, setPrevOpen] = useState(false);

  if (open !== prevOpen || subjectToEdit !== prevSubject) {
    setPrevOpen(open);
    setPrevSubject(subjectToEdit);
    if (subjectToEdit) {
      setName(subjectToEdit.name || "");
    } else {
      setName("");
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: subjectToEdit?.id,
      name: name.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{subjectToEdit ? t("titleEdit") : t("titleAdd")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Subject Name */}
          <div className="space-y-2">
            <Label htmlFor="subject-name">{t("nameLabel")}</Label>
            <Input
              id="subject-name"
              required
              placeholder={t("namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
