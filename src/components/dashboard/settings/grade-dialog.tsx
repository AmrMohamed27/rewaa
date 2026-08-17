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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradeItem } from "@/types/settings";

interface GradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gradeToEdit?: GradeItem | null;
  onSave: (grade: { id?: string; name: string; year: number }) => void;
}

export function GradeDialog({ open, onOpenChange, gradeToEdit, onSave }: GradeDialogProps) {
  const t = useTranslations("settings.grades.dialog");

  const [name, setName] = useState("");
  const [year, setYear] = useState<number>(10);

  const [prevGrade, setPrevGrade] = useState<GradeItem | null | undefined>(undefined);
  const [prevOpen, setPrevOpen] = useState(false);

  if (open !== prevOpen || gradeToEdit !== prevGrade) {
    setPrevOpen(open);
    setPrevGrade(gradeToEdit);
    if (gradeToEdit) {
      setName(gradeToEdit.name || "");
      setYear(gradeToEdit.year || 10);
    } else {
      setName("");
      setYear(10);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: gradeToEdit?.id,
      name: name.trim(),
      year: Number(year),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{gradeToEdit ? t("titleEdit") : t("titleAdd")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Grade Name */}
          <div className="space-y-2">
            <Label htmlFor="grade-name">{t("nameLabel")}</Label>
            <Input
              id="grade-name"
              required
              placeholder={t("namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Corresponding Year (1-12) */}
          <div className="space-y-2">
            <Label htmlFor="grade-year">{t("yearLabel")}</Label>
            <Select value={String(year)} onValueChange={(val) => setYear(Number(val))}>
              <SelectTrigger id="grade-year">
                <SelectValue placeholder={t("yearPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
