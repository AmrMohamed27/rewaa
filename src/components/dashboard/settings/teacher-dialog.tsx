/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Teacher } from "@/types/settings";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { getStoredGrades, getStoredSubjects } from "@/lib/settings-storage";

interface TeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherToEdit?: Teacher | null;
  onSave: (teacher: Omit<Teacher, "id"> & { id?: string }) => void;
}

const AVAILABLE_GRADES = [
  { id: "grade_1", label: "الصف الأول الابتدائي" },
  { id: "grade_2", label: "الصف الثاني الابتدائي" },
  { id: "grade_3", label: "الصف الثالث الابتدائي" },
  { id: "grade_4", label: "الصف الرابع الابتدائي" },
  { id: "grade_5", label: "الصف الخامس الابتدائي" },
  { id: "grade_6", label: "الصف السادس الابتدائي" },
  { id: "grade_7", label: "الصف الأول الإعدادي" },
  { id: "grade_8", label: "الصف الثاني الإعدادي" },
  { id: "grade_9", label: "الصف الثالث الإعدادي" },
  { id: "grade_10", label: "الصف الأول الثانوي" },
  { id: "grade_11", label: "الصف الثاني الثانوي" },
  { id: "grade_12", label: "الصف الثالث الثانوي" },
];

const AVAILABLE_SUBJECTS = [
  { id: "الفيزياء", label: "الفيزياء" },
  { id: "الكيمياء", label: "الكيمياء" },
  { id: "الأحياء", label: "الأحياء" },
  { id: "الرياضيات", label: "الرياضيات" },
  { id: "اللغة العربية", label: "اللغة العربية" },
  { id: "اللغة الإنجليزية", label: "اللغة الإنجليزية" },
  { id: "اللغة الفرنسية", label: "اللغة الفرنسية" },
  { id: "التاريخ", label: "التاريخ" },
  { id: "الجغرافيا", label: "الجغرافيا" },
  { id: "الفلسفة والمنطق", label: "الفلسفة والمنطق" },
];

export function TeacherDialog({ open, onOpenChange, teacherToEdit, onSave }: TeacherDialogProps) {
  const t = useTranslations("settings.teachers.dialog");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [prevTeacher, setPrevTeacher] = useState<Teacher | null | undefined>(undefined);
  const [prevOpen, setPrevOpen] = useState(false);

  const [gradesList, setGradesList] = useState(AVAILABLE_GRADES);
  const [subjectsList, setSubjectsList] = useState(AVAILABLE_SUBJECTS);

  useEffect(() => {
    if (open) {
      const storedG = getStoredGrades();
      if (storedG.length > 0) {
        setGradesList(storedG.map((g) => ({ id: g.id, label: g.name })));
      }
      const storedS = getStoredSubjects();
      if (storedS.length > 0) {
        setSubjectsList(storedS.map((s) => ({ id: s.name, label: s.name })));
      }
    }
  }, [open]);

  if (open !== prevOpen || teacherToEdit !== prevTeacher) {
    setPrevOpen(open);
    setPrevTeacher(teacherToEdit);
    if (teacherToEdit) {
      setName(teacherToEdit.name || "");
      setPhone(teacherToEdit.phone || "");
      setImage(teacherToEdit.image || "");
      setSelectedGrades(teacherToEdit.grades || []);
      setSelectedSubjects(teacherToEdit.subjects || []);
    } else {
      setName("");
      setPhone("");
      setImage("");
      setSelectedGrades([]);
      setSelectedSubjects([]);
    }
  }

  const toggleGrade = (gradeId: string) => {
    setSelectedGrades((prev) =>
      prev.includes(gradeId) ? prev.filter((g) => g !== gradeId) : [...prev, gradeId],
    );
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((s) => s !== subjectId) : [...prev, subjectId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: teacherToEdit?.id,
      name: name.trim(),
      phone: phone.trim(),
      image,
      grades: selectedGrades,
      subjects: selectedSubjects,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{teacherToEdit ? t("titleEdit") : t("titleAdd")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Image Upload Area */}
          <ImageUploadField
            id="teacher-profile-image"
            label={t("imageUpload")}
            value={image}
            onChange={(dataUrl) => setImage(dataUrl)}
            onClear={() => setImage("")}
            variant="avatar"
            prompt={t("imageUpload")}
            changePrompt={t("imageChange")}
            previewAlt="Teacher profile"
          />

          {/* Teacher Name */}
          <div className="space-y-2">
            <Label htmlFor="teacher-name">{t("nameLabel")}</Label>
            <Input
              id="teacher-name"
              required
              placeholder={t("namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="teacher-phone">{t("phoneLabel")}</Label>
            <Input
              id="teacher-phone"
              type="tel"
              dir="ltr"
              placeholder={t("phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rtl:text-end"
            />
          </div>

          {/* Grades Select Buttons */}
          <div className="space-y-2">
            <Label>{t("gradesLabel")}</Label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-lg border bg-muted/10 max-h-36 overflow-y-auto">
              {gradesList.map((g) => {
                const isSelected = selectedGrades.includes(g.id);
                return (
                  <Badge
                    key={g.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-all px-2.5 py-1 text-xs select-none ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => toggleGrade(g.id)}
                  >
                    {isSelected && <Check className="size-3 me-1 shrink-0" />}
                    {g.label}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Subjects Select Buttons */}
          <div className="space-y-2">
            <Label>{t("subjectsLabel")}</Label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-lg border bg-muted/10 max-h-36 overflow-y-auto">
              {subjectsList.map((s) => {
                const isSelected = selectedSubjects.includes(s.id);
                return (
                  <Badge
                    key={s.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-all px-2.5 py-1 text-xs select-none ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => toggleSubject(s.id)}
                  >
                    {isSelected && <Check className="size-3 me-1 shrink-0" />}
                    {s.label}
                  </Badge>
                );
              })}
            </div>
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
